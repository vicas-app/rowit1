import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { database } from '../firebase';
import { ref, onValue, set, off, push, remove, get } from 'firebase/database';

import { Queue, QueuePerson } from '../types';
import Logo from './common/Logo';
import LogoutIcon from './icons/LogoutIcon';
import Button from './common/Button';
import Card from './common/Card';
import QueueCard from './QueueCard';
import CreateQueueModal from './common/CreateQueueModal';
import QueueManagementPage from './QueueManagementPage';
import Spinner from './common/Spinner';

interface DashboardScreenProps {
  user: User;
  onLogout: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ user, onLogout }) => {
  const [queues, setQueues] = useState<Queue[]>([]);
  const [selectedQueue, setSelectedQueue] = useState<Queue | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    const urlRef = ref(database, 'url');
    get(urlRef).then((snapshot) => {
        if (snapshot.exists()) {
            setBaseUrl(snapshot.val());
        } else {
            console.warn("Base URL ('url' key) not found in the root of your database.");
        }
    }).catch(error => {
        console.error("Error fetching base URL:", error);
    });
  }, []);

  useEffect(() => {
    const queuesRef = ref(database, `queues/${user.uid}`);
    setIsLoading(true);

    const listener = onValue(queuesRef, (snapshot) => {
        const data = snapshot.val();
        const queuesArray: Queue[] = data ? Object.keys(data).map(key => {
            const queueData = data[key];
            let peopleArray: QueuePerson[] | null = null;
            if (queueData.people) {
                // Firebase can return array-like data as an object if it was saved with push keys or is sparse.
                if (typeof queueData.people === 'object' && !Array.isArray(queueData.people)) {
                    peopleArray = Object.keys(queueData.people).map(personKey => {
                        const personData = queueData.people[personKey];
                        // The person object in DB might have an 'id' field already from another client.
                        // If not, we use the key from the 'people' object.
                        return {
                            ...personData,
                            id: personData.id || personKey 
                        };
                    });
                } else if (Array.isArray(queueData.people)) {
                    // It's a dense array, but Firebase might return it with a null at index 0 or other indices.
                    // Filter out any null/undefined entries.
                    peopleArray = queueData.people.filter(p => p);
                }
            }
            return {...queueData, id: key, people: peopleArray};
        }) : [];
        
        setQueues(queuesArray);

        // Use a functional update to avoid adding selectedQueue to the dependency array.
        // This keeps the selected queue's data fresh in real-time without re-subscribing.
        setSelectedQueue(prevSelectedQueue => {
            if (prevSelectedQueue) {
                const updatedQueue = queuesArray.find(q => q.id === prevSelectedQueue.id);
                return updatedQueue || null; // Deselect if the queue was deleted from another session
            }
            return null; // No queue was selected, so keep it that way
        });
        
        setIsLoading(false);
    }, (error) => {
        console.error("Firebase read failed:", error);
        setIsLoading(false); // Stop loading on error
    });

    return () => {
        off(queuesRef, 'value', listener);
    };
  }, [user.uid]);
  
  const handleCreateQueue = (queueName: string) => {
    if(!queueName.trim()) return;
    const queuesRef = ref(database, `queues/${user.uid}`);
    const newQueueRef = push(queuesRef);
    
    const newQueue: Omit<Queue, 'id'> = {
        name: queueName,
        isActive: true,
        people: null,
        lastAssignedRow: 0,
    };

    set(newQueueRef, newQueue)
        .then(() => setCreateModalOpen(false))
        .catch(error => console.error("Error creating queue", error));
  };

  const handleUpdateQueue = (updatedQueue: Queue) => {
    const queueRef = ref(database, `queues/${user.uid}/${updatedQueue.id}`);
    const { id, ...queueData } = updatedQueue;

    // Fix for "Clear All": set people to null if array is empty to delete it in Firebase
    if (queueData.people && queueData.people.length === 0) {
        queueData.people = null;
    }

    set(queueRef, queueData).catch(error => console.error("Error updating queue", error));
  };

  const handleDeleteQueue = (queueId: string) => {
    if (window.confirm("Are you sure you want to delete this queue? This action cannot be undone.")) {
        const queueRef = ref(database, `queues/${user.uid}/${queueId}`);
        remove(queueRef)
            .then(() => {
                if (selectedQueue?.id === queueId) {
                    setSelectedQueue(null); // Go back to list if deleted queue was selected
                }
            })
            .catch(error => console.error("Error deleting queue", error));
    }
  };

  const renderDashboardContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" />
        </div>
      );
    }
    
    if (selectedQueue) {
        return (
            <QueueManagementPage 
                queue={selectedQueue}
                onUpdateQueue={handleUpdateQueue}
                onDeleteQueue={handleDeleteQueue}
                onBack={() => setSelectedQueue(null)}
                baseUrl={baseUrl}
                userId={user.uid}
            />
        );
    }

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your Queues</h2>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">Select a queue to manage or create a new one.</p>
                </div>
                <Button onClick={() => setCreateModalOpen(true)} className="w-full sm:w-auto">
                    Create New Queue
                </Button>
            </div>
            
            {queues.length > 0 ? (
                <div className="space-y-4">
                  {queues.map(queue => (
                    <QueueCard
                      key={queue.id}
                      queue={queue}
                      onSelect={setSelectedQueue}
                      onDelete={handleDeleteQueue}
                    />
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No queues found</h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">Click "Create New Queue" to get started.</p>
                </Card>
              )}
        </>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between h-16 px-6 bg-white dark:bg-gray-800 shadow-md">
        <div className="flex items-center space-x-3">
          <Logo />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">SmartQueue Admin</h1>
        </div>
        <div className="flex items-center space-x-4">
            <span className="text-sm font-medium hidden sm:block">Welcome, {user.email}!</span>
            <button
              onClick={onLogout}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-300 transition"
              aria-label="Logout"
            >
              <LogoutIcon className="h-5 w-5" />
            </button>
        </div>
      </header>

      <main className="flex-1 w-full p-6 mt-16">
        <div className="max-w-4xl mx-auto">
            {renderDashboardContent()}
        </div>
      </main>

      <CreateQueueModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateQueue}
      />
    </div>
  );
};

export default DashboardScreen;