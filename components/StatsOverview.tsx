import React from 'react';
import { FacebookPost } from '../types';

interface StatsOverviewProps {
  posts: FacebookPost[];
}

const getEngagement = (post: FacebookPost) => {
  if (!post.stats) return 0;
  return (post.stats.likes || 0) + (post.stats.comments || 0) + (post.stats.shares || 0);
};

const StatsOverview: React.FC<StatsOverviewProps> = ({ posts }) => {
  // Filter out any potentially malformed posts that might be missing stats entirely
  const validPosts = posts.filter(p => p && p.stats);
  const totalPosts = validPosts.length;
  
  const totalViews = validPosts.reduce((acc, curr) => acc + (curr.stats?.views || 0), 0);
  
  const avgEngagement = totalPosts > 0
    ? Math.round(validPosts.reduce((acc, curr) => acc + getEngagement(curr), 0) / totalPosts)
    : 0;

  // Calculate top media type
  const mediaCounts = validPosts.reduce((acc: Record<string, number>, post) => {
    const type = post.mediaType || 'UNKNOWN';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topMediaType = Object.entries(mediaCounts).sort((a: [string, number], b: [string, number]) => b[1] - a[1])[0]?.[0] || '-';

  const items = [
    { label: 'Total Posts', value: totalPosts },
    { label: 'Total Views', value: `${(totalViews / 1000).toFixed(1)}k` },
    { label: 'Avg Engagement', value: avgEngagement.toLocaleString() },
    { label: 'Top Format', value: topMediaType.toLowerCase(), className: 'capitalize' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {items.map((item, idx) => (
        <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center transition-shadow hover:shadow-md">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{item.label}</p>
          <p className={`text-2xl font-bold text-gray-900 ${item.className || ''}`}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;