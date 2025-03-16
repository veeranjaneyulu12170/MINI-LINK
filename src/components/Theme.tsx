import React, { useState, useEffect } from "react";
import {
  MoreHorizontal,
  Share2,
  Palette,
  Layout,
  Type,
  Image as ImageIcon,
  User as UserIcon,
  LayoutList,
  Grid,
  ScrollText
} from "lucide-react";
import { useAppearance } from '../context/AppearanceContext';
import { useProfile } from '../context/ProfileContext';

// Define valid theme options
type ThemeOption = {
  name: string;
  background: string;
  textColor: string;
  preview: string;
  description?: string;
};

type ButtonOption = {
  name: 'rounded' | 'square' | 'pill' | 'shadow' | 'outline' | '3d';
  classes: string;
};

type ProfileOption = {
  name: 'circle' | 'square' | 'rounded';
  classes: string;
};

type BannerOption = {
  name: 'full' | 'rounded' | 'none';
  classes: string;
};

// Update the FontOption type to include more fonts
type FontOption = {
  name: 'modern' | 'classic' | 'playful' | 'elegant' | 'minimal' | 'bold' | 'quirky' | 'tech';
  class: string;
  preview: string;
};

// Add these new type definitions at the top with other types
type LayoutOption = {
  name: 'stack' | 'grid' | 'carousel';
  preview: JSX.Element;
};

// Add these new types and state
type ButtonStyle = 'fill' | 'outline' | 'hard-shadow' | 'soft-shadow';

// Update the mapped arrays with proper typing
const themeOptions: ThemeOption[] = [
  { 
    name: 'Light',
    background: 'bg-white',
    textColor: 'text-gray-900',
    preview: 'bg-white border border-gray-200',
    description: 'Clean & minimal'
  },
  { 
    name: 'Dark',
    background: 'bg-gray-900',
    textColor: 'text-white',
    preview: 'bg-gray-900',
    description: 'Bold & elegant'
  },
  { 
    name: 'Minimal',
    background: 'bg-gray-50',
    textColor: 'text-gray-800',
    preview: 'bg-gray-50 border border-gray-200',
    description: 'Simple & clean'
  },
  { 
    name: 'Ocean',
    background: 'bg-gradient-to-br from-blue-400 to-blue-600',
    textColor: 'text-white',
    preview: 'bg-gradient-to-br from-blue-400 to-blue-600',
    description: 'Deep & calming'
  },
  { 
    name: 'Sunset',
    background: 'bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500',
    textColor: 'text-white',
    preview: 'bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500',
    description: 'Warm & vibrant'
  },
  { 
    name: 'Forest',
    background: 'bg-gradient-to-br from-green-400 to-emerald-600',
    textColor: 'text-white',
    preview: 'bg-gradient-to-br from-green-400 to-emerald-600',
    description: 'Natural & fresh'
  },
  { 
    name: 'Royal',
    background: 'bg-gradient-to-r from-purple-500 to-indigo-600',
    textColor: 'text-white',
    preview: 'bg-gradient-to-r from-purple-500 to-indigo-600',
    description: 'Rich & luxurious'
  },
  { 
    name: 'Midnight',
    background: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
    textColor: 'text-white',
    preview: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
    description: 'Dark & mysterious'
  }
];

const buttonOptions: Array<{ name: ButtonOption['name']; preview: JSX.Element }> = [
  { name: 'rounded', preview: <div className="h-6 w-12 bg-indigo-500 rounded-lg"></div> },
  { name: 'square', preview: <div className="h-6 w-12 bg-indigo-500 rounded-none"></div> },
  { name: 'pill', preview: <div className="h-6 w-12 bg-indigo-500 rounded-full"></div> },
  { name: 'shadow', preview: <div className="h-6 w-12 bg-indigo-500 rounded-lg shadow-lg"></div> },
  { name: 'outline', preview: <div className="h-6 w-12 bg-transparent border-2 border-indigo-500"></div> },
  { name: '3d', preview: <div className="h-6 w-12 bg-indigo-500 rounded-lg transform shadow-md"></div> }
] as const;

// Add proper type definitions for the option arrays
const profileOptions: Array<{ name: ProfileOption['name']; preview: JSX.Element }> = [
  { name: 'circle', preview: <div className="h-10 w-10 bg-blue-200 rounded-full flex items-center justify-center"><UserIcon className="h-6 w-6" /></div> },
  { name: 'square', preview: <div className="h-10 w-10 bg-blue-200 rounded-none flex items-center justify-center"><UserIcon className="h-6 w-6" /></div> },
  { name: 'rounded', preview: <div className="h-10 w-10 bg-blue-200 rounded-lg flex items-center justify-center"><UserIcon className="h-6 w-6" /></div> }
] as const;

const bannerOptions: Array<{ name: BannerOption['name']; preview: JSX.Element }> = [
  { name: 'full', preview: <div className="h-4 w-20 bg-gray-300 rounded-none"></div> },
  { name: 'rounded', preview: <div className="h-4 w-20 bg-gray-300 rounded-lg"></div> },
  { name: 'none', preview: <div className="h-4 w-20 bg-transparent border border-gray-300"></div> }
] as const;

// Update the fontOptions array with more options
const fontOptions: Array<FontOption> = [
  { 
    name: 'modern', 
    class: 'font-sans', 
    preview: 'DM Sans'
  },
  { 
    name: 'classic', 
    class: 'font-serif', 
    preview: 'Merriweather'
  },
  { 
    name: 'playful', 
    class: 'font-comic', 
    preview: 'Comic Sans'
  },
  { 
    name: 'elegant', 
    class: 'font-playfair', 
    preview: 'Playfair'
  },
  { 
    name: 'minimal', 
    class: 'font-inter', 
    preview: 'Inter'
  },
  { 
    name: 'bold', 
    class: 'font-poppins', 
    preview: 'Poppins'
  },
  { 
    name: 'quirky', 
    class: 'font-caveat', 
    preview: 'Caveat'
  },
  { 
    name: 'tech', 
    class: 'font-roboto-mono', 
    preview: 'Roboto Mono'
  }
];

// Update the layoutOptions array to match the image design
const layoutOptions: Array<{ name: LayoutOption['name']; preview: JSX.Element }> = [
  { 
    name: 'stack', 
    preview: (
      <div className="w-full h-full bg-white border-2 border-gray-200 rounded-lg p-2 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
          <path d="M3 13h18v-2H3v2zm0 4h18v-2H3v2zm0-8h18V7H3v2z"/>
        </svg>
      </div>
    )
  },
  { 
    name: 'grid', 
    preview: (
      <div className="w-full h-full bg-white border-2 border-gray-200 rounded-lg p-2 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
          <path d="M3 3h7v7H3zm11 0h7v7h-7zm0 11h7v7h-7zM3 14h7v7H3z"/>
        </svg>
      </div>
    )
  },
  { 
    name: 'carousel', 
    preview: (
      <div className="w-full h-full bg-white border-2 border-gray-200 rounded-lg p-2 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
          <path d="M21 3H3v18h18V3zm-9 14H5V7h7v10zm7 0h-5V7h5v10z"/>
        </svg>
      </div>
    )
  }
];

// Update button style options to match the image
const buttonStyleOptions = [
  { name: 'fill', preview: (
    <div className="w-full h-8 bg-black rounded-lg"></div>
  )},
  { name: 'outline', preview: (
    <div className="w-full h-8 border-2 border-black rounded-lg"></div>
  )},
  { name: 'hard-shadow', preview: (
    <div className="w-full h-8 bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
  )},
  { name: 'soft-shadow', preview: (
    <div className="w-full h-8 bg-white border-2 border-black rounded-lg shadow-lg"></div>
  )},
  { name: 'special-1', preview: (
    <div className="w-full h-8 bg-black rounded-lg" style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)' }}></div>
  )},
  { name: 'special-2', preview: (
    <div className="w-full h-8 bg-black rounded-lg" style={{ clipPath: 'polygon(5% 0, 95% 0, 100% 100%, 0% 100%)' }}></div>
  )}
];

const Theme: React.FC = () => {
  const {
    username,
    bio,
    profilePic,
    bannerImage,
    addedLinks,
    shareProfile
  } = useProfile();
  
  const {
    setProfilePic,
    setBannerImage
  } = useAppearance();
  
  // Theme States with proper typing
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>(themeOptions[0]);
  const [buttonStyle, setButtonStyle] = useState<ButtonOption['name']>('rounded');
  const [profileStyle, setProfileStyle] = useState<ProfileOption['name']>('circle');
  const [bannerStyle, setBannerStyle] = useState<BannerOption['name']>('full');
  const [fontStyle, setFontStyle] = useState<FontOption['name']>('modern');

  // CSS classes based on selections
  const [themeClasses, setThemeClasses] = useState("");
  const [buttonClasses, setButtonClasses] = useState("");
  const [profileClasses, setProfileClasses] = useState("");
  const [bannerClasses, setBannerClasses] = useState("");
  const [fontClasses, setFontClasses] = useState("");

  // Add activeTab state
  const [activeTab, setActiveTab] = useState<'link' | 'shop'>('link');

  // Add new state for layout
  const [selectedLayout, setSelectedLayout] = useState<LayoutOption['name']>('stack');

  // Add new state for theme colors and font colors
  const [fontColor, setFontColor] = useState('#000000');
  const [selectedFont, setSelectedFont] = useState<FontOption>(fontOptions[0]);

  // Add these to your existing state declarations
  const [selectedButtonStyle, setSelectedButtonStyle] = useState<ButtonStyle>('fill');
  const [buttonColor, setButtonColor] = useState('#000000');
  const [buttonTextColor, setButtonTextColor] = useState('#FFFFFF');

  // Update theme classes when selections change
  useEffect(() => {
    // Update theme classes when theme changes
    setThemeClasses(`${selectedTheme.background} ${selectedTheme.textColor}`);
  }, [selectedTheme]);

  // Handle Image Upload
  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "banner"
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (type === "profile") {
          setProfilePic(base64String);
        } else {
          setBannerImage(base64String);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  // Update the links section in the mobile preview to use the selected layout
  const renderLinks = () => {
    const filteredLinks = addedLinks.filter(link => activeTab === 'shop' ? link.isShop : !link.isShop);
    
    const getLinkClasses = () => {
      switch (selectedLayout) {
        case 'grid':
          return "bg-gray-100 rounded-lg p-2 flex flex-col items-center h-full";
        case 'carousel':
          return "bg-gray-100 rounded-lg p-2 flex-shrink-0 w-[200px] flex flex-col items-center";
        default: // stack
          return "bg-gray-100 rounded-lg p-2 flex items-center space-x-2";
      }
    };

    const getIconClasses = () => {
      switch (selectedLayout) {
        case 'grid':
          return "w-10 h-10 mb-2";
        case 'carousel':
          return "w-10 h-10 mb-2";
        default: // stack
          return "w-8 h-8";
      }
    };

    const getTextClasses = () => {
      switch (selectedLayout) {
        case 'grid':
          return "text-center w-full text-xs font-medium text-gray-900 line-clamp-2";
        case 'carousel':
          return "text-center w-full text-xs font-medium text-gray-900 line-clamp-2";
        default: // stack
          return "text-xs font-medium text-gray-900 truncate";
      }
    };

    switch (selectedLayout) {
      case 'grid':
        return (
          <div className="grid grid-cols-2 gap-2">
            {filteredLinks.map((link, index) => (
              <div key={index} className={getLinkClasses()}>
                <div className={`${getIconClasses()} ${
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
                  <p className={getTextClasses()}>{link.title}</p>
                </div>
                {link.isShop && (
                  <button 
                    onClick={() => window.open(link.url, '_blank')}
                    className="mt-2 px-3 py-1 bg-green-600 text-white text-[10px] rounded-full hover:bg-green-700 transition-colors"
                  >
                    Buy Now
                  </button>
                )}
              </div>
            ))}
          </div>
        );

      case 'carousel':
        return (
          <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
            {filteredLinks.map((link, index) => (
              <div key={index} className={getLinkClasses()}>
                <div className={`${getIconClasses()} ${
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
                  <p className={getTextClasses()}>{link.title}</p>
                </div>
                {link.isShop && (
                  <button 
                    onClick={() => window.open(link.url, '_blank')}
                    className="mt-2 px-3 py-1 bg-green-600 text-white text-[10px] rounded-full hover:bg-green-700 transition-colors"
                  >
                    Buy Now
                  </button>
                )}
              </div>
            ))}
          </div>
        );

      default: // stack
        return (
          <div className="flex flex-col space-y-2">
            {filteredLinks.map((link, index) => (
              <div key={index} className={getLinkClasses()}>
                <div className={`${getIconClasses()} ${
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
                  <p className={getTextClasses()}>{link.title}</p>
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
          </div>
        );
    }
  };

  // Function to get theme classes based on theme name
  const getThemeClasses = (themeName: string) => {
    switch (themeName) {
      case 'Air Snow':
        return 'bg-white text-gray-900';
      case 'Air Grey':
        return 'bg-gray-100 text-gray-900';
      case 'Air Smoke':
        return 'bg-gray-800 text-white';
      case 'Air Black':
        return 'bg-black text-white';
      case 'Mineral Blue':
        return 'bg-blue-50 text-gray-900';
      case 'Mineral Green':
        return 'bg-green-50 text-gray-900';
      case 'Mineral Orange':
        return 'bg-orange-50 text-gray-900';
      case 'Mineral Yellow':
        return 'bg-yellow-50 text-gray-900';
      default:
        return 'bg-white text-gray-900';
    }
  };

  // Update the Fonts section in the right side editor
  const FontsSection = () => (
    <div className="bg-white rounded-xl p-6 mb-6">
      <h2 className="text-lg font-medium mb-4">Fonts</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-sm text-gray-500 mb-3">Font</h3>
          <div className="grid grid-cols-2 gap-4">
            {fontOptions.map((font) => (
              <button
                key={font.name}
                onClick={() => setSelectedFont(font)}
                className={`flex items-center space-x-3 p-3 border-2 rounded-lg ${
                  selectedFont.name === font.name
                    ? 'border-black bg-black bg-opacity-5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className={`text-2xl ${font.class}`}>Aa</span>
                <span className="text-sm text-gray-600">{font.preview}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm text-gray-500 mb-3">Color</h3>
          <input
            type="color"
            value={fontColor}
            onChange={(e) => setFontColor(e.target.value)}
            className="w-32 h-12 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );

  // Update the Themes section
  const ThemesSection = () => (
    <div className="bg-white rounded-xl p-6">
      <h2 className="text-lg font-medium mb-4">Themes</h2>
      <div className="grid grid-cols-4 gap-4">
        {themeOptions.map((theme) => (
          <button
            key={theme.name}
            onClick={() => setSelectedTheme(theme)}
            className={`group flex flex-col items-center bg-white rounded-xl p-4 transition-all ${
              selectedTheme.name === theme.name
                ? 'ring-2 ring-black ring-offset-2'
                : 'border-2 border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Theme Preview */}
            <div className={`w-full aspect-square ${theme.preview} rounded-lg mb-3 shadow-sm group-hover:shadow-md transition-shadow`}>
              {/* Preview Content */}
              <div className="w-full h-full flex flex-col items-center justify-center p-3">
                <div className={`w-8 h-2 ${theme.textColor} opacity-60 rounded-full mb-1`}></div>
                <div className={`w-6 h-2 ${theme.textColor} opacity-60 rounded-full`}></div>
              </div>
            </div>
            {/* Theme Name and Description */}
            <span className="text-sm font-medium text-gray-900">{theme.name}</span>
            {theme.description && (
              <span className="text-xs text-gray-500 mt-1">{theme.description}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  // Add this function to get button styles
  const getButtonStyles = (style: ButtonStyle) => {
    switch (style) {
      case 'fill':
        return `bg-[${buttonColor}] text-[${buttonTextColor}] hover:opacity-90`;
      case 'outline':
        return `border-2 border-[${buttonColor}] text-[${buttonColor}] bg-transparent hover:bg-[${buttonColor}] hover:text-[${buttonTextColor}]`;
      case 'hard-shadow':
        return `bg-[${buttonColor}] text-[${buttonTextColor}] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.25)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.25)]`;
      case 'soft-shadow':
        return `bg-[${buttonColor}] text-[${buttonTextColor}] shadow-lg hover:shadow-md`;
      default:
        return `bg-[${buttonColor}] text-[${buttonTextColor}]`;
    }
  };

  // Update the Buttons section in your right side editor
  const ButtonsSection = () => (
    <>
      <div className="bg-white rounded-xl p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Buttons</h2>
        
        {/* Fill */}
        <div className="mb-6">
          <h3 className="text-sm text-gray-500 mb-3">Fill</h3>
          <button
            onClick={() => setSelectedButtonStyle('fill')}
            className={`w-full h-12 rounded-lg transition-all ${
              selectedButtonStyle === 'fill' 
                ? 'ring-2 ring-black ring-offset-2' 
                : ''
            }`}
            style={{ backgroundColor: buttonColor }}
          />
        </div>

        {/* Outline */}
        <div className="mb-6">
          <h3 className="text-sm text-gray-500 mb-3">Outline</h3>
          <button
            onClick={() => setSelectedButtonStyle('outline')}
            className={`w-full h-12 rounded-lg border-2 transition-all ${
              selectedButtonStyle === 'outline'
                ? 'ring-2 ring-black ring-offset-2'
                : ''
            }`}
            style={{ borderColor: buttonColor, color: buttonColor }}
          />
        </div>

        {/* Hard shadow */}
        <div className="mb-6">
          <h3 className="text-sm text-gray-500 mb-3">Hard shadow</h3>
          <button
            onClick={() => setSelectedButtonStyle('hard-shadow')}
            className={`w-full h-12 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,0.25)] transition-all ${
              selectedButtonStyle === 'hard-shadow'
                ? 'ring-2 ring-black ring-offset-2'
                : ''
            }`}
            style={{ backgroundColor: buttonColor }}
          />
        </div>

        {/* Soft shadow */}
        <div>
          <h3 className="text-sm text-gray-500 mb-3">Soft shadow</h3>
          <button
            onClick={() => setSelectedButtonStyle('soft-shadow')}
            className={`w-full h-12 rounded-lg shadow-lg transition-all ${
              selectedButtonStyle === 'soft-shadow'
                ? 'ring-2 ring-black ring-offset-2'
                : ''
            }`}
            style={{ backgroundColor: buttonColor }}
          />
        </div>
      </div>

      {/* Button Color */}
      <div className="bg-white rounded-xl p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Button color</h2>
        <input
          type="color"
          value={buttonColor}
          onChange={(e) => setButtonColor(e.target.value)}
          className="w-32 h-12 rounded-lg cursor-pointer"
        />
      </div>

      {/* Button Font Color */}
      <div className="bg-white rounded-xl p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Button font color</h2>
        <input
          type="color"
          value={buttonTextColor}
          onChange={(e) => setButtonTextColor(e.target.value)}
          className="w-32 h-12 rounded-lg cursor-pointer"
        />
      </div>
    </>
  );

  // Update the Get Connected button in your mobile preview
  const GetConnectedButton = () => (
    <button 
      className={`w-full py-1.5 rounded-lg text-xs font-medium transition-all ${getButtonStyles(selectedButtonStyle)}`}
      onClick={() => {
        window.open(`https://yourwebsite.com/${username}`, '_blank');
      }}
      style={{
        backgroundColor: selectedButtonStyle === 'outline' ? 'transparent' : buttonColor,
        color: selectedButtonStyle === 'outline' ? buttonColor : buttonTextColor,
        borderColor: selectedButtonStyle === 'outline' ? buttonColor : 'transparent'
      }}
    >
      Get Connected
    </button>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 px-4 lg:px-8">
      {/* Left Side - Mobile Preview - Keep exactly as is */}
      <div className="w-full lg:w-[350px] lg:fixed lg:flex-shrink-0 mb-8 lg:mb-0">
        <div className="lg:sticky top-8 flex justify-center lg:justify-start">
          <div className={`bg-white rounded-[30px] h-[450px] shadow-[10px_10px_10px_rgba(0,0,0,0.5)] p-4 border-2 border-gray-200 aspect-[9/18] relative overflow-hidden ${themeClasses} ${selectedFont.class}`}>
            {/* Keep all existing mobile preview code unchanged */}
            {/* Share Button */}
            <button
              onClick={shareProfile}
              className={`absolute top-4 right-4 z-10 ${
                selectedTheme.textColor === 'text-white' 
                  ? 'bg-white/20 backdrop-blur-sm hover:bg-white/30' 
                  : 'bg-black/10 backdrop-blur-sm hover:bg-black/20'
              } p-2 rounded-full shadow-md transition-colors`}
            >
              <Share2 className={`w-5 h-5 ${selectedTheme.textColor}`} />
            </button>

            {/* Banner Image */}
            <div className={`relative w-full h-24 bg-gray-200 overflow-hidden ${bannerClasses}`}>
              {bannerImage ? (
                <img src={bannerImage} alt="Banner" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200" />
              )}
            </div>

            {/* Profile Section */}
            <div className="relative -mt-10 flex flex-col items-center">
              <div className={`w-20 h-20 bg-white overflow-hidden border-4 border-white shadow-lg ${profileClasses}`}>
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-2xl text-gray-400">@</span>
                  </div>
                  )}
                </div>
              <h2 className={`mt-2 text-lg font-semibold ${fontClasses}`} style={{ color: fontColor }}>{username}</h2>
              {bio && <p className={`text-sm text-gray-500 text-center mt-1 ${fontClasses}`}>{bio}</p>}
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

              {/* Links with selected layout */}
              {renderLinks()}

              {/* Get Connected Button */}
              <GetConnectedButton />
            </div>
          </div>
            </div>
          </div>

      {/* Right Side - Theme Editor - Updated Design */}
      <div className="flex-1 lg:ml-[350px]">
        {/* Layout Section */}
        <div className="bg-white rounded-xl p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Layout</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { name: 'stack', icon: <LayoutList className="w-6 h-6" /> },
              { name: 'grid', icon: <Grid className="w-6 h-6" /> },
              { name: 'carousel', icon: <ScrollText className="w-6 h-6" /> }
            ].map((layout) => (
                <button
                key={layout.name}
                onClick={() => setSelectedLayout(layout.name as LayoutOption['name'])}
                className={`aspect-square p-4 flex flex-col items-center justify-center rounded-lg ${
                  selectedLayout === layout.name 
                    ? 'bg-black bg-opacity-5 border-2 border-black' 
                    : 'border-2 border-gray-200'
                }`}
              >
                {layout.icon}
                <span className="mt-2 text-sm capitalize">{layout.name}</span>
                </button>
              ))}
            </div>
          </div>

        {/* Buttons Section */}
        <ButtonsSection />

        <FontsSection />
        <ThemesSection />
      </div>
    </div>
  );
};

export default Theme;