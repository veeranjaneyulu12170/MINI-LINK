import React, { useMemo, useState } from 'react';
import { BarChart3, TrendingUp, MousePointer, Award, Calendar, Smartphone, Globe, MapPin, Users } from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';

interface AnalyticsProps {
  links: Link[];
}

// First, let's define the Link interface at the top of the file
interface Link {
  _id: string;
  shortUrl: string;
  originalUrl: string;
  title: string;
  clicks: number;
  backgroundColor?: string;
  textColor?: string;
  createdAt: string;
  clickData?: {
    timestamp: string;
    referrer?: string;
    device?: string;
    browser?: string;
    location?: string;
  }[];
}

// Extended Link interface with additional analytics properties
interface ExtendedLink extends Link {
  uniqueViews: number;
  clicks: number;
  devices: {
    [key: string]: number;  // e.g., mobile: 50, desktop: 30, tablet: 20
  };
  locations: {
    [key: string]: number;  // e.g., "US": 50, "UK": 30
  };
  referrers: {
    [key: string]: number;  // e.g., "YouTube": 50, "Facebook": 30
  };
  clicksByDate: {
    date: string;
    clicks: number;
    uniqueViews: number;
  }[];
}

const Analytics: React.FC<AnalyticsProps> = ({ links }) => {
  const [timeRange, setTimeRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'clicks' | 'uniqueViews'>('clicks');
  const itemsPerPage = 6;

  const stats = useMemo(() => {
    console.log("Analytics recalculating...", links);
    
    if (!links || links.length === 0) {
      return { 
        totalClicks: 0, 
        uniqueViews: 0,
        clickThruRate: 0,
        averageClicks: 0, 
        topLinks: [], 
        timeSeriesData: [],
        deviceData: [],
        sourceData: [],
        locationData: [],
        linkPerformanceData: []
      };
    }
    
    // Calculate total clicks across all links
    const totalClicks = links.reduce((total, link) => total + (link.clicks || 0), 0);
    
    // Calculate total unique views (if available in the data)
    const totalUniqueViews = links.reduce((total, link) => {
      // Use the uniqueViews property if available, otherwise estimate as 70% of clicks
      const uniqueViews = (link as ExtendedLink).uniqueViews || Math.floor((link.clicks || 0) * 0.7);
      return total + uniqueViews;
    }, 0);
    
    // Calculate click-through rate
    const clickThruRate = totalUniqueViews > 0 ? 
      ((totalClicks / totalUniqueViews) * 100).toFixed(1) : '0';
    
    const averageClicks = links.length > 0 ? (totalClicks / links.length).toFixed(1) : '0';
    
    const sortedLinks = [...links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
    const topLinks = sortedLinks.slice(0, 5);
    
    // Generate time series data based on the selected time range
    const timeSeriesData = generateTimeSeriesData(links, timeRange);
    
    // Aggregate device data from all links
    const deviceData = aggregateDeviceData(links);
    
    // Aggregate source/referrer data from all links
    const sourceData = aggregateSourceData(links);
    
    // Aggregate location data from all links
    const locationData = aggregateLocationData(links);
    
    // Generate link performance data
    const linkPerformanceData = sortedLinks.slice(0, 8).map((link, index) => {
      return {
        name: link.shortUrl || `Link ${index + 1}`,
        clicks: link.clicks || 0,
        uniqueViews: (link as ExtendedLink).uniqueViews || Math.floor((link.clicks || 0) * 0.7),
        color: index % 2 === 0 ? '#4ade80' : '#16a34a'
      };
    });
    
    return { 
      totalClicks, 
      uniqueViews: totalUniqueViews,
      clickThruRate,
      averageClicks, 
      topLinks, 
      timeSeriesData,
      deviceData,
      sourceData,
      locationData,
      linkPerformanceData
    };
  }, [links, timeRange]);

  // Helper functions for data aggregation
  function generateTimeSeriesData(links: Link[], timeRange: string) {
    const today = new Date();
    let daysToShow = 7;
    if (timeRange === 'month') daysToShow = 30;
    if (timeRange === 'all') daysToShow = 90;
    
    // Create a map to store clicks by date
    const clicksByDate = new Map();
    const uniqueViewsByDate = new Map();
    
    // Initialize empty data for all dates in range
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      clicksByDate.set(dateStr, 0);
      uniqueViewsByDate.set(dateStr, new Set());
    }
    
    // Process each link's click data
    links.forEach(link => {
      if (link.clickData && link.clickData.length > 0) {
        link.clickData.forEach(data => {
          const clickDate = new Date(data.timestamp);
          const daysAgo = Math.floor((today.getTime() - clickDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysAgo < daysToShow) {
            const dateStr = data.timestamp.split('T')[0];
            
            // Increment click count for this date
            if (clicksByDate.has(dateStr)) {
              clicksByDate.set(dateStr, clicksByDate.get(dateStr) + 1);
            }
            
            // Add unique identifier for unique views
            if (uniqueViewsByDate.has(dateStr)) {
              uniqueViewsByDate.get(dateStr).add(data.timestamp);
            }
          }
        });
      }
    });
    
    // Convert maps to array of objects for chart
    const dataPoints: {date: string, clicks: number, uniqueViews: number}[] = [];
    clicksByDate.forEach((clicks, date) => {
      dataPoints.push({
        date,
        clicks,
        uniqueViews: uniqueViewsByDate.get(date)?.size || 0
      });
    });
    
    // Sort by date
    return dataPoints.sort((a, b) => a.date.localeCompare(b.date));
  }
  
  function aggregateDeviceData(links: Link[]) {
    // Device usage counter
    const deviceCounts: {[key: string]: number} = {
      'Mobile': 0,
      'Desktop': 0,
      'Tablet': 0,
      'Other': 0
    };
    
    let hasRealData = false;
    
    // Count devices from actual click data
    links.forEach(link => {
      if (link.clickData && link.clickData.length > 0) {
        link.clickData.forEach(data => {
          if (data.device) {
            hasRealData = true;
            const deviceType = categorizeDevice(data.device);
            deviceCounts[deviceType] = (deviceCounts[deviceType] || 0) + 1;
          }
        });
      }
    });
    
    // If no real data was found, use estimates based on industry standards
    if (!hasRealData) {
      const totalClicks = links.reduce((total, link) => total + (link.clicks || 0), 0);
      deviceCounts['Mobile'] = Math.floor(totalClicks * 0.6); // ~60% mobile traffic
      deviceCounts['Desktop'] = Math.floor(totalClicks * 0.35); // ~35% desktop traffic
      deviceCounts['Tablet'] = Math.floor(totalClicks * 0.04); // ~4% tablet traffic
      deviceCounts['Other'] = totalClicks - deviceCounts['Mobile'] - deviceCounts['Desktop'] - deviceCounts['Tablet'];
    }
    
    // Convert to format needed for charts
    return [
      { name: 'Mobile', value: deviceCounts['Mobile'], color: '#4ade80' },
      { name: 'Desktop', value: deviceCounts['Desktop'], color: '#22c55e' },
      { name: 'Tablet', value: deviceCounts['Tablet'], color: '#16a34a' },
      { name: 'Other', value: deviceCounts['Other'], color: '#15803d' }
    ].filter(item => item.value > 0); // Only include non-zero values
  }
  
  function categorizeDevice(deviceString: string): string {
    deviceString = deviceString.toLowerCase();
    if (deviceString.includes('mobile') || deviceString.includes('phone') || deviceString.includes('android') || deviceString.includes('iphone')) {
      return 'Mobile';
    } else if (deviceString.includes('tablet') || deviceString.includes('ipad')) {
      return 'Tablet';
    } else if (deviceString.includes('desktop') || deviceString.includes('laptop') || deviceString.includes('windows') || deviceString.includes('macintosh')) {
      return 'Desktop';
    } else {
      return 'Other';
    }
  }
  
  function aggregateSourceData(links: Link[]) {
    // Source counter
    const sourceCounts: {[key: string]: number} = {};
    let hasRealData = false;
    
    // Count referrers from actual click data
    links.forEach(link => {
      if (link.clickData && link.clickData.length > 0) {
        link.clickData.forEach(data => {
          if (data.referrer) {
            hasRealData = true;
            const source = categorizeReferrer(data.referrer);
            sourceCounts[source] = (sourceCounts[source] || 0) + 1;
          }
        });
      }
    });
    
    // If no real data was found, return empty array
    if (!hasRealData) {
      return [];
    }
    
    // Convert to format needed for charts (top sources)
    const sortedSources = Object.entries(sourceCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6); // Top 6 sources
    
    const colors = ['#ef4444', '#3b82f6', '#ec4899', '#1da1f2', '#8b5cf6', '#64748b'];
    
    return sortedSources.map(([name, value], index) => ({
      name,
      value,
      color: colors[index]
    }));
  }
  
  function categorizeReferrer(referrer: string): string {
    const domain = referrer.toLowerCase();
    
    if (domain.includes('google')) return 'Google';
    if (domain.includes('facebook') || domain.includes('fb.com')) return 'Facebook';
    if (domain.includes('twitter') || domain.includes('t.co')) return 'Twitter';
    if (domain.includes('instagram')) return 'Instagram';
    if (domain.includes('linkedin')) return 'LinkedIn';
    if (domain === 'direct') return 'Direct';
    
    return 'Other';
  }
  
  function aggregateLocationData(links: Link[]) {
    // Location counter
    const locationCounts: {[key: string]: number} = {};
    let hasRealData = false;
    
    // Count locations from actual click data
    links.forEach(link => {
      if (link.clickData && link.clickData.length > 0) {
        link.clickData.forEach(data => {
          if (data.location) {
            hasRealData = true;
            const location = data.location.trim();
            locationCounts[location] = (locationCounts[location] || 0) + 1;
          }
        });
      }
    });
    
    // If no real data was found, return empty array
    if (!hasRealData) {
      return [];
    }
    
    // Convert to format needed for charts (top locations)
    const sortedLocations = Object.entries(locationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // Top 5 locations
    
    const colors = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#64748b'];
    
    return sortedLocations.map(([name, value], index) => ({
      name,
      value,
      color: colors[index]
    }));
  }

  // Time range filter options
  const timeRangeOptions = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'all', label: 'All Time' }
  ];
  
  // View mode options
  const viewModeOptions = [
    { value: 'clicks', label: 'Total Clicks' },
    { value: 'uniqueViews', label: 'Unique Views' }
  ];
  
  // Pagination
  const totalPages = Math.ceil(links.length / itemsPerPage);
  const paginatedLinks = links.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Top Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <MousePointer className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-medium">Total Clicks</h3>
          </div>
          <p className="text-3xl font-bold text-green-500">
            {stats.totalClicks.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-medium">Unique Views</h3>
          </div>
          <p className="text-3xl font-bold text-green-500">
            {stats.uniqueViews.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-medium">CTR</h3>
          </div>
          <p className="text-3xl font-bold text-green-500">
            {stats.clickThruRate}%
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-medium">Avg. Clicks/Link</h3>
          </div>
          <p className="text-3xl font-bold text-green-500">
            {stats.averageClicks}
          </p>
        </div>
      </div>

      {/* Traffic Over Time Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-medium">Traffic Over Time</h3>
          </div>
          
          <div className="flex items-center gap-2">
            {/* View mode toggle */}
            <div className="mr-4">
              {viewModeOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setViewMode(option.value as 'clicks' | 'uniqueViews')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    viewMode === option.value
                      ? 'bg-indigo-100 text-indigo-700 font-medium'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            
            {/* Time range filter */}
            {timeRangeOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setTimeRange(option.value)}
                className={`px-3 py-1 text-sm rounded-md ${
                  timeRange === option.value
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={stats.timeSeriesData} 
              margin={{ top: 5, right: 20, bottom: 20, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }} 
                axisLine={false} 
                tickLine={false}
                tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip 
                formatter={(value) => [`${value} ${viewMode === 'clicks' ? 'clicks' : 'views'}`, viewMode === 'clicks' ? 'Clicks' : 'Unique Views']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                labelFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              />
              <Line 
                type="monotone" 
                dataKey={viewMode} 
                stroke="#10b981" 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 6, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Middle Section: Device and Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Traffic by Device */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <Smartphone className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-medium">Traffic by Device</h3>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={stats.deviceData} 
                layout="vertical"
                margin={{ top: 5, right: 5, bottom: 5, left: 40 }}
              >
                <CartesianGrid horizontal strokeDasharray="3 3" vertical={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis 
  dataKey="name" 
  type="category" 
  tick={{ fontSize: 12 }} 
  axisLine={false} 
  tickLine={false} 
/>
<Tooltip 
  formatter={(value) => [`${value} visits`, 'Visits']}
  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
/>
<Bar dataKey="value" fill="#4ade80">
  {
    stats.deviceData.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={entry.color} />
    ))
  }
</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Traffic by Source */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-medium">Traffic by Source</h3>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <Pie
                  data={stats.sourceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={2}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {stats.sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} visits`, name]}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Bottom Section: Locations and Link Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Traffic by Location */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-medium">Traffic by Location</h3>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={stats.locationData} 
                layout="vertical"
                margin={{ top: 5, right: 5, bottom: 5, left: 70 }}
              >
                <CartesianGrid horizontal strokeDasharray="3 3" vertical={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip 
                  formatter={(value) => [`${value} visits`, 'Visits']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                />
                <Bar dataKey="value" fill="#3b82f6">
                  {
                    stats.locationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Link Performance */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-medium">Link Performance</h3>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={stats.linkPerformanceData.slice(0, 5)} 
                margin={{ top: 5, right: 5, bottom: 20, left: 5 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  formatter={(value, name) => [value, name === 'clicks' ? 'Clicks' : 'Unique Views']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                />
                <Legend />
                <Bar dataKey="clicks" name="Clicks" fill="#4ade80" />
                <Bar dataKey="uniqueViews" name="Unique Views" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Link Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium mb-4">Your Links</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="pb-3 px-4 text-sm font-medium text-gray-500">Link</th>
                <th className="pb-3 px-4 text-sm font-medium text-gray-500">Clicks</th>
                <th className="pb-3 px-4 text-sm font-medium text-gray-500">Unique Views</th>
                <th className="pb-3 px-4 text-sm font-medium text-gray-500">CTR</th>
                <th className="pb-3 px-4 text-sm font-medium text-gray-500">Created</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLinks.map((link, index) => {
                const uniqueViews = (link as ExtendedLink).uniqueViews || 
                  Math.floor((link.clicks || 0) * 0.7);
                
                const ctr = uniqueViews > 0 ? 
                  (((link.clicks || 0) / uniqueViews) * 100).toFixed(1) : '0';
                
                return (
                  <tr key={link._id} className="border-b">
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-blue-600 truncate max-w-xs">
                          {link.shortUrl}
                        </span>
                        <span className="text-xs text-gray-500 truncate max-w-xs">
                          {link.originalUrl}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium">
                      {(link.clicks || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 font-medium">
                      {uniqueViews.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 font-medium">
                      {ctr}%
                    </td>
                    <td className="py-4 px-4 text-gray-500">
                      {new Date(link.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === i + 1
                      ? 'bg-indigo-100 text-indigo-700 font-medium'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;