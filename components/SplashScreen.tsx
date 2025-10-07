import React from 'react';
import Logo from './common/Logo';

const SplashScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-24 w-24 bg-indigo-200 dark:bg-indigo-500/30 rounded-full animate-ping"></div>
        <Logo className="h-16 w-16 text-indigo-600 dark:text-indigo-400" />
      </div>
      <h1 className="mt-8 text-2xl font-bold text-gray-800 dark:text-gray-200 tracking-wider">
        SmartQueue
      </h1>
      <p className="text-gray-500 dark:text-gray-400">Your virtual waiting room.</p>
    </div>
  );
};

export default SplashScreen;
