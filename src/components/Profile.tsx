import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { User, Link as LinkType } from '../types';


import { 
  Camera, Mail, User as UserIcon, Link as LinkIcon, Calendar,
  Activity, BarChart2, Clock, Award, Zap, Share2, Edit2, Save
} from 'lucide-react';

interface ProfileProps {
  user: User;
  updateUser: (user: User) => void;
  links: LinkType[]; // ✅ Correct: Uses the defined Link type
}


const Profile: React.FC<ProfileProps> = ({ user, updateUser, links }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [totalClicks, setTotalClicks] = useState(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Calculate total clicks and other stats
  useEffect(() => {
    const clicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);
    setTotalClicks(clicks);

    // Generate recent activity
    const activity = links
      .map(link => ({
        type: 'link_created',
        date: link.createdAt,
        link: link
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
    setRecentActivity(activity);
  }, [links]);

  const getCategoryLabel = (categoryId: string) => {
    const categories = {
      'business': 'Business',
      'creative': 'Creative',
      'education': 'Education',
      'entertainment': 'Entertainment',
      'fashion': 'Fashion & Beauty',
      'food': 'Food & Beverage',
      'government': 'Government & Politics',
      'health': 'Health & Wellness',
      'nonprofit': 'Non-Profit',
      'tech': 'Tech',
      'travel': 'Travel & Tourism',
      'other': 'Other'
    };
    
    return categories[categoryId as keyof typeof categories] || categoryId;
  };

  const getCategoryIcon = (categoryId: string) => {
    const icons = {
      'business': '💼',
      'creative': '🎨',
      'education': '📚',
      'entertainment': '🎬',
      'fashion': '👗',
      'food': '🍔',
      'government': '🏛️',
      'health': '🧘',
      'nonprofit': '🤝',
      'tech': '💻',
      'travel': '✈️',
      'other': '🔍'
    };
    
    return icons[categoryId as keyof typeof icons] || '📋';
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedUser(user);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user);
    setError('');
    setSuccess('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // In a real application, you would make an API call to update the user profile
      // For now, we'll just update the local state
      
      // Update user in localStorage
      localStorage.setItem('user', JSON.stringify(editedUser));
      
      // Update user in parent component
      updateUser(editedUser);

      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Not available';
      }
      return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    } catch (error) {
      return 'Not available';
    }
  };

  const getAccountAge = (dateString: string) => {
    try {
      const signupDate = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - signupDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 30) {
        return `${diffDays} days`;
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} ${months === 1 ? 'month' : 'months'}`;
      } else {
        const years = Math.floor(diffDays / 365);
        const months = Math.floor((diffDays % 365) / 30);
        return `${years}y ${months}m`;
      }
    } catch (error) {
      return 'N/A';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={editedUser.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${editedUser.name}`}
                  alt={editedUser.name}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg text-indigo-600 hover:text-indigo-700">
                    <Camera size={16} />
                  </button>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{editedUser.name}</h1>
                <p className="flex items-center mt-1 text-indigo-100">
                  <Mail className="w-4 h-4 mr-2" />
                  {editedUser.email}
                </p>
                {editedUser.bio && !isEditing && (
                  <p className="mt-2 text-indigo-100 max-w-2xl">{editedUser.bio}</p>
                )}
              </div>
            </div>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
              >
                <Edit2 size={18} className="mr-2" />
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Total Links</h3>
            <LinkIcon className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{links.length}</p>
          <p className="mt-1 text-sm text-gray-500">Active links</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Total Clicks</h3>
            <Activity className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalClicks}</p>
          <p className="mt-1 text-sm text-gray-500">Link clicks</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Avg. Clicks</h3>
            <BarChart2 className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {links.length ? Math.round(totalClicks / links.length) : 0}
          </p>
          <p className="mt-1 text-sm text-gray-500">Per link</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatDate(user.createdAt)}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {getAccountAge(user.createdAt)} ago
          </p>
        </div>
      </div>

      {/* Recent Activity & Top Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Zap className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Share2 className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Created new link: {activity.link.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Links */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Links</h3>
            <Award className="w-5 h-5 text-orange-500" />
          </div>
          <div className="space-y-4">
            {links
              .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
              .slice(0, 5)
              .map((link, index) => (
                <div key={link._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{link.title}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[200px]">{link.url}</p>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-indigo-600">
                    {link.clicks || 0} clicks
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      {isEditing && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={editedUser.name || ''}
                onChange={handleChange}
                name="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={editedUser.bio || ''}
                onChange={handleChange}
                name="bio"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={editedUser.email || ''}
                onChange={handleChange}
                name="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={editedUser.category || ''}
                onChange={handleChange}
                name="category"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select a category</option>
                <option value="business">Business</option>
                <option value="creative">Creative</option>
                <option value="education">Education</option>
                <option value="entertainment">Entertainment</option>
                <option value="fashion">Fashion & Beauty</option>
                <option value="food">Food & Beverage</option>
                <option value="government">Government & Politics</option>
                <option value="health">Health & Wellness</option>
                <option value="nonprofit">Non-Profit</option>
                <option value="tech">Tech</option>
                <option value="travel">Travel & Tourism</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {loading ? 'Saving...' : (
                  <>
                    <Save size={18} className="mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile; 