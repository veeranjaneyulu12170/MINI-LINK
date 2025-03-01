import React, { useMemo } from 'react';
import { Link } from '../types';
import { BarChart3, TrendingUp, MousePointer, Award } from 'lucide-react';

interface AnalyticsProps {
  links: Link[];
}

const Analytics: React.FC<AnalyticsProps> = ({ links }) => {
  const stats = useMemo(() => {
    // Calculate total clicks
    const totalClicks = links.reduce((total, link) => {
      const clicks = typeof link.clicks === 'number' ? link.clicks : 0;
      return total + clicks;
    }, 0);

    // Calculate average clicks (rounded to 1 decimal place)
    const averageClicks = links.length > 0 
      ? Math.round((totalClicks / links.length) * 10) / 10
      : 0;

    // Sort links by clicks
    const sortedLinks = [...links].sort((a, b) => {
      const clicksA = typeof a.clicks === 'number' ? a.clicks : 0;
      const clicksB = typeof b.clicks === 'number' ? b.clicks : 0;
      return clicksB - clicksA;
    });

    // Get top 5 performing links
    const topLinks = sortedLinks.slice(0, 5);

    return {
      totalClicks,
      averageClicks,
      topLinks
    };
  }, [links]); // Recalculate when links array changes

  return (
    <div className="space-y-6">
      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <MousePointer className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-medium">Total Clicks</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalClicks.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-medium">Average Clicks</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {stats.averageClicks.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-medium">Total Links</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">
            {links.length.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Top Performing Links */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <Award className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-medium">Top Performing Links</h3>
        </div>
        
        {stats.topLinks.length > 0 ? (
          <div className="space-y-4">
            {stats.topLinks.map((link, index) => (
              <div 
                key={link.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{link.title}</h4>
                  <p className="text-sm text-gray-500">{link.url}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600">
                    {(link.clicks || 0).toLocaleString()} clicks
                  </span>
                  {index === 0 && (
                    <span className="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">
                      Top Link
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No link data available yet. Start sharing your links to see analytics!
          </p>
        )}
      </div>

      {/* Click Distribution Chart could be added here */}
    </div>
  );
};

export default Analytics;