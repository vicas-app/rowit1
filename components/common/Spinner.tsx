import React from 'react';

const Spinner: React.FC<{ className?: string, size?: 'sm' | 'md' | 'lg' }> = ({ className = '', size = 'md' }) => {
    const sizeClasses = {
        sm: 'h-6 w-6 border-2',
        md: 'h-10 w-10 border-4',
        lg: 'h-16 w-16 border-4'
    };
    return (
        <div className={`animate-spin rounded-full border-indigo-500 border-t-transparent ${sizeClasses[size]} ${className}`}></div>
    );
};

export default Spinner;
