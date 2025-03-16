import { useState, useEffect } from "react";
import { links, testBackendConnection } from "../services/api";
import ColorPickerWithProgress from "./ColorPickerWithProgress";
import { Link, User } from "../types"; // Import Link and User types
import { useProfile } from '../context/ProfileContext';

interface LinkFormProps {
  addLink: (linkData: {
    title: string;
    url: string;
    backgroundColor?: string;
    textColor?: string;
  }) => Promise<any>;
  deleteLink: (id: string) => void;
  user: User; // Add user prop
}

interface LinkData {
  title: string;
  url: string;
  backgroundColor?: string;
  textColor?: string;
  userId: string;
}

interface SocialMediaPlatform {
  name: string;
  url: string;
  bgColor: string;
  icon: JSX.Element;
}

interface ShopPlatform {
  name: string;
  icon: JSX.Element;
  baseUrl: string;
}

const LinkForm: React.FC<LinkFormProps> = ({ addLink, deleteLink, user }) => {
  const {
    username,
    bio,
    profilePic,
    bannerImage,
    addedLinks,
    setAddedLinks,
    shareProfile
  } = useProfile();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#000000");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [networkStatus, setNetworkStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [activeTab, setActiveTab] = useState<'link' | 'shop'>('link');
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedShopPlatform, setSelectedShopPlatform] = useState<string | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [productImage, setProductImage] = useState<string | null>(null);

  // Define social media platforms
  const socialMediaPlatforms: SocialMediaPlatform[] = [
    {
      name: "Instagram",
      url: "https://instagram.com/",
      bgColor: "bg-gradient-to-tr from-purple-500 to-pink-500",
      icon: (
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      )
    },
    {
      name: "Facebook",
      url: "https://facebook.com/",
      bgColor: "bg-blue-600",
      icon: (
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    },
    {
      name: "YouTube",
      url: "https://youtube.com/c/",
      bgColor: "bg-red-600",
      icon: (
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      )
    },
    {
      name: "X",
      url: "https://x.com/",
      bgColor: "bg-black",
      icon: (
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    }
  ];

  // Define shop platforms
  const shopPlatforms: ShopPlatform[] = [
    {
      name: "Amazon",
      baseUrl: "https://www.amazon.com/",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.93 17.09c-2.71 2.05-6.66 3.15-10.05 3.15-4.75 0-9.03-1.76-12.26-4.69-.25-.23-.03-.54.27-.36 3.42 1.98 7.64 3.17 12 3.17 2.94 0 6.17-.61 9.13-1.87.45-.19.82.29.37.63"/>
          <path d="M16.58 16.15c-.35-.45-2.31-.21-3.19-.11-.27.03-.31-.2-.07-.37 1.56-1.09 4.12-.78 4.42-.41.3.37-.08 2.93-1.54 4.16-.22.19-.44.09-.34-.16.33-.82 1.07-2.66.72-3.11"/>
          <path d="M14.25 4.25c0-.69.06-1.26-.23-1.87-.41-.87-1.2-1.18-2.09-1.18-1.16 0-2.19.71-2.19 2.19 0 1.14.67 1.87 1.53 2.19.78.29 1.89.35 2.73.35v.47c0 .35.03.76-.18 1.06-.18.26-.47.35-.82.35-.56 0-1.06-.29-1.18-.88-.03-.15-.12-.25-.25-.29l-1.41.15c-.12.03-.25.15-.22.35.33 1.76 1.93 2.29 3.36 2.29.73 0 1.7-.19 2.28-.74.76-.7.69-1.64.69-2.66v-2.4c0-.72.29-1.04 0-1.41-.29-.35-.76-.35-1.12-.35h-.47v-.47h1.41c.47 0 .88.06 1.26.29.47.29.47.76.47 1.26v1.14h-1.41v-.47zm-2.19 1.76c-.29 0-.56-.06-.82-.15-.78-.35-1.06-1.06-1.06-1.87 0-1.26.76-1.87 1.7-1.87.73 0 1.41.29 1.7 1.06.18.47.18.88.18 1.41v.47c-.29 0-.56 0-.85 0-.29 0-.56 0-.85-.06z"/>
        </svg>
      )
    },
    {
      name: "Flipkart",
      baseUrl: "https://www.flipkart.com/",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.3,3h15.3c0.7,0,1.3,0.6,1.3,1.3v15.3c0,0.7-0.6,1.3-1.3,1.3H4.3C3.6,21,3,20.4,3,19.7V4.3C3,3.6,3.6,3,4.3,3z"/>
          <path fill="#fff" d="M13.6,11.3h-1.2V9.1h1.2c0.6,0,1.1,0.5,1.1,1.1S14.2,11.3,13.6,11.3z M13.6,7.9h-2.4v7.2h1.2v-2.6h1.2 c1.3,0,2.3-1,2.3-2.3S14.9,7.9,13.6,7.9z"/>
          <path fill="#fff" d="M8.5,15.1l0.4-1.2h2.2l0.4,1.2h1.3l-2.1-7.2H9.3l-2.1,7.2H8.5z M10.8,12.7H9.2l0.8-2.8L10.8,12.7z"/>
        </svg>
      )
    }
  ];

  // Check network connectivity
  useEffect(() => {
    const checkConnection = async () => {
      try {
        await testBackendConnection();
        setNetworkStatus('online');
      } catch (error) {
        console.error('Network connectivity check failed:', error);
        setNetworkStatus('offline');
      }
    };
    
    checkConnection();
    
    // Set up periodic checks
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const validateURL = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Function to extract product image from URL
  const extractProductImage = async (url: string) => {
    try {
      // This is a placeholder. In a real implementation, you would:
      // 1. Either use the platform's API to get product details
      // 2. Or use a scraping service to get the product image
      // For now, we'll use a default image based on the platform
      if (url.includes('amazon')) {
        setProductImage('https://placehold.co/600x400/e3e3e3/999999?text=Amazon+Product');
      } else if (url.includes('flipkart')) {
        setProductImage('https://placehold.co/600x400/e3e3e3/999999?text=Flipkart+Product');
      } else {
        setProductImage(null);
      }
    } catch (error) {
      console.error('Error extracting product image:', error);
      setProductImage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate required fields
      if (!title || !url) {
        setError("Title and URL are required");
        setLoading(false);
        return;
      }

      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        setError("You must be logged in to create links");
        setLoading(false);
        return;
      }

      // Debug log for user object
      console.log('User object in LinkForm:', user);
      
      // Check for user object and ID
      if (!user || !user.id) {
        console.error("User object or user ID is missing:", user);
        setError("User information not found. Please refresh the page or log in again.");
        setLoading(false);
        return;
      }

      // Format URL if needed
      let formattedUrl = url;
      if (!formattedUrl.match(/^https?:\/\//i)) {
        formattedUrl = `https://${formattedUrl}`;
      }

      // Validate URL format
      try {
        new URL(formattedUrl);
      } catch (err) {
        setError("Invalid URL format");
        setLoading(false);
        return;
      }

      // Create link data object with user.id
      const linkData = {
        title: title.trim(),
        url: formattedUrl,
        originalUrl: formattedUrl,
        backgroundColor,
        textColor,
        productImage: activeTab === 'shop' ? productImage : null,
        isShop: activeTab === 'shop',
        shopPlatform: activeTab === 'shop' ? selectedShopPlatform : null,
        isEnabled: activeTab === 'shop' ? isEnabled : true
      };

      console.log("Creating link with data:", linkData);
      
      // Call the updated createLink function
      const newLink = await addLink(linkData);
      console.log("Link created successfully:", newLink);
      
      // Add to local state
      setAddedLinks([newLink, ...addedLinks]);
      
      // Reset form
      setTitle("");
      setUrl("");
      setBackgroundColor("#ffffff");
      setTextColor("#000000");
      setSelectedPlatform(null);
      setSelectedShopPlatform(null);
      setProductImage(null);
      setSuccess("Link created successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err: any) {
      console.error('Failed to create link:', err);
      
      // Add more detailed error logging
      if (err.response?.data) {
        console.error('Server error response:', err.response.data);
      }
      
      // Show error message to user
      setError('Failed to create link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLink(id);
      const updatedLinks = addedLinks.filter(link => link._id !== id);
      setAddedLinks(updatedLinks);
    } catch (err) {
      setError("Error deleting link. Please try again.");
    }
  };

  // Handle social media platform selection
  const handlePlatformSelect = (platform: SocialMediaPlatform) => {
    setSelectedPlatform(platform.name);
    setTitle(`My ${platform.name} Profile`);
    setUrl(platform.url);
    
    // Set appropriate colors based on the platform
    if (platform.name === "Instagram") {
      setBackgroundColor("#E1306C");
      setTextColor("#FFFFFF");
    } else if (platform.name === "Facebook") {
      setBackgroundColor("#1877F2");
      setTextColor("#FFFFFF");
    } else if (platform.name === "YouTube") {
      setBackgroundColor("#FF0000");
      setTextColor("#FFFFFF");
    } else if (platform.name === "X") {
      setBackgroundColor("#000000");
      setTextColor("#FFFFFF");
    }
  };

  // Handle shop platform selection
  const handleShopPlatformSelect = (platform: ShopPlatform) => {
    setSelectedShopPlatform(platform.name);
    setTitle(`${platform.name} Shop`);
    setUrl(platform.baseUrl);
    
    // Set default product image based on platform
    if (platform.name === 'Amazon') {
      setProductImage('https://placehold.co/600x400/e3e3e3/999999?text=Amazon+Product');
    } else if (platform.name === 'Flipkart') {
      setProductImage('https://placehold.co/600x400/e3e3e3/999999?text=Flipkart+Product');
    }
  };

  // Handle form submission when pressing Enter in the URL field
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  // Update URL input handler to extract product image when URL changes
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    if (activeTab === 'shop' && newUrl) {
      extractProductImage(newUrl);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 px-4 lg:px-8">
      {/* Left Side - Mobile Preview */}
      <div className="w-full lg:w-[350px] lg:fixed lg:flex-shrink-0 mb-8 lg:mb-0">
        <div className="lg:sticky top-8 flex justify-center lg:justify-start">
          <div className="bg-white rounded-[30px] h-[450px] shadow-[10px_10px_10px_rgba(0,0,0,0.5)] p-4 border-2 border-indigo-500 aspect-[9/18] relative overflow-hidden">
            {/* Share Button - Scaled down */}
            <button
              onClick={shareProfile}
              className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-md hover:bg-white/90 transition-colors scale-90"
            >
              <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Banner Image - Reduced height */}
            <div className="relative w-full h-16 bg-gray-200 rounded-lg overflow-hidden">
              {bannerImage ? (
                <img 
                  src={bannerImage} 
                  alt="Banner" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200" />
              )}
            </div>

            {/* Profile Section - Scaled down */}
            <div className="relative -mt-8 flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-full overflow-hidden border-4 border-white shadow-lg">
                {profilePic ? (
                  <img 
                    src={profilePic} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-xl text-gray-400">@</span>
                  </div>
                )}
              </div>
              <h2 className="mt-1 text-base font-semibold">{username}</h2>
              {bio && <p className="text-xs text-gray-500 text-center mt-0.5">{bio}</p>}
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
                onClick={handleSubmit}
              >
                Get Connected
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 lg:ml-[350px] max-w-3xl mx-auto">
        {networkStatus === 'offline' && (
          <div className="bg-red-100 p-4 rounded-lg shadow-md mb-4">
            <p className="text-red-700 text-sm flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Network connection issue detected. Some features may not work properly.
            </p>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`flex items-center justify-center py-3 px-4 ${
                activeTab === 'link' 
                  ? 'text-green-600 border-b-2 border-green-600' 
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('link')}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Add Link
            </button>
            <button
              className={`flex items-center justify-center py-3 px-4 ${
                activeTab === 'shop' 
                  ? 'text-green-600 border-b-2 border-green-600' 
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('shop')}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Add Shop
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'link' ? (
              <div>
                <h2 className="text-lg font-medium mb-4">Enter URL</h2>
                <form onSubmit={handleSubmit}>
                  {/* Title Input */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm text-gray-500">Link title</label>
                      <div className="flex items-center">
                        <button type="button" className="text-gray-400 hover:text-gray-600">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter link title"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      disabled={loading}
                    />
                  </div>

                  {/* URL Input */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm text-gray-500">Link URL</label>
                      <div className="flex items-center">
                        <button type="button" className="text-gray-400 hover:text-gray-600">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={url}
                        onChange={handleUrlChange}
                        onKeyDown={handleKeyDown}
                        placeholder="example.com"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 pr-16"
                        disabled={loading}
                      />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex">
                        <button 
                          type="button" 
                          className="text-gray-400 hover:text-gray-600 mr-1"
                          onClick={() => {
                            navigator.clipboard.writeText(url);
                            setSuccess("URL copied to clipboard!");
                            setTimeout(() => setSuccess(""), 2000);
                          }}
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        <button 
                          type="button" 
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() => {
                            if (url) {
                              window.open(url.startsWith('http') ? url : `https://${url}`, '_blank');
                            }
                          }}
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 my-4"></div>

                  {/* Applications */}
                  <div className="mb-4">
                    <h3 className="text-sm text-gray-500 mb-3">Applications</h3>
                    <div className="flex space-x-2">
                      {socialMediaPlatforms.map((platform) => (
                        <div 
                          key={platform.name} 
                          className="flex flex-col items-center"
                          onClick={() => handlePlatformSelect(platform)}
                        >
                          <div className={`w-12 h-12 ${platform.bgColor} rounded-lg flex items-center justify-center mb-1 cursor-pointer transition-transform hover:scale-110 ${selectedPlatform === platform.name ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}>
                            {platform.icon}
                          </div>
                          <span className="text-xs text-gray-500">{platform.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                  
                  {/* Success Message */}
                  {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

                  {/* Hidden color pickers - we keep them for functionality but hide them in the UI */}
                  <div className="hidden">
                    <ColorPickerWithProgress
                      label="Background Color"
                      color={backgroundColor}
                      setColor={setBackgroundColor}
                    />
                    <ColorPickerWithProgress
                      label="Text Color"
                      color={textColor}
                      setColor={setTextColor}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className={`w-full mt-4 ${loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} text-white px-6 py-2 rounded-md transition-colors`}
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Link'}
                  </button>
                </form>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-medium mb-4">Enter URL</h2>
                <form onSubmit={handleSubmit}>
                  {/* Shop Title Input */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm text-gray-500">Shop title</label>
                      <div className="flex items-center">
                        <button type="button" className="text-gray-400 hover:text-gray-600">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter shop title"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      disabled={loading}
                    />
                  </div>

                  {/* Shop URL Input */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm text-gray-500">Shop URL</label>
                      <div className="flex items-center">
                        <button type="button" className="text-gray-400 hover:text-gray-600">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={url}
                        onChange={handleUrlChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter product URL"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 pr-16"
                        disabled={loading}
                      />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex">
                        <button 
                          type="button" 
                          className="text-gray-400 hover:text-gray-600 mr-1"
                          onClick={() => {
                            navigator.clipboard.writeText(url);
                            setSuccess("URL copied to clipboard!");
                            setTimeout(() => setSuccess(""), 2000);
                          }}
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        <button 
                          type="button" 
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() => {
                            if (url) {
                              window.open(url.startsWith('http') ? url : `https://${url}`, '_blank');
                            }
                          }}
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Enable/Disable Toggle */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">Enable</span>
                    <button
                      type="button"
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isEnabled ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                      onClick={() => setIsEnabled(!isEnabled)}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Shop Platforms */}
                  <div className="mb-4">
                    <h3 className="text-sm text-gray-500 mb-3">Select Platform</h3>
                    <div className="flex space-x-4">
                      {shopPlatforms.map((platform) => (
                        <div 
                          key={platform.name}
                          className="flex flex-col items-center"
                          onClick={() => handleShopPlatformSelect(platform)}
                        >
                          <div className={`w-12 h-12 bg-white border-2 rounded-lg flex items-center justify-center mb-1 cursor-pointer transition-transform hover:scale-110 ${
                            selectedShopPlatform === platform.name 
                              ? 'border-green-600 text-green-600' 
                              : 'border-gray-300 text-gray-400'
                          }`}>
                            {platform.icon}
                          </div>
                          <span className="text-xs text-gray-500">{platform.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Error and Success Messages */}
                  {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                  {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className={`w-full mt-4 ${loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} text-white px-6 py-2 rounded-md transition-colors`}
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Add Shop'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default LinkForm;