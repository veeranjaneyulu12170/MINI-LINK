import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { User } from './types';
import { getUser, saveUser } from './utils/localStorage';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import MainApp from './components/MainApp';
import MainNavbar from './components/MainNavbar';

function App() {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Check both user data and token
    const token = localStorage.getItem('token');
    const storedUser = getUser();
    
    // Only set user if both token and user data exist
    if (token && storedUser) {
      setUser(storedUser);
    } else {
      // Clear everything if either is missing
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
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

  return (
    <Router>
      <AppContent 
        user={user} 
        setUser={setUser} 
        handleLogout={handleLogout} 
      />
    </Router>
  );
}

// Separate component to use the useLocation hook
function AppContent({ user, setUser, handleLogout }: { 
  user: User | null, 
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  handleLogout: () => void
}) {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Only show navbar if not on login page */}
      {!isLoginPage && (
        <MainNavbar user={user} onLogout={handleLogout} />
      )}
      
      <div className={isLoginPage ? "" : "pt-16"}> {/* Add padding only when navbar is visible */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<LandingPage />} />
          <Route path="/pricing" element={<LandingPage />} />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/app" /> : <Login setUser={setUser} setActiveTab={() => {}} />} 
          />
          <Route 
            path="/app/*" 
            element={user ? <MainApp user={user} setUser={setUser} /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;