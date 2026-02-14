import React, { useState, useMemo } from 'react';
import FilterBar from './components/FilterBar';
import PostCard from './components/PostCard';
import StatsOverview from './components/StatsOverview';
import ImportModal from './components/ImportModal';
import InsightModal from './components/InsightModal';
import { FacebookPost, FilterState } from './types';
import { MOCK_POSTS } from './constants';
import { analyzePosts } from './services/geminiService';

const App: React.FC = () => {
  const [posts, setPosts] = useState<FacebookPost[]>(MOCK_POSTS);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    mediaType: 'ALL',
    sortBy: 'recent'
  });
  
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isInsightModalOpen, setIsInsightModalOpen] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Filter and Sort Logic
  const filteredAndSortedPosts = useMemo(() => {
    let result = [...posts];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p => 
        (p.content && p.content.toLowerCase().includes(q)) || 
        (p.author && p.author.name && p.author.name.toLowerCase().includes(q))
      );
    }

    if (filters.mediaType !== 'ALL') {
      result = result.filter(p => p.mediaType === filters.mediaType);
    }

    const getEngagement = (p: FacebookPost) => {
       if (!p.stats) return 0;
       return (p.stats.likes || 0) + (p.stats.comments || 0) + (p.stats.shares || 0);
    };

    const getViews = (p: FacebookPost) => p.stats?.views || 0;
    const getLikes = (p: FacebookPost) => p.stats?.likes || 0;
    const getComments = (p: FacebookPost) => p.stats?.comments || 0;

    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'views': return getViews(b) - getViews(a);
        case 'likes': return getLikes(b) - getLikes(a);
        case 'comments': return getComments(b) - getComments(a);
        case 'engagement': return getEngagement(b) - getEngagement(a);
        case 'recent':
        default: return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
      }
    });

    return result;
  }, [posts, filters]);

  const handleAiAnalyze = async () => {
    // Assumption: process.env.API_KEY is pre-configured and valid.
    
    setIsAnalyzing(true);
    try {
      const insight = await analyzePosts(filteredAndSortedPosts);
      setAiInsight(insight);
      setIsInsightModalOpen(true);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze posts.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 font-sans">
      <FilterBar 
        filters={filters} 
        setFilters={setFilters} 
        onImportClick={() => setIsImportModalOpen(true)}
        onAiAnalyzeClick={handleAiAnalyze}
        isAnalyzing={isAnalyzing}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsOverview posts={filteredAndSortedPosts} />

        {filteredAndSortedPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="bg-gray-100 rounded-full p-6 mb-4">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">No posts found</h3>
            <p className="text-gray-500 mt-2 max-w-sm">Try adjusting your filters or search terms to find what you're looking for.</p>
            <button 
              onClick={() => setFilters({search: '', mediaType: 'ALL', sortBy: 'recent'})}
              className="mt-6 px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {filteredAndSortedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>

      <ImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        onImport={setPosts} 
      />

      <InsightModal
        isOpen={isInsightModalOpen}
        onClose={() => setIsInsightModalOpen(false)}
        insight={aiInsight}
      />
    </div>
  );
};

export default App;