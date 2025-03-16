import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'light' | 'dark';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', color = 'dark', className = '' }) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-8 w-8',
    large: 'h-10 w-10'
  };

  const colorClasses = {
    light: 'text-white',
    dark: 'text-indigo-600'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <svg 
        className={`${sizeClasses[size]} ${colorClasses[color]}`}
        viewBox="0 0 24 24" 
        fill="currentColor"
      >
        <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
      </svg>
      <span className="ml-2 text-xl font-bold text-gray-800">MiniLink</span>
    </div>
  );
};

export default Logo; 