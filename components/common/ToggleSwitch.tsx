import React from 'react';

interface ToggleSwitchProps {
  isEnabled: boolean;
  onToggle: () => void;
  ariaLabel?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isEnabled, onToggle, ariaLabel = 'Toggle feature' }) => {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 ${
        isEnabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
      }`}
      role="switch"
      aria-checked={isEnabled}
      aria-label={ariaLabel}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
          isEnabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

export default ToggleSwitch;
