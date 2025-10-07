import React from 'react';

interface LogoProps {
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-8 w-auto text-indigo-600 dark:text-indigo-500" }) => {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                fillOpacity="0.3"
            />
            <path d="M11 7h2v6h-2zm0 8h2v2h-2z" />
            <path
                d="M16.24 7.76c-1.34-1.34-3.1-2.05-4.95-1.95-1.85.1-3.59.82-4.94 2.16-1.34 1.34-2.05 3.1-1.95 4.95.1 1.85.82 3.59 2.16 4.94 1.34 1.34 3.1 2.05 4.95 1.95 1.85-.1 3.59-.82 4.94-2.16s2.05-3.1 1.95-4.95c-.1-1.85-.82-3.59-2.16-4.94zm-1.41 8.49c-.78.78-1.83 1.2-2.92 1.2s-2.14-.42-2.92-1.2c-.78-.78-1.2-1.83-1.2-2.92s.42-2.14 1.2-2.92c.78-.78 1.83-1.2 2.92-1.2s2.14.42 2.92 1.2c.78.78 1.2 1.83 1.2 2.92s-.42 2.14-1.2 2.92z"
            />
        </svg>
    );
};

export default Logo;
