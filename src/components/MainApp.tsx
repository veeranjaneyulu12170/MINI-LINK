import { useState, useEffect } from 'react';
import { User, Link } from '../types';
import LinkForm from './LinkForm';
import LinkList from './LinkList';
import Analytics from './Analytics';
import Settings from './Settings';
import { links } from '../services/api';
import Navbar from './Navbar';
import Appearance from './Appearance';
import Theme from './Theme';
import { AppearanceProvider } from '../context/AppearanceContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth } from '../services/api';

interface MainAppProps {
  user: User;
  setUser: (user: User | null) => void;
}

const MainApp: React.FC<MainAppProps> = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState('links');
  const [linksList, setLinksList] = useState<Link[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch links
    const fetchLinks = async () => {
      try {
        const response = await links.getAll();
        setLinksList(response.data);
      } catch (err) {
        console.error('Failed to fetch links:', err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchLinks();
  }, [navigate]);

  const addLink = async (linkData: {
    title: string;
    url: string;
    backgroundColor?: string;
    textColor?: string;
  }) => {
    try {
      const response = await links.create(linkData);
      setLinksList([response.data, ...linksList]);
    } catch (err) {
      console.error('Failed to create link:', err);
    }
  };

  const incrementClicks = async (id: string) => {
    try {
      // First update the UI optimistically
      setLinksList(prevLinks => 
        prevLinks.map(link => 
          link.id === id 
            ? { ...link, clicks: Number(link.clicks || 0) + 1 }
            : link
        )
      );

      // Then make the API call
      await links.incrementClicks(id);

      // Optionally refresh the links to ensure sync with server
      const response = await links.getAll();
      setLinksList(response.data);
    } catch (err) {
      console.error('Failed to update clicks:', err);
      // Revert the optimistic update on error
      const response = await links.getAll();
      setLinksList(response.data);
    }
  };

  const deleteLink = async (id: string) => {
    try {
      await links.delete(id);
      setLinksList(prevLinks => prevLinks.filter(link => link.id !== id));
    } catch (err) {
      console.error('Failed to delete link:', err);
    }
  };

  const deleteAllLinks = async () => {
    try {
      await Promise.all(linksList.map(link => links.delete(link.id)));
      setLinksList([]);
    } catch (err) {
      console.error('Failed to delete all links:', err);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleLogout = () => {
    auth.logout(); // This will remove the token
    setUser(null);
    navigate('/login');
  };

  return (
    <AppearanceProvider>
      <div className="flex h-screen">
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          links={linksList}
          onLogout={handleLogout}
        />
        <div className="flex-1 p-8 h-screen ml-64 ">
          <div className="space-y-6">
            {activeTab === 'links' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">My Links</h1>
                <LinkForm 
                  addLink={addLink} 
                  deleteLink={deleteLink}
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
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Appearance</h1>
                <Appearance user={user} updateUser={updateUser} />
              </div>
            )}
            
            {activeTab === 'theme' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Theme</h1>
                <Theme />
              </div>
            )}
            
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Analytics</h1>
                <Analytics links={linksList} />
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Settings</h1>
                <Settings user={user} updateUser={updateUser} />
              </div>
            )}
          </div>
        </div>
      </div>
    </AppearanceProvider>
  );
};

export default MainApp;