import React from 'react';
import Logo from '../components/Logo';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-gray-50 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              {/* Logo Section */}
              <div className="flex justify-center mb-8">
                <Logo className="scale-150" /> {/* Larger logo for landing page */}
              </div>
              
              {/* Hero Content */}
              <div className="text-center">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Your Links,</span>
                  <span className="block text-indigo-600">Your Way</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                  Create, customize, and share all your important links in one place.
                </p>
                {/* Your existing CTA buttons */}
              </div>
            </main>
          </div>
        </div>
      </div>
      
      {/* Rest of your landing page content */}
    </div>
  );
};

export default LandingPage; 