import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary';
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false }) => {
  const baseClasses = 'w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center transition duration-300 ease-in-out focus:ring-4 focus:outline-none';
  
  const variantClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800',
    secondary: 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800'
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? disabledClasses : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
