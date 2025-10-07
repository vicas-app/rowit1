import React from 'react';

const UsersIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-2.438c.155-.19.293-.385.421-.582M12 15a2.25 2.25 0 01-2.25-2.25V8.625c0-1.242.992-2.25 2.209-2.25.122 0 .24.012.357.035a3.318 3.318 0 013.06 3.06c.023.116.035.235.035.357v4.125A2.25 2.25 0 0112 15z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a2.25 2.25 0 01-2.25-2.25V8.625c0-1.242.992-2.25 2.209-2.25.122 0 .24.012.357.035a3.318 3.318 0 013.06 3.06c.023.116.035.235.035.357v4.125A2.25 2.25 0 0112 15z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 19.128a9.38 9.38 0 01-2.625.372A9.337 9.337 0 013 16.868c-.155-.19-.293-.385-.421-.582M15 19.128c-1.38 0-2.733-.22-4.012-.624" />
  </svg>
);

export default UsersIcon;
