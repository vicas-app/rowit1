import React, { useState, useEffect } from 'react';
import Button from './Button';
import Card from './Card';
import Input from './Input';

interface CreateQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (queueName: string) => void;
}

const CreateQueueModal: React.FC<CreateQueueModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [queueName, setQueueName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reset form when modal opens
    if (isOpen) {
      setQueueName('');
      setLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queueName.trim()) return;
    setLoading(true);
    // onCreate will handle closing the modal on success
    onCreate(queueName);
  };
  
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <Card 
        className="w-full max-w-md"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <h2 id="modal-title" className="text-xl font-bold text-gray-900 dark:text-white">
              Create a New Queue
            </h2>
            <Input
              id="queueName"
              label="Queue Name"
              type="text"
              value={queueName}
              onChange={(e) => setQueueName(e.target.value)}
              placeholder="e.g. Customer Service Desk"
              required
            />
            <div className="flex justify-end gap-4">
              <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !queueName.trim()}>
                {loading ? 'Creating...' : 'Create Queue'}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateQueueModal;