import React, { useState, useEffect } from "react";
import {
  MoreHorizontal,
  Trash2,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Globe,
  Share2,
  Image as ImageIcon,
  User as UserIcon,
} from "lucide-react";
import { User } from "../types";
import { useProfile } from '../context/ProfileContext';
import Logo from './Logo';

interface AppearanceProps {
  user: User;
  updateUser: (user: User) => void;
}

interface SocialMediaOption {
  name: string;
  icon: JSX.Element;
  placeholder: string;
  prefix: string;
}

const Appearance: React.FC<AppearanceProps> = ({ user, updateUser }) => {
  const {
    username,
    setUsername,
    bio,
    setBio,
    profilePic,
    setProfilePic,
    bannerImage,
    setBannerImage,
    backgroundColor,
    setBackgroundColor,
    addedLinks,
    shareProfile
  } = useProfile();
  const socialMediaOptions: SocialMediaOption[] = [
    {
      name: 'Twitter',
      icon: <Twitter />,
      placeholder: 'Your Twitter username',
      prefix: 'https://twitter.com/'
    },
    { name: "Facebook", icon: <Facebook />, placeholder: "Enter Facebook URL", prefix: "https://facebook.com/" },
    { name: "Instagram", icon: <Instagram />, placeholder: "Enter Instagram URL", prefix: "https://instagram.com/" },
    { name: "LinkedIn", icon: <Linkedin />, placeholder: "Enter LinkedIn URL", prefix: "https://linkedin.com/in/" },
    { name: "GitHub", icon: <Github />, placeholder: "Enter GitHub URL", prefix: "https://github.com/" },
    { name: "Website", icon: <Globe />, placeholder: "Enter Website URL", prefix: "" }
  ];
  
  const [socialLinks, setSocialLinks] = useState<{
    name: string;
    url: string;
    color: string;
    shape: string;
    textColor: string;
  }[]>(() => {
    try {
      const saved = localStorage.getItem('userSocialLinks');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading social links:', error);
      return [];
    }
  });

  // Save social links to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('userSocialLinks', JSON.stringify(socialLinks));
    } catch (error) {
      console.error('Error saving social links:', error);
    }
  }, [socialLinks]);

  const [activePlatform, setActivePlatform] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const [currentCustomization, setCurrentCustomization] = useState({
    color: "bg-blue-500",
    shape: "rounded-lg",
    textColor: "text-white"
  });

  // Handle Enter Key to Add Link
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, platform: string, prefix: string) => {
    if (event.key === "Enter") {
      if (!currentUrl.startsWith(prefix)) {
        alert(`Invalid URL! Please enter a valid ${platform} link.`);
        return;
      }

      // Save link with customization
      setSocialLinks([
        ...socialLinks,
        { name: platform, url: currentUrl, ...currentCustomization }
      ]);
      
      // Reset input & customization settings after adding the link
      setCurrentUrl("");
      setActivePlatform(null);
      setCurrentCustomization({ color: "bg-blue-500", shape: "rounded-lg", textColor: "text-white" });
    }
  };

  // Update Link Customization
  const updateLinkStyle = (index: number, key: string, value: string) => {
    const updatedLinks = [...socialLinks];
    (updatedLinks[index] as any)[key] = value;
    setSocialLinks(updatedLinks);
  };

  const [showEditModal, setShowEditModal] = useState(false);
  const [showNameBioModal, setShowNameBioModal] = useState(false);

  // Handle Image Upload with preview
  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "banner"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Check file size (e.g., max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (type === "profile") {
        setProfilePic(base64String);
        localStorage.setItem('profilePic', base64String);
      } else {
        setBannerImage(base64String);
        localStorage.setItem('bannerImage', base64String);
      }
    };

    reader.onerror = () => {
      alert('Error reading file');
    };

    reader.readAsDataURL(file);

    // Reset the input value to allow uploading the same file again
    event.target.value = '';
  };

  // Handle background color change
  const handleColorChange = (color: string) => {
    setBackgroundColor(color);
  };

  const handleUpdateUser = () => {
    if (user && updateUser) {
      updateUser({
        ...user,
        // update user properties
      });
    }
  };

  // Update the Name & Bio Modal save handler
  const handleSaveNameBio = () => {
    setUsername(username);
    setBio(bio);
    setShowNameBioModal(false);
  };

  // Add activeTab state
  const [activeTab, setActiveTab] = useState<'link' | 'shop'>('link');

  return (
    <div className="flex flex-col lg:flex-row gap-8 px-4 lg:px-8">
      {/* Left Side - Mobile Preview */}
      <div className="w-full lg:w-[350px] lg:fixed lg:flex-shrink-0 mb-8 lg:mb-0">
        <div className="lg:sticky top-8 flex justify-center lg:justify-start">
          <div className="bg-white rounded-[30px] h-[450px] shadow-[10px_10px_10px_rgba(0,0,0,0.5)] p-4 border-2 border-indigo-500 aspect-[9/18] relative overflow-hidden">
            {/* Share Button */}
            <button
              onClick={shareProfile}
              className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white/90 transition-colors"
            >
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>

            {/* Banner Image */}
            <div 
              className="relative w-full h-24 rounded-lg overflow-hidden"
              style={{ backgroundColor: backgroundColor }}
            >
              {bannerImage ? (
                <img src={bannerImage} alt="Banner" className="w-full h-full object-cover" />
              ) : null}
            </div>

            {/* Profile Section */}
            <div className="relative -mt-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-full overflow-hidden border-4 border-white shadow-lg">
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-2xl text-gray-400">@</span>
                  </div>
                  )}
                </div>
              <h2 className="mt-2 text-lg font-semibold">{username}</h2>
              {bio && <p className="text-sm text-gray-500 text-center mt-1">{bio}</p>}
            </div>

            {/* Links Section */}
            <div className="mt-3 space-y-2 overflow-y-auto max-h-[calc(100%-10rem)] px-2">
              {/* Tabs */}
              <div className="flex space-x-2 mb-3">
                <button
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium ${
                    activeTab === 'link'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                  onClick={() => setActiveTab('link')}
                >
                  Link
                </button>
                <button
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium ${
                    activeTab === 'shop'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                  onClick={() => setActiveTab('shop')}
                >
                  Shop
                </button>
              </div>

              {/* Added Links Preview */}
              {addedLinks
                .filter(link => activeTab === 'shop' ? link.isShop : !link.isShop)
                .map((link, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 rounded-lg p-2 flex items-center space-x-2"
                  >
                    {/* Icon based on link type */}
                    <div className={`w-8 h-8 ${
                      link.isShop ? 'bg-green-600' : 
                      link.title.toLowerCase().includes('youtube') ? 'bg-red-600' :
                      link.title.toLowerCase().includes('instagram') ? 'bg-gradient-to-tr from-purple-500 to-pink-500' :
                      'bg-blue-600'
                    } rounded-lg flex items-center justify-center`}>
                      {link.isShop ? (
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M13 12h7v1.5h-7m0-4h7V11h-7m0 3.5h7V16h-7m8-12H3a2 2 0 00-2 2v13a2 2 0 002 2h18a2 2 0 002-2V6a2 2 0 00-2-2m0 15h-9V6h9v13Z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900">{link.title}</p>
                    </div>
                    {link.isShop && (
                      <button 
                        onClick={() => window.open(link.url, '_blank')}
                        className="px-2 py-0.5 bg-green-600 text-white text-[10px] rounded-full hover:bg-green-700 transition-colors"
                      >
                        Buy
                      </button>
                    )}
                  </div>
                ))}

              {/* Empty state message */}
              {addedLinks.filter(link => activeTab === 'shop' ? link.isShop : !link.isShop).length === 0 && (
                <div className="text-center text-gray-500 text-xs py-3">
                  {activeTab === 'shop' 
                    ? 'No shop links added yet' 
                    : 'No links added yet'
                  }
                </div>
              )}

              {/* Get Connected Button */}
              <button 
                className="w-full py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors mt-2"
                onClick={() => {
                  // Add the same functionality as in LinkForm
                  window.open(`https://yourwebsite.com/${username}`, '_blank');
                }}
              >
                Get Connected
              </button>
            </div>

            {/* Logo at the bottom */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <Logo className="scale-75 opacity-50" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Editor */}
      <div className="flex-1 lg:ml-[350px] max-w-3xl mx-auto border-4 border-gray-200 p-4 rounded-xl">
        {/* Profile Section */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Profile</h2>
          
          {/* Profile Picture with new layout */}
          <div className="flex flex-col items-center">
            {/* Profile Picture Circle */}
            <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden mb-4">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-2xl text-gray-400">@</span>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <div className="w-full max-w-[240px]">
              <label htmlFor="profilePicInput" className="block">
                <input
                  type="file"
                  id="profilePicInput"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "profile")}
                  className="hidden"
                />
                <button 
                  onClick={() => document.getElementById('profilePicInput')?.click()}
                  className="w-full py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                >
                  Pick an image
                </button>
          </label>

              {/* Remove Button - Only show when there's a profile picture */}
              {profilePic && (
                <button
                  onClick={() => {
                    setProfilePic('');
                    localStorage.removeItem('profilePic');
                  }}
                  className="w-full mt-2 text-gray-500 text-sm hover:text-gray-700"
                >
                  Remove
                </button>
              )}
            </div>

            {/* Profile Title & Bio */}
            <div className="w-full mt-6">
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-1">Profile Title</label>
                  <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl"
                  placeholder="@popopo_08"
                />
                </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl resize-none"
                  placeholder="Bio"
                  rows={2}
                  maxLength={80}
                />
                <div className="text-right text-xs text-gray-500">
                  {bio.length}/80
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Banner Section */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Banner</h2>
          
          <div className="flex flex-col items-center">
            {/* Banner Preview */}
            <div 
              className="w-full h-32 rounded-lg overflow-hidden mb-4"
              style={{ backgroundColor: backgroundColor }}
            >
              {bannerImage ? (
                <img
                  src={bannerImage}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-2 overflow-hidden">
                      {profilePic ? (
                        <img
                          src={profilePic}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-2xl text-gray-400">@</span>
              </div>
            )}
                    </div>
                    <div className="text-white">@{username}</div>
                    <div className="text-gray-400 text-sm">@{username}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Banner Upload */}
            <div className="w-full max-w-[240px]">
              <label htmlFor="bannerInput" className="block">
                <input
                  type="file"
                  id="bannerInput"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "banner")}
                  className="hidden"
                />
                <button 
                  onClick={() => document.getElementById('bannerInput')?.click()}
                  className="w-full py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                >
                  Pick an image
                </button>
              </label>

              {/* Remove Button - Only show when there's a banner image */}
              {bannerImage && (
                <button
                  onClick={() => {
                    setBannerImage('');
                    localStorage.removeItem('bannerImage');
                  }}
                  className="w-full mt-2 text-gray-500 text-sm hover:text-gray-700"
                >
                  Remove
                </button>
              )}
            </div>

            {/* Custom Background Color */}
            <div className="w-full max-w-[240px] mt-4">
              <label className="block text-sm text-gray-600 mb-2">Custom Background Color</label>
              <div className="flex gap-2 items-center justify-between">
                <button 
                  onClick={() => handleColorChange('#2B2B2B')}
                  className={`w-8 h-8 rounded-full bg-[#2B2B2B] border-2 ${backgroundColor === '#2B2B2B' ? 'border-blue-500' : 'border-white'} shadow-md`}
                />
                <button 
                  onClick={() => handleColorChange('#FFFFFF')}
                  className={`w-8 h-8 rounded-full bg-white border-2 ${backgroundColor === '#FFFFFF' ? 'border-blue-500' : 'border-gray-200'} shadow-md`}
                />
                <button 
                  onClick={() => handleColorChange('#000000')}
                  className={`w-8 h-8 rounded-full bg-black border-2 ${backgroundColor === '#000000' ? 'border-blue-500' : 'border-white'} shadow-md`}
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  placeholder="#000000"
                  className="w-24 p-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Edit Images</h2>
            <label className="block mb-4">
              <span className="text-sm font-medium">Upload Profile Picture</span>
              <input
                type="file"
                accept="image/*"
                className="w-full p-2 border rounded-xl text-sm"
                onChange={(e) => handleImageUpload(e, "profile")}
              />
            </label>
            <label className="block mb-4">
              <span className="text-sm font-medium">Upload Banner Image</span>
              <input
                type="file"
                accept="image/*"
                className="w-full p-2 border rounded-xl text-sm"
                onChange={(e) => handleImageUpload(e, "banner")}
              />
            </label>
            <div className="flex justify-end space-x-2">
              <button className="px-3 py-1 sm:px-4 sm:py-2 text-sm bg-gray-300 rounded-2xl" onClick={() => setShowEditModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Name & Bio Edit Modal */}
      {showNameBioModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Edit Name & Bio</h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent p-2 border rounded-xl mb-4 text-sm"
              placeholder="Enter new username"
            />
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2 bg-transparent border rounded-xl mb-4 text-sm"
              placeholder="Enter bio"
            ></textarea>
            <div className="flex justify-end space-x-2">
              <button
                className="px-3 py-1 sm:px-4 sm:py-2 text-sm bg-gray-300 rounded-2xl"
                onClick={() => setShowNameBioModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 sm:px-4 sm:py-2 text-sm bg-blue-500 text-white rounded-2xl"
                onClick={handleSaveNameBio}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appearance;