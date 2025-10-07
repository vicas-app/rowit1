import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import DashboardScreen from './components/DashboardScreen';
import { auth } from './firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [authScreen, setAuthScreen] = useState<'login' | 'signup'>('login');
  
  // To provide a minimum splash screen time for better UX
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
        setShowSplash(false);
    }, 2000); // Show splash for at least 2 seconds

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthChecked(true);
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    signOut(auth).catch(error => console.error("Error signing out:", error));
  };

  const renderScreen = () => {
    if (showSplash || !isAuthChecked) {
      return <SplashScreen />;
    }
    
    if (user) {
      return <DashboardScreen user={user} onLogout={handleLogout} />;
    }
    
    if (authScreen === 'login') {
      return <LoginScreen onNavigateToSignup={() => setAuthScreen('signup')} />;
    } else {
      return <SignupScreen onNavigateToLogin={() => setAuthScreen('login')} />;
    }
  };

  return (
    <main className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 font-sans">
      {renderScreen()}
    </main>
  );
};

export default App;
