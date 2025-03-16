import React, { useState } from 'react';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

interface ProfileSetupProps {
  user: User;
  updateUser: (updatedUser: User) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ user, updateUser }) => {
  const [username, setUsername] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const categories = [
    { id: 'business', label: 'Business', icon: '💼' },
    { id: 'creative', label: 'Creative', icon: '🎨' },
    { id: 'education', label: 'Education', icon: '📚' },
    { id: 'entertainment', label: 'Entertainment', icon: '🎭' },
    { id: 'fashion', label: 'Fashion & Beauty', icon: '👗' },
    { id: 'food', label: 'Food & Beverage', icon: '🍴' },
    { id: 'government', label: 'Government & Politics', icon: '⚖️' },
    { id: 'health', label: 'Health & Wellness', icon: '🍎' },
    { id: 'nonprofit', label: 'Non-Profit', icon: '💝' },
    { id: 'tech', label: 'Tech', icon: '💻' },
    { id: 'travel', label: 'Travel & Tourism', icon: '✈️' },
    { id: 'other', label: 'Other', icon: '💡' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate inputs
    if (!username) {
      setError('Username is required');
      return;
    }

    if (!category) {
      setError('Please select a category');
      return;
    }

    setLoading(true);

    try {
      // In a real application, you would make an API call to update the user profile
      // For now, we'll just update the local state
      const updatedUser = {
        ...user,
        username,
        category
      };

      // Update user in localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update user in parent component
      updateUser(updatedUser);

      // Navigate to the app
      navigate('/app', { replace: true });
    } catch (err: any) {
      console.error('Profile setup error:', err);
      setError(err.message || 'Failed to set up profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Logo size="large" />
            <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
              Complete Your Profile
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Let's set up your profile so you can get the most out of LinkHub
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Choose a username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button 
                    key={cat.id} 
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${
                      category === cat.id
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-1">{cat.icon}</span> {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? 'Setting up...' : 'Complete Setup'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden md:block md:w-1/2 bg-indigo-600">
        <div className="h-full flex items-center justify-center p-8">
          <div className="max-w-md text-white">
            <h2 className="text-3xl font-bold mb-6">Welcome to LinkHub!</h2>
            <p className="text-xl mb-4">
              Your one-stop solution for managing and sharing all your important links.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center">
                <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Create custom short links
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Track clicks and engagement
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Customize your profile
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Share with your audience
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;