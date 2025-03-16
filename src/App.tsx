import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { User } from './types';
import { getUser, saveUser } from './utils/localStorage';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import MainApp from './components/MainApp';
import MainNavbar from './components/MainNavbar';
import { useLocation } from 'react-router-dom';
import GoogleCallback from './components/GoogleCallback';
import ProfileSetup from './components/ProfileSetup';
import { ProfileProvider } from './context/ProfileContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  
  useEffect(() => {
    if (user) {
      saveUser(user);
    }
  }, [user]);

  const handleLogout = () => {
    // Clear both token and user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Create a wrapper component to use useLocation
  const AppContent = () => {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';
    const isCallbackPage = location.pathname.startsWith('/auth/google');
    const isProfileSetupPage = location.pathname === '/profile-setup';

    return (
      <div className="min-h-screen bg-gray-50">
        {!isLoginPage && !isCallbackPage && !isProfileSetupPage && <MainNavbar user={user} onLogout={handleLogout} />}
        <div className={isLoginPage || isCallbackPage || isProfileSetupPage ? '' : 'pt-16'}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={
              user ? <Navigate to="/app" /> : <Login setUser={setUser} setActiveTab={() => {}} />
            } />
            <Route path="/profile-setup" element={
              user ? <ProfileSetup user={user} updateUser={setUser} /> : <Navigate to="/login" />
            } />
            <Route path="/app/*" element={
              user ? <MainApp user={user} setUser={setUser} /> : <Navigate to="/login" />
            } />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />
          </Routes>
        </div>
      </div>
    );
  };

  return (
    <AuthProvider>
      <ProfileProvider>
        <Router>
          <AppContent />
        </Router>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;