import React, { useMemo } from 'react';
import { Heart, MessageCircle, Share2, ExternalLink, FileText, TrendingUp, BarChart3, Award, Target, Zap } from 'lucide-react';
import { FacebookPost, MediaType } from '../types';

interface AnalyticsViewProps {
  posts: FacebookPost[];
}

const MEDIA_COLORS: Record<string, string> = {
  VIDEO: '#3B82F6',
  IMAGE: '#10B981',
  LINK: '#F59E0B',
  TEXT: '#8B5CF6',
  ALBUM: '#EC4899',
};

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ posts }) => {
  const engagement = useMemo(() => {
    let likes = 0, comments = 0, shares = 0;
    for (const post of posts) {
      likes += post.stats?.likes || 0;
      comments += post.stats?.comments || 0;
      shares += post.stats?.shares || 0;
    }
    return { likes, comments, shares, total: likes + comments + shares };
  }, [posts]);

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
    })).filter(t => t.count > 0);
  }, [posts]);

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
    return Object.entries(typeStats)
      .map(([type, s]) => {
        const total = s.likes + s.comments + s.shares;
        return {
          type,
          count: s.count,
          avgEngagement: s.count > 0 ? total / s.count : 0,
          totalEngagement: total,
          avgLikes: s.count > 0 ? s.likes / s.count : 0,
          avgComments: s.count > 0 ? s.comments / s.count : 0,
          avgShares: s.count > 0 ? s.shares / s.count : 0,
          likes: s.likes,
          comments: s.comments,
          shares: s.shares,
        };
      })
      .sort((a, b) => b.avgEngagement - a.avgEngagement);
  }, [posts]);

  const engagementDistribution = useMemo(() => {
    const buckets = [
      { label: '0', min: 0, max: 0 },
      { label: '1-10', min: 1, max: 10 },
      { label: '11-50', min: 11, max: 50 },
      { label: '51-100', min: 51, max: 100 },
      { label: '101-500', min: 101, max: 500 },
      { label: '501-1K', min: 501, max: 1000 },
      { label: '1K+', min: 1001, max: Infinity },
    ];
    const counts = buckets.map(b => ({ ...b, count: 0 }));
    for (const post of posts) {
      const eng = (post.stats?.likes || 0) + (post.stats?.comments || 0) + (post.stats?.shares || 0);
      for (const bucket of counts) {
        if (eng >= bucket.min && eng <= bucket.max) {
          bucket.count++;
          break;
        }
      }
    }
    const max = Math.max(...counts.map(c => c.count), 1);
    return counts.map(c => ({ ...c, percentage: (c.count / max) * 100 }));
  }, [posts]);

  const engagementStats = useMemo(() => {
    const values = posts
      .map(p => (p.stats?.likes || 0) + (p.stats?.comments || 0) + (p.stats?.shares || 0))
      .sort((a, b) => a - b);
    const n = values.length;
    if (n === 0) return { median: 0, p75: 0, p90: 0, p95: 0, p99: 0, min: 0, max: 0 };
    const pct = (p: number) => values[Math.floor(p / 100 * (n - 1))];
    return {
      median: pct(50),
      p75: pct(75),
      p90: pct(90),
      p95: pct(95),
      p99: pct(99),
      min: values[0],
      max: values[n - 1],
    };
  }, [posts]);

  const engagementComposition = useMemo(() => {
    return performanceByType.map(t => {
      const total = t.likes + t.comments + t.shares || 1;
      return {
        type: t.type,
        count: t.count,
        likesPct: (t.likes / total) * 100,
        commentsPct: (t.comments / total) * 100,
        sharesPct: (t.shares / total) * 100,
        likes: t.likes,
        comments: t.comments,
        shares: t.shares,
      };
    });
  }, [performanceByType]);

  const exploitStats = useMemo(() => {
    const exploitPosts = posts.filter(p => p.usesImageExploit);
    const nonExploitText = posts.filter(p => p.mediaType === 'TEXT' && !p.usesImageExploit);
    const allText = posts.filter(p => p.mediaType === 'TEXT');
    const getEng = (p: FacebookPost) => (p.stats?.likes || 0) + (p.stats?.comments || 0) + (p.stats?.shares || 0);

    const exploitEng = exploitPosts.reduce((sum, p) => sum + getEng(p), 0);
    const nonExploitEng = nonExploitText.reduce((sum, p) => sum + getEng(p), 0);
    const imagePosts = posts.filter(p => p.mediaType === 'IMAGE');
    const imageEng = imagePosts.reduce((sum, p) => sum + getEng(p), 0);

    return {
      count: exploitPosts.length,
      total: posts.length,
      percentage: posts.length > 0 ? (exploitPosts.length / posts.length) * 100 : 0,
      textTotal: allText.length,
      textPercentageUsingExploit: allText.length > 0 ? (exploitPosts.length / allText.length) * 100 : 0,
      avgEngExploit: exploitPosts.length > 0 ? exploitEng / exploitPosts.length : 0,
      avgEngPureText: nonExploitText.length > 0 ? nonExploitEng / nonExploitText.length : 0,
      avgEngImage: imagePosts.length > 0 ? imageEng / imagePosts.length : 0,
      pureTextCount: nonExploitText.length,
      exploitLikes: exploitPosts.reduce((s, p) => s + (p.stats?.likes || 0), 0),
      exploitComments: exploitPosts.reduce((s, p) => s + (p.stats?.comments || 0), 0),
      exploitShares: exploitPosts.reduce((s, p) => s + (p.stats?.shares || 0), 0),
    };
  }, [posts]);

  const topPosts = useMemo(() => {
    return [...posts]
      .sort((a, b) => {
        const engA = (a.stats?.likes || 0) + (a.stats?.comments || 0) + (a.stats?.shares || 0);
        const engB = (b.stats?.likes || 0) + (b.stats?.comments || 0) + (b.stats?.shares || 0);
        return engB - engA;
      })
      .slice(0, 10);
  }, [posts]);

  const formatNumber = (n: number): string => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toLocaleString();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
            <p className="text-sm text-gray-400 mt-0.5">{posts.length} posts analyzed</p>
          </div>
        </div>

        {/* Section 1: Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {[
            { label: 'Total Posts', value: posts.length.toLocaleString() },
            { label: 'Total Likes', value: formatNumber(engagement.likes) },
            { label: 'Total Comments', value: formatNumber(engagement.comments) },
            { label: 'Total Shares', value: formatNumber(engagement.shares) },
            { label: 'Avg / Post', value: (engagement.total / (posts.length || 1)).toFixed(1) },
            { label: 'Best Post', value: formatNumber(engagementStats.max) },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">{label}</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1" style={{ fontVariantNumeric: 'tabular-nums' }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Section 2: Content Mix + Performance by Type */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Content Mix */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-sm font-medium text-gray-900">Content Mix</h2>
            <div className="space-y-3 mt-4">
              {contentBreakdown.map(({ type, count, percentage }) => (
                <div key={type} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-medium text-gray-700">{type.charAt(0) + type.slice(1).toLowerCase()}</span>
                    <span className="text-[12px] text-gray-500" style={{ fontVariantNumeric: 'tabular-nums' }}>{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded overflow-hidden">
                    <div
                      className="h-full rounded"
                      style={{ width: `${percentage}%`, backgroundColor: MEDIA_COLORS[type] || '#6B7280' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance by Type */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-sm font-medium text-gray-900">Avg Engagement by Type</h2>
            <p className="text-[11px] text-gray-400">Average engagement per post by content type</p>
            <div className="space-y-4 mt-4">
              {performanceByType.map(({ type, count, avgEngagement, avgLikes, avgComments, avgShares }) => {
                const maxAvg = performanceByType[0]?.avgEngagement || 1;
                return (
                  <div key={type} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: `${MEDIA_COLORS[type] || '#6B7280'}15`, color: MEDIA_COLORS[type] || '#6B7280' }}
                        >
                          {type}
                        </span>
                        <span className="text-[11px] text-gray-400">{count} posts</span>
                      </div>
                      <span className="text-[13px] font-semibold text-gray-900" style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {avgEngagement.toFixed(1)}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded overflow-hidden">
                      <div
                        className="h-full rounded"
                        style={{ width: `${(avgEngagement / maxAvg) * 100}%`, backgroundColor: MEDIA_COLORS[type] || '#6B7280' }}
                      />
                    </div>
                    <p className="text-[11px] text-gray-400">
                      avg {avgLikes.toFixed(1)} likes &middot; {avgComments.toFixed(1)} comments &middot; {avgShares.toFixed(1)} shares
                    </p>
                  </div>
                );
              })}
              <div className="border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-gray-500">Overall</span>
                  <span className="text-[13px] font-semibold text-gray-900" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {(engagement.total / (posts.length || 1)).toFixed(1)} avg engagement
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Engagement Distribution + Percentiles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Engagement Distribution (Histogram) */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-sm font-medium text-gray-900">Engagement Distribution</h2>
            <p className="text-[11px] text-gray-400">Posts by total engagement range</p>
            <div className="flex items-end gap-2 h-[160px] mt-4">
              {engagementDistribution.map(({ label, count, percentage }) => (
                <div key={label} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
                  <span className="text-[10px] text-gray-500 font-medium" style={{ fontVariantNumeric: 'tabular-nums' }}>{count}</span>
                  <div className="w-full bg-gray-900 rounded-t" style={{ height: `${Math.max(percentage, percentage > 0 ? 3 : 0)}%` }} />
                  <span className="text-[10px] text-gray-400 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Engagement Percentiles */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-sm font-medium text-gray-900">Distribution Stats</h2>
            <p className="text-[11px] text-gray-400">Engagement percentiles across all posts</p>
            <div className="space-y-0 mt-4">
              {[
                { label: 'Minimum', value: engagementStats.min },
                { label: 'Median (P50)', value: engagementStats.median },
                { label: '75th Percentile', value: engagementStats.p75 },
                { label: '90th Percentile', value: engagementStats.p90 },
                { label: '95th Percentile', value: engagementStats.p95 },
                { label: '99th Percentile', value: engagementStats.p99 },
                { label: 'Maximum', value: engagementStats.max },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                  <span className="text-[13px] text-gray-600">{label}</span>
                  <span className="text-[13px] font-semibold text-gray-900" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Engagement Composition by Type */}
        <div className="mb-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-sm font-medium text-gray-900">Engagement Composition</h2>
            <p className="text-[11px] text-gray-400">How engagement breaks down by content type</p>
            <div className="space-y-5 mt-4">
              {engagementComposition.map(({ type, count, likesPct, commentsPct, sharesPct }) => (
                <div key={type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-medium text-gray-700">{type.charAt(0) + type.slice(1).toLowerCase()}</span>
                      <span className="text-[11px] text-gray-400">({count} posts)</span>
                    </div>
                  </div>
                  {/* Stacked horizontal bar */}
                  <div className="flex h-3 rounded overflow-hidden">
                    <div className="bg-rose-400" style={{ width: `${likesPct}%` }} title={`Likes: ${likesPct.toFixed(1)}%`} />
                    <div className="bg-blue-400" style={{ width: `${commentsPct}%` }} title={`Comments: ${commentsPct.toFixed(1)}%`} />
                    <div className="bg-emerald-400" style={{ width: `${sharesPct}%` }} title={`Shares: ${sharesPct.toFixed(1)}%`} />
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-gray-500">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-rose-400 inline-block"></span> Likes {likesPct.toFixed(1)}%</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-blue-400 inline-block"></span> Comments {commentsPct.toFixed(1)}%</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-400 inline-block"></span> Shares {sharesPct.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 5: Image Exploit / Reach Hack */}
        {exploitStats.count > 0 && (
          <div className="mb-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-medium text-gray-900">1px Image Reach Hack</h2>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200">EXPLOIT</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">Posts using a 1px invisible image to trigger Facebook's image-post algorithm boost</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Using Exploit</p>
                  <p className="text-xl font-semibold text-gray-900 mt-1" style={{ fontVariantNumeric: 'tabular-nums' }}>{exploitStats.count}</p>
                  <p className="text-[11px] text-gray-400">{exploitStats.percentage.toFixed(1)}% of all posts</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">% of Text Posts</p>
                  <p className="text-xl font-semibold text-gray-900 mt-1" style={{ fontVariantNumeric: 'tabular-nums' }}>{exploitStats.textPercentageUsingExploit.toFixed(1)}%</p>
                  <p className="text-[11px] text-gray-400">{exploitStats.count} of {exploitStats.textTotal} text posts</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Avg Eng (Exploit)</p>
                  <p className="text-xl font-semibold text-gray-900 mt-1" style={{ fontVariantNumeric: 'tabular-nums' }}>{exploitStats.avgEngExploit.toFixed(1)}</p>
                  <p className="text-[11px] text-gray-400">per exploit post</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Avg Eng (Pure Text)</p>
                  <p className="text-xl font-semibold text-gray-900 mt-1" style={{ fontVariantNumeric: 'tabular-nums' }}>{exploitStats.avgEngPureText.toFixed(1)}</p>
                  <p className="text-[11px] text-gray-400">no image attached</p>
                </div>
              </div>

              {/* Comparison bar */}
              <div className="mt-4 space-y-2">
                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Avg Engagement Comparison</p>
                {[
                  { label: 'Text + 1px Image', value: exploitStats.avgEngExploit, color: '#F59E0B' },
                  { label: 'Pure Text (no image)', value: exploitStats.avgEngPureText, color: '#8B5CF6' },
                  { label: 'Real Image Posts', value: exploitStats.avgEngImage, color: '#10B981' },
                ].map(({ label, value, color }) => {
                  const maxVal = Math.max(exploitStats.avgEngExploit, exploitStats.avgEngPureText, exploitStats.avgEngImage, 1);
                  return (
                    <div key={label} className="flex items-center gap-3">
                      <span className="text-[12px] text-gray-600 w-[140px] shrink-0">{label}</span>
                      <div className="flex-1 h-3 bg-gray-100 rounded overflow-hidden">
                        <div className="h-full rounded" style={{ width: `${(value / maxVal) * 100}%`, backgroundColor: color }} />
                      </div>
                      <span className="text-[13px] font-semibold text-gray-900 w-12 text-right" style={{ fontVariantNumeric: 'tabular-nums' }}>{value.toFixed(1)}</span>
                    </div>
                  );
                })}
              </div>

              {/* Exploit engagement breakdown */}
              <div className="border-t border-gray-100 mt-4 pt-3">
                <div className="flex items-center gap-6 text-[12px] text-gray-500">
                  <span>Exploit totals:</span>
                  <span className="flex items-center gap-1"><Heart size={11} className="text-rose-400" /> {formatNumber(exploitStats.exploitLikes)}</span>
                  <span className="flex items-center gap-1"><MessageCircle size={11} className="text-blue-400" /> {formatNumber(exploitStats.exploitComments)}</span>
                  <span className="flex items-center gap-1"><Share2 size={11} className="text-emerald-400" /> {formatNumber(exploitStats.exploitShares)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 6: Top 10 Posts */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-sm font-medium text-gray-900">Top 10 Posts</h2>
          <p className="text-[11px] text-gray-400">Highest engagement posts</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-4">
            {topPosts.map((post, i) => (
              <a
                href={post.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                key={post.id}
                className="flex gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group"
              >
                <span className="text-sm font-semibold text-gray-300 w-6 shrink-0 pt-0.5">#{i + 1}</span>
                <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100 shrink-0">
                  {(post.thumbnailUrl || post.mediaUrl) ? (
                    <img src={post.thumbnailUrl || post.mediaUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300"><FileText size={24} /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-gray-700 leading-snug line-clamp-2 group-hover:text-gray-900 transition-colors">
                    {post.content || 'No caption'}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{post.mediaType}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1"><Heart size={10} className="text-rose-400" /> {formatNumber(post.stats?.likes || 0)}</span>
                    <span className="flex items-center gap-1"><MessageCircle size={10} className="text-blue-400" /> {formatNumber(post.stats?.comments || 0)}</span>
                    <span className="flex items-center gap-1"><Share2 size={10} className="text-emerald-400" /> {formatNumber(post.stats?.shares || 0)}</span>
                  </div>
                </div>
                <ExternalLink size={12} className="text-gray-200 group-hover:text-gray-400 transition-colors mt-0.5 shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
