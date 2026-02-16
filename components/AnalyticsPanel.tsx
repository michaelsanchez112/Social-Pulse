import React, { useMemo } from 'react';
import { X, Heart, MessageCircle, Share2, BarChart3, ExternalLink, FileText } from 'lucide-react';
import { FacebookPost, MediaType } from '../types';

interface AnalyticsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  posts: FacebookPost[];
}

const MEDIA_COLORS: Record<string, string> = {
  VIDEO: '#3B82F6',
  IMAGE: '#10B981',
  LINK: '#F59E0B',
  TEXT: '#8B5CF6',
  ALBUM: '#EC4899',
};

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ isOpen, onClose, posts }) => {
  // Content Type Breakdown
  const contentBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const post of posts) {
      counts[post.mediaType] = (counts[post.mediaType] || 0) + 1;
    }
    const total = posts.length || 1;
    return Object.values(MediaType).map(type => ({
      type,
      count: counts[type] || 0,
      percentage: ((counts[type] || 0) / total) * 100,
    }));
  }, [posts]);

  // Engagement Overview
  const engagement = useMemo(() => {
    let likes = 0, comments = 0, shares = 0;
    for (const post of posts) {
      if (post.stats) {
        likes += post.stats.likes || 0;
        comments += post.stats.comments || 0;
        shares += post.stats.shares || 0;
      }
    }
    return { likes, comments, shares };
  }, [posts]);

  // Top 5 Posts by engagement
  const topPosts = useMemo(() => {
    return [...posts]
      .sort((a, b) => {
        const engA = (a.stats?.likes || 0) + (a.stats?.comments || 0) + (a.stats?.shares || 0);
        const engB = (b.stats?.likes || 0) + (b.stats?.comments || 0) + (b.stats?.shares || 0);
        return engB - engA;
      })
      .slice(0, 5);
  }, [posts]);

  // Performance by content type
  const performanceByType = useMemo(() => {
    const typeStats: Record<string, { count: number; likes: number; comments: number; shares: number }> = {};
    for (const post of posts) {
      const t = post.mediaType;
      if (!typeStats[t]) typeStats[t] = { count: 0, likes: 0, comments: 0, shares: 0 };
      typeStats[t].count++;
      typeStats[t].likes += post.stats?.likes || 0;
      typeStats[t].comments += post.stats?.comments || 0;
      typeStats[t].shares += post.stats?.shares || 0;
    }
    const results = Object.entries(typeStats)
      .map(([type, s]) => {
        const totalEng = s.likes + s.comments + s.shares;
        return {
          type,
          count: s.count,
          avgEngagement: s.count > 0 ? totalEng / s.count : 0,
          totalEngagement: totalEng,
          likes: s.likes,
          comments: s.comments,
          shares: s.shares,
        };
      })
      .sort((a, b) => b.avgEngagement - a.avgEngagement);
    return results;
  }, [posts]);

  const topPostEngagement = useMemo(() => {
    if (posts.length === 0) return 0;
    return Math.max(...posts.map(p => (p.stats?.likes || 0) + (p.stats?.comments || 0) + (p.stats?.shares || 0)));
  }, [posts]);

  const formatNumber = (n: number): string => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toLocaleString();
  };

  const getEngagement = (post: FacebookPost): number => {
    return (post.stats?.likes || 0) + (post.stats?.comments || 0) + (post.stats?.shares || 0);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[420px] max-w-full bg-gray-50 z-50 shadow-2xl overflow-y-auto transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 px-5 py-3.5 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-gray-900 rounded-md">
              <BarChart3 size={14} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Analytics</h2>
              <p className="text-[11px] text-gray-400">{posts.length} posts analyzed</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-5">
          {/* Section 1: Summary Stats */}
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: 'Total Posts', value: posts.length.toLocaleString() },
              { label: 'Top Post', value: formatNumber(topPostEngagement) },
              { label: 'Engagement', value: formatNumber(engagement.likes + engagement.comments + engagement.shares) },
              { label: 'Avg / Post', value: ((engagement.likes + engagement.comments + engagement.shares) / (posts.length || 1)).toFixed(1) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white border border-gray-200 rounded-lg p-3.5">
                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">{label}</p>
                <p className="text-xl font-semibold text-gray-900 mt-1" style={{ fontVariantNumeric: 'tabular-nums' }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Section 2: Content Mix */}
          <section className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-[13px] font-medium text-gray-900 mb-3">Content Mix</h3>
            <div className="space-y-2.5">
              {contentBreakdown.map(({ type, count, percentage }) => (
                <div key={type} className="flex items-center gap-2.5">
                  <span className="text-[11px] font-medium text-gray-500 w-11 shrink-0">
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded h-2 overflow-hidden">
                    <div
                      className="h-full rounded transition-all duration-500 ease-out"
                      style={{
                        width: `${Math.max(percentage, percentage > 0 ? 2 : 0)}%`,
                        backgroundColor: MEDIA_COLORS[type],
                        opacity: 0.8,
                      }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-gray-600 w-16 text-right shrink-0" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {count} ({percentage.toFixed(0)}%)
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Performance by Type */}
          <section className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-[13px] font-medium text-gray-900 mb-1">Performance by Type</h3>
            <p className="text-[11px] text-gray-400 mb-3">Average engagement per post</p>
            <div className="space-y-3">
              {performanceByType.filter(t => t.count > 0).map(({ type, count, avgEngagement, likes, comments, shares }) => {
                const maxAvg = Math.max(...performanceByType.map(t => t.avgEngagement), 1);
                return (
                  <div key={type} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                          {type.charAt(0) + type.slice(1).toLowerCase()}
                        </span>
                        <span className="text-[11px] text-gray-400">{count} posts</span>
                      </div>
                      <span className="text-[13px] font-semibold text-gray-900" style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {avgEngagement.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex-1 bg-gray-100 rounded h-2 overflow-hidden">
                      <div
                        className="h-full rounded transition-all duration-500 ease-out"
                        style={{
                          width: `${(avgEngagement / maxAvg) * 100}%`,
                          backgroundColor: MEDIA_COLORS[type],
                          opacity: 0.8,
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-gray-400">
                      <span>{formatNumber(likes)} likes</span>
                      <span>{formatNumber(comments)} comments</span>
                      <span>{formatNumber(shares)} shares</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 4: Engagement */}
          <section className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-[13px] font-medium text-gray-900 mb-2">Engagement</h3>
            <div className="divide-y divide-gray-100">
              {[
                { icon: Heart, label: 'Likes', value: engagement.likes, color: 'text-rose-400' },
                { icon: MessageCircle, label: 'Comments', value: engagement.comments, color: 'text-blue-400' },
                { icon: Share2, label: 'Shares', value: engagement.shares, color: 'text-emerald-400' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-2.5">
                    <Icon size={14} className={color} />
                    <span className="text-[13px] text-gray-600">{label}</span>
                  </div>
                  <span className="text-[13px] font-semibold text-gray-900" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {formatNumber(value)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: Top Posts */}
          <section className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-[13px] font-medium text-gray-900 mb-3">Top Posts</h3>
            <div className="divide-y divide-gray-100">
              {topPosts.map((post, i) => (
                <a
                  href={post.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={post.id}
                  className="flex gap-3 py-3 first:pt-0 last:pb-0 group"
                >
                  <span className="text-[11px] font-semibold text-gray-300 w-4 mt-0.5 shrink-0">#{i + 1}</span>
                  <div className="w-14 h-14 rounded-md overflow-hidden bg-gray-100 shrink-0">
                    {(post.thumbnailUrl || post.mediaUrl) ? (
                      <img
                        src={post.thumbnailUrl || post.mediaUrl}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <FileText size={18} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-gray-700 leading-snug line-clamp-2 group-hover:text-gray-900 transition-colors">
                      {post.content || 'No caption'}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                        {post.mediaType}
                      </span>
                      <span className="text-[11px] text-gray-400" style={{ fontVariantNumeric: 'tabular-nums' }}>
                        · {formatNumber(getEngagement(post))} engagements
                      </span>
                    </div>
                  </div>
                  <ExternalLink size={12} className="text-gray-200 group-hover:text-gray-400 transition-colors mt-0.5 shrink-0" />
                </a>
              ))}
              {topPosts.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No posts to display</p>
              )}
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default AnalyticsPanel;
