import React, { useState, useEffect } from 'react';
import { Queue, QueuePerson } from '../types';
import Button from './common/Button';
import ToggleSwitch from './common/ToggleSwitch';
import UsersIcon from './icons/UsersIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import Card from './common/Card';
import LinkIcon from './icons/LinkIcon';
import ShareLinkModal from './common/ShareLinkModal';

interface QueueManagementPageProps {
    queue: Queue;
    onUpdateQueue: (queue: Queue) => void;
    onDeleteQueue: (queueId: string) => void;
    onBack: () => void;
    baseUrl: string;
    userId: string;
}

const ITEMS_PER_PAGE = 10;

const QueueManagementPage: React.FC<QueueManagementPageProps> = ({ queue, onUpdateQueue, onBack, baseUrl, userId }) => {
    const [newPersonName, setNewPersonName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isShareModalOpen, setShareModalOpen] = useState(false);

    const liveQueue = (queue.people || []).sort((a,b) => a.sortKey - b.sortKey);
    const currentPerson = liveQueue.length > 0 ? liveQueue[0] : null;

    useEffect(() => {
        const totalPeople = queue.people?.length || 0;
        const totalPages = Math.ceil(totalPeople / ITEMS_PER_PAGE);
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        } else if (totalPeople === 0) {
            setCurrentPage(1);
        }
    }, [queue.people, currentPage]);

    const handleToggleActive = () => {
        onUpdateQueue({ ...queue, isActive: !queue.isActive });
    };

    const handleNext = () => {
        if (liveQueue.length > 0 && currentPerson) {
            const updatedPeople = (queue.people || []).filter(p => p.id !== currentPerson.id);
            
            if (updatedPeople.length === 0) {
                onUpdateQueue({ ...queue, people: [], lastAssignedRow: 0 });
            } else {
                onUpdateQueue({ ...queue, people: updatedPeople });
            }
        }
    };

    const handleUnavailable = () => {
        if (!currentPerson) return;

        if ((currentPerson.unavailableCount || 0) >= 1) {
            if (window.confirm(`${currentPerson.firstName} ${currentPerson.lastName} has been marked unavailable before. Do you want to remove them from the queue?`)) {
                const updatedPeople = (queue.people || []).filter(p => p.id !== currentPerson.id);
                onUpdateQueue({ ...queue, people: updatedPeople });
            }
            return;
        }

        const remainingQueue = liveQueue.filter(p => p.id !== currentPerson.id);
        if (remainingQueue.length === 0) {
            const updatedPerson = { ...currentPerson, status: 'Unavailable' as const, unavailableCount: 1 };
            const updatedPeople = (queue.people || []).map(p => p.id === currentPerson.id ? updatedPerson : p);
            onUpdateQueue({ ...queue, people: updatedPeople });
            return;
        }

        const newIndex = Math.min(4, remainingQueue.length - 1);
        const personBefore = remainingQueue[newIndex];
        const personAfter = remainingQueue[newIndex + 1];

        let newSortKey;
        if(personAfter) {
            newSortKey = (personBefore.sortKey + personAfter.sortKey) / 2;
        } else {
            newSortKey = personBefore.sortKey + 1;
        }

        const baseRowInt = parseInt(personBefore.displayRow.split('.')[0], 10);
        const siblings = liveQueue.filter(p =>
            p.id !== currentPerson.id &&
            p.displayRow.startsWith(`${baseRowInt}.`)
        );
        const newDecimalPart = String(siblings.length + 1).padStart(2, '0');
        const newDisplayRow = `${baseRowInt}.${newDecimalPart}`;
        
        const updatedPerson = {
            ...currentPerson,
            status: 'Unavailable' as const,
            unavailableCount: 1,
            sortKey: newSortKey,
            displayRow: newDisplayRow,
        };

        const updatedPeople = (queue.people || []).map(p => p.id === currentPerson.id ? updatedPerson : p);
        onUpdateQueue({ ...queue, people: updatedPeople });
    };

    const handleAddPerson = () => {
        if (!newPersonName.trim()) return;
        const nameParts = newPersonName.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ');

        const newRowNumber = (queue.lastAssignedRow || 0) + 1;

        const newPerson: QueuePerson = {
            id: String(Date.now()),
            firstName,
            lastName,
            status: 'In Queue',
            unavailableCount: 0,
            sortKey: newRowNumber,
            displayRow: String(newRowNumber),
        };

        const newPeopleList = [...(queue.people || []), newPerson];
        onUpdateQueue({ ...queue, people: newPeopleList, lastAssignedRow: newRowNumber });
        setNewPersonName('');
    };
    
    const handleClearAll = () => {
        if (liveQueue.length > 0 && window.confirm("Are you sure you want to clear the entire queue? This will remove all people.")) {
            onUpdateQueue({ ...queue, people: [], lastAssignedRow: 0 });
        }
    };

    const totalPages = Math.ceil(liveQueue.length / ITEMS_PER_PAGE);
    const paginatedQueue = liveQueue.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const generatedUrl = baseUrl ? `${baseUrl}?uid=${userId}&qid=${queue.id}` : '';

    return (
        <div className="flex flex-col space-y-6 relative">
             {!queue.isActive && (
                <div className="absolute inset-0 bg-gray-200/50 dark:bg-gray-800/50 rounded-xl flex items-center justify-center cursor-not-allowed z-10 -m-6">
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-gray-900/50 px-4 py-2 rounded-lg backdrop-blur-sm">Queue is Inactive</p>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-300 transition" aria-label="Back to queues">
                        <ArrowLeftIcon className="h-5 w-5" />
                    </button>
                    <h3 className="text-2xl font-bold">{queue.name}</h3>
                </div>
                <div className="flex items-center space-x-3">
                    {baseUrl && (
                        <button
                            onClick={() => setShareModalOpen(true)}
                            className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-300 transition"
                            aria-label="Share queue link"
                        >
                            <LinkIcon className="h-5 w-5" />
                        </button>
                    )}
                     <span className={`text-sm font-medium ${queue.isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                          {queue.isActive ? 'Active' : 'Inactive'}
                      </span>
                    <ToggleSwitch isEnabled={queue.isActive} onToggle={handleToggleActive} ariaLabel={`Toggle ${queue.name} queue`} />
                </div>
            </div>
            
            {/* Currently Serving */}
            <Card>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Currently Serving</h4>
                {currentPerson ? (
                    <div className="text-center p-4">
                        <p className="text-3xl font-bold my-1 text-gray-800 dark:text-white">{`${currentPerson.firstName} ${currentPerson.lastName}`}</p>
                        <p className="text-xl text-indigo-500 dark:text-indigo-400 font-semibold">Row Number: #{currentPerson.displayRow}</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                            <Button onClick={handleNext} className="w-full sm:w-auto px-8" disabled={!queue.isActive}>Next</Button>
                            <Button onClick={handleUnavailable} variant="secondary" className="w-full sm:w-auto px-8" disabled={!queue.isActive}>Unavailable</Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="font-semibold text-gray-500 dark:text-gray-400">The queue is empty.</p>
                    </div>
                )}
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* Add Person */}
                <Card className="md:col-span-3">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Add to Queue</h4>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Enter full name" 
                        value={newPersonName}
                        onChange={(e) => setNewPersonName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddPerson()}
                        disabled={!queue.isActive}
                        className="flex-grow bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-50" 
                       />
                      <Button onClick={handleAddPerson} disabled={!queue.isActive || !newPersonName.trim()} className="w-auto px-6">Add</Button>
                    </div>
                </Card>

                {/* Stats */}
                <Card className="md:col-span-2">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Queue Stats</h4>
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full text-blue-500 dark:text-blue-400">
                            <UsersIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total in Queue</p>
                            <p className="text-2xl font-bold">{liveQueue.length}</p>
                        </div>
                    </div>
                </Card>
            </div>
            
            {/* Table */}
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Queue Roster</h4>
                    {liveQueue.length > 0 && (
                        <Button
                            onClick={handleClearAll}
                            variant="secondary"
                            className="!w-auto !py-1.5 !px-3 text-xs !bg-red-100 !text-red-700 hover:!bg-red-200 dark:!bg-red-900/50 dark:!text-red-300 dark:hover:!bg-red-900"
                        >
                            Clear All
                        </Button>
                    )}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th scope="col" className="px-6 py-3">Row #</th>
                          <th scope="col" className="px-6 py-3">Full Name</th>
                          <th scope="col" className="px-6 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                         {liveQueue.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-6 text-center text-gray-500">
                                    No one is currently in the queue.
                                </td>
                            </tr>
                        ) : paginatedQueue.map((person) => {
                          const statusClasses = person.status === 'Unavailable'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
                          
                          return (
                            <tr key={person.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                              <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">#{person.displayRow}</td>
                              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{`${person.firstName} ${person.lastName}`}</th>
                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusClasses}`}>
                                  {person.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-gray-700 dark:text-gray-400 mb-2 sm:mb-0">
                            Showing{' '}
                            <span className="font-semibold">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span>
                            {' '}to{' '}
                            <span className="font-semibold">{Math.min(currentPage * ITEMS_PER_PAGE, liveQueue.length)}</span>
                            {' '}of{' '}
                            <span className="font-semibold">{liveQueue.length}</span>
                            {' '}Entries
                        </span>
                        <div className="inline-flex items-center rounded-md shadow-sm -space-x-px">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Previous
                            </button>
                            <span className="relative inline-flex items-center px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </Card>

            <ShareLinkModal
                isOpen={isShareModalOpen}
                onClose={() => setShareModalOpen(false)}
                url={generatedUrl}
            />

        </div>
    )
}

export default QueueManagementPage;