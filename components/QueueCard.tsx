import React from 'react';
import { Queue } from '../types';
import Card from './common/Card';
import TrashIcon from './icons/TrashIcon';

interface QueueCardProps {
    queue: Queue;
    onSelect: (queue: Queue) => void;
    onDelete: (queueId: string) => void;
}

const QueueCard: React.FC<QueueCardProps> = ({ queue, onSelect, onDelete }) => {
    
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click when deleting
        onDelete(queue.id);
    };

    return (
        <Card 
            className="cursor-pointer hover:shadow-lg hover:border-indigo-500 border-2 border-transparent transition-all duration-300 !p-4"
            onClick={() => onSelect(queue)}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${queue.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <div className='min-w-0'>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white truncate">{queue.name}</h3>
                        <p className="text-xs text-gray-400 dark:text-gray-500 font-mono truncate">ID: {queue.id}</p>
                    </div>
                </div>
                <button 
                    onClick={handleDelete} 
                    className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" 
                    aria-label={`Delete ${queue.name} queue`}
                >
                    <TrashIcon className="h-5 w-5"/>
                </button>
            </div>
        </Card>
    );
};

export default QueueCard;
