import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import InterviewPage from './components/InterviewPage';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    // A small delay to allow the app to load before starting animations
    const timer = setTimeout(() => setShowApp(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className={`min-h-screen bg-transparent transition-opacity duration-1000 ${showApp ? 'opacity-100' : 'opacity-0'}`}>
      {isLoggedIn ? (
        <InterviewPage />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;