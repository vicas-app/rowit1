import React, { useState } from 'react';
import Button from './Button';
import Card from './Card';

interface ShareLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

const ShareLinkModal: React.FC<ShareLinkModalProps> = ({ isOpen, onClose, url }) => {
  const [copyStatus, setCopyStatus] = useState('Copy');

  const handleCopy = () => {
    if (!navigator.clipboard) {
        // Fallback for http or old browsers
        try {
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopyStatus('Copied!');
        } catch (err) {
            setCopyStatus('Failed!');
        }
    } else {
        navigator.clipboard.writeText(url).then(() => {
            setCopyStatus('Copied!');
        }, () => {
            setCopyStatus('Failed!');
        });
    }
    
    setTimeout(() => setCopyStatus('Copy'), 2000);
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
      <Card className="w-full max-w-lg">
        <div className="space-y-6">
          <h2 id="modal-title" className="text-xl font-bold text-gray-900 dark:text-white">
            Share Queue Link
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Share this link with users to let them view the public queue status.
          </p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={url}
              readOnly
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
            <Button onClick={handleCopy} className="w-auto px-6" variant={copyStatus === 'Copied!' ? 'primary' : 'secondary'}>
              {copyStatus}
            </Button>
          </div>
          <div className="flex justify-end">
            <Button type="button" variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ShareLinkModal;
