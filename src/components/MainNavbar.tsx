import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LinkIcon } from 'lucide-react';
import { User } from '../types';

interface MainNavbarProps {
  user: User | null;
  onLogout?: () => void;
}

const MainNavbar: React.FC<MainNavbarProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
<nav className="bg-white/30 ml-2 mr-2 backdrop-blur-md shadow-sm fixed w-full rounded-lg top-2 z-50">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <LinkIcon className="h-8 w-8 text-indigo-600" />
            <Link to="/" className="ml-2 text-2xl font-bold text-gray-900">
              MiniLink
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-gray-700 hover:text-indigo-600 ${location.pathname === '/' ? 'text-indigo-600' : ''}`}
            >
              Home
            </Link>
            
            {/* Always show these links */}
            {isLandingPage ? (
              <>
                <button onClick={() => scrollToSection('features')} className="text-gray-700 hover:text-indigo-600">
                  Features
                </button>
                <button onClick={() => scrollToSection('pricing')} className="text-gray-700 hover:text-indigo-600">
                  Pricing
                </button>
                <button onClick={() => scrollToSection('testimonials')} className="text-gray-700 hover:text-indigo-600">
                  Testimonials
                </button>
                <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-indigo-600">
                  Contact
                </button>
              </>
            ) : (
              <>
                <Link to="/#features" className="text-gray-700 hover:text-indigo-600">
                  Features
                </Link>
                <Link to="/#pricing" className="text-gray-700 hover:text-indigo-600">
                  Pricing
                </Link>
                <Link to="/#testimonials" className="text-gray-700 hover:text-indigo-600">
                  Testimonials
                </Link>
                <Link to="/#contact" className="text-gray-700 hover:text-indigo-600">
                  Contact
                </Link>
              </>
            )}

            {/* Auth buttons */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link 
                    to="/app" 
                    className={`text-gray-700 hover:text-indigo-600 ${location.pathname.startsWith('/app') ? 'text-indigo-600' : ''}`}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={onLogout}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNavbar; 