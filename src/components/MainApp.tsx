import { useState, useEffect } from 'react';
import { User, Link } from '../types';
import LinkForm from './LinkForm';
import LinkList from './LinkList';
import Analytics from './Analytics';
import Settings from './Settings';
import { links, testBackendConnection } from '../services/api';
import Navbar from './Navbar';
import Appearance from './Appearance';
import Theme from './Theme';
import { AppearanceProvider } from '../context/AppearanceContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth } from '../services/api';
import Profile from './Profile';
import Pro from './Pro';

interface MainAppProps {
  user: User;
  setUser: (user: User | null) => void;
}

const MainApp: React.FC<MainAppProps> = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState('links');
  const [linksList, setLinksList] = useState<Link[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Debug log for user object
  console.log("Current user object in MainApp:", user);
  console.log("Links List being passed to LinkList:", linksList);

  const [updateTrigger, setUpdateTrigger] = useState(false);


  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
  },[navigate, user]);

  
  useEffect(() => {
    console.log("Updated linksList:", linksList);
  
    const fetchData = async (retryCount = 0) => {
      try {
        console.log("Attempting to fetch links, attempt:", retryCount + 1);
        const response = await links.getAll();
        setLinksList(response.data);
        console.log("Successfully fetched links:", response.data);
      } catch (err) {
        console.error('Failed to fetch links:', err);
        
        // Handle network errors with retry logic
        if (axios.isAxiosError(err) && err.code === 'ERR_NETWORK' && retryCount < 3) {
          console.log(`Network error, retrying in ${(retryCount + 1) * 2} seconds...`);
          setTimeout(() => fetchData(retryCount + 1), (retryCount + 1) * 2000);
          return;
        }
        
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          navigate('/login');
        }
        
        // For network errors, set empty links list but don't show loading
        if (axios.isAxiosError(err) && err.code === 'ERR_NETWORK') {
          setLinksList([]);
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);  // ❌ Old: [linksList] (Incorrect) ✅ New: [] (Correct)
  // ✅ Runs whenever `linksList` updates to reflect changes
  

  const addLink = async (linkData: {
    title: string;
    url: string;
    backgroundColor?: string;
    textColor?: string;
  }) => {
    try {
      // Check authentication
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        navigate('/login');
        return;
      }
  
      // Add the userId to the linkData object
      const completeData = {
        ...linkData,
        userId: user.id,  // Using 'id' instead of '_id'
        originalUrl: linkData.url // Add originalUrl explicitly
      };
  
      console.log('Attempting to create link with data:', completeData);
      const response = await links.create(completeData);
      console.log('Link created successfully:', response.data);
      
      // Update the links list with the new link
      setLinksList(prevLinks => [response.data, ...prevLinks]);
      
      return response.data;
    } catch (err) {
      console.error('Failed to create link:', err);
      
      // Handle authentication errors
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        console.warn('Authentication error during link creation');
        navigate('/login');
      }
      
      // Log detailed error information
      if (axios.isAxiosError(err) && err.response?.data) {
        console.error('Server error response:', err.response.data);
      }
      
      throw err;
    }
  };

  const incrementClicks = async (id: string) => {
    try {
      console.log("Incrementing click for link ID:", id);
  
      // Optimistic UI update
      setLinksList(prevLinks =>
        prevLinks.map(link =>
          link._id === id ? { ...link, clicks: (link.clicks || 0) + 1 } : link
        )
      );
  
      // Prepare analytics data
      const analyticsData = {
        referrer: document.referrer || 'direct',
        device: navigator.userAgent,
        browser: navigator.userAgent,
        location: 'Unknown' // You might want to use a geolocation service here
      };
  
      await links.incrementClicks(id, analyticsData);  // Pass analytics data
      const response = await links.getAll();  // Fetch updated data after API call
  
      setLinksList(response.data);  // Update state with latest backend data
    } catch (err) {
      console.error("Failed to update clicks:", err);
    }
  };
  
  const deleteLink = async (id: string) => {
    if (!id) {
      console.error("Invalid link ID:", id);
      return;
    }
  
    try {
      console.log("Deleting link with ID:", id); // Debugging
      await links.delete(id);
      setLinksList(prevLinks => prevLinks.filter(link => link._id !== id));
    } catch (err) {
      console.error("Failed to delete link:", err);
    }
  };
  
  const deleteAllLinks = async () => {
    if (!linksList.length) return; // Prevent unnecessary API call

    const confirmDelete = window.confirm("Are you sure you want to delete all links?");
    if (!confirmDelete) return;

    try {
      await Promise.all(linksList.map(link => links.delete(link._id)));
      setLinksList([]);
    } catch (err) {
      console.error("Failed to delete all links:", err);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleLogout = () => {
    auth.logout();
    setUser(null);
    navigate('/', { replace: true });
  };

  // Handle tab changes for both mobile and desktop
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    // Test backend connectivity
    const testConnection = async () => {
      try {
        await testBackendConnection();
        console.log('Backend connection test passed');
      } catch (error) {
        console.error('Backend connection test failed:', error);
      }
    };
    
    testConnection();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 p-4 md:p-8 h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <AppearanceProvider>
      <div className="flex flex-col md:flex-row h-screen">
        {/* Sidebar/Navbar for both desktop and mobile */}
        <div className="w-full md:w-64 md:fixed md:h-screen">
          <Navbar 
            activeTab={activeTab} 
            setActiveTab={handleTabChange} 
            links={linksList}
            onLogout={handleLogout}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 md:p-8 bg-[linear-gradient(to_left,#ffffff,#abbaab)] overflow-y-auto md:ml-64">
          <div className="space-y-4 md:space-y-6">
            {activeTab === 'links' && (
              <div className="space-y-4 md:space-y-6">
                <h1 className="text-xl md:text-2xl font-bold">My Links</h1>
                <LinkForm 
                  addLink={addLink} 
                  deleteLink={deleteLink}
                  user={user}
                />
                <LinkList 
                  links={linksList} 
                  incrementClicks={incrementClicks} 
                  deleteLink={deleteLink}
                  deleteAllLinks={deleteAllLinks}
                  updateLinks={setLinksList}
                />
              </div>
            )}
            
            {activeTab === 'appearance' && (
              <div className="space-y-4 md:space-y-6">
                <h1 className="text-xl md:text-2xl font-bold">Appearance</h1>
                <Appearance user={user} updateUser={updateUser} />
              </div>
            )}
            
            {activeTab === 'theme' && (
              <div className="space-y-4 md:space-y-6">
                <h1 className="text-xl md:text-2xl font-bold">Theme</h1>
                <Theme />
              </div>
            )}
            
            {activeTab === 'analytics' && (
              <div className="space-y-4 md:space-y-6">
                <h1 className="text-xl md:text-2xl font-bold">Analytics</h1>
                <Analytics links={linksList} />
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="space-y-4 md:space-y-6">
                <h1 className="text-xl md:text-2xl font-bold">Settings</h1>
                <Settings user={user} updateUser={updateUser} />
              </div>
            )}
            
            {activeTab === 'profile' && (
              <div className="space-y-4 md:space-y-6">
                <h1 className="text-xl md:text-2xl font-bold">Profile</h1>
                <Profile 
                  user={user} 
                  updateUser={updateUser}
                  links={linksList}
                />
              </div>
            )}
            
            {activeTab === 'pro' && (
              <div className="space-y-4 md:space-y-6">
                <Pro />
              </div>
            )}
          </div>
        </div>
      </div>
    </AppearanceProvider>
  );
};

export default MainApp;