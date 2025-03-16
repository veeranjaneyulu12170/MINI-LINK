import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Link } from '../types';

interface ProfileContextType {
  username: string;
  bio: string;
  profilePic: string;
  bannerImage: string;
  links: any[];
  addedLinks: Link[];
  activeTab: 'link' | 'shop';
  backgroundColor: string;
  setUsername: (username: string) => void;
  setBio: (bio: string) => void;
  setProfilePic: (profilePic: string) => void;
  setBannerImage: (bannerImage: string) => void;
  setLinks: (links: any[]) => void;
  setAddedLinks: (links: Link[]) => void;
  setActiveTab: (tab: 'link' | 'shop') => void;
  setBackgroundColor: (backgroundColor: string) => void;
  shareProfile: () => void;
  handleGetConnected: () => void;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState(() => localStorage.getItem('username') || '');
  const [bio, setBio] = useState(() => localStorage.getItem('bio') || '');
  const [profilePic, setProfilePic] = useState(() => localStorage.getItem('profilePic') || '');
  const [bannerImage, setBannerImage] = useState(() => localStorage.getItem('bannerImage') || '');
  const [links, setLinks] = useState([]);
  const [addedLinks, setAddedLinks] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'link' | 'shop'>('link');
  const [backgroundColor, setBackgroundColor] = useState(() => 
    localStorage.getItem('bannerBackgroundColor') || '#2B2B2B'
  );

  useEffect(() => {
    localStorage.setItem('username', username);
  }, [username]);

  useEffect(() => {
    localStorage.setItem('bio', bio);
  }, [bio]);

  useEffect(() => {
    if (profilePic) {
      localStorage.setItem('profilePic', profilePic);
    }
  }, [profilePic]);

  useEffect(() => {
    if (bannerImage) {
      localStorage.setItem('bannerImage', bannerImage);
    }
  }, [bannerImage]);

  useEffect(() => {
    localStorage.setItem('addedLinks', JSON.stringify(addedLinks));
  }, [addedLinks]);

  useEffect(() => {
    localStorage.setItem('bannerBackgroundColor', backgroundColor);
  }, [backgroundColor]);

  const shareProfile = () => {
    window.open(`https://yourwebsite.com/${username}`, '_blank');
  };

  const handleGetConnected = () => {
    window.open(`https://yourwebsite.com/${username}`, '_blank');
  };

  return (
    <ProfileContext.Provider
      value={{
        username,
        bio,
        profilePic,
        bannerImage,
        links,
        addedLinks,
        activeTab,
        setActiveTab,
        setUsername,
        setBio,
        setProfilePic,
        setBannerImage,
        setLinks,
        setAddedLinks,
        backgroundColor,
        setBackgroundColor,
        shareProfile,
        handleGetConnected,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}; 