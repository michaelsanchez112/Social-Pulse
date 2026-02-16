import React from 'react';
import { FilterState, MediaType, SortOption } from '../types';
import { Search, ArrowUpDown, Sparkles, Upload, Calendar, BarChart3 } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onImportClick: () => void;
  onAiAnalyzeClick: () => void;
  isAnalyzing: boolean;
  onAnalyticsClick: () => void;
  activeView: 'feed' | 'analytics';
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  onImportClick,
  onAiAnalyzeClick,
  isAnalyzing,
  onAnalyticsClick,
  activeView
}) => {
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, sortBy: e.target.value as SortOption }));
  };

  const handleMediaTypeChange = (type: MediaType | 'ALL') => {
    setFilters(prev => ({ ...prev, mediaType: type }));
  };

  return (
    <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand & Import */}
        <div className="flex items-center shrink-0 gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 rounded-lg w-8 h-8 flex items-center justify-center shadow-blue-200 shadow-lg">
              <span className="text-white font-bold text-lg tracking-tighter">SP</span>
            </div>
            <h1 className="text-lg font-bold text-gray-800 hidden md:block">SocialPulse</h1>
          </div>
          <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>
          <button 
            onClick={onImportClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-semibold rounded-md transition-colors border border-gray-200"
          >
            <Upload size={14} />
            <span>Import JSON</span>
          </button>
        </div>

        {/* Center: Tabs */}
        <div className={`${activeView === 'analytics' ? 'hidden' : 'hidden md:flex'} items-center bg-gray-100/80 p-1 rounded-lg overflow-x-auto`}>
          {(['ALL', ...Object.values(MediaType)] as const).map((type) => (
            <button
              key={type}
              onClick={() => handleMediaTypeChange(type)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                filters.mediaType === type 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
            >
              {type === 'ALL' ? 'All Posts' : type.charAt(0) + type.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Date Range Filter */}
        <div className={`${activeView === 'analytics' ? 'hidden' : 'hidden lg:flex'} items-center gap-2 text-gray-500`}>
          <Calendar size={14} className="text-gray-400 shrink-0" />
          <input
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
            className="bg-gray-50 border border-transparent hover:bg-gray-100 focus:border-blue-100 focus:bg-white rounded-md text-xs px-2 py-1 outline-none transition-all"
            title="From date"
          />
          <span className="text-xs text-gray-400">to</span>
          <input
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
            className="bg-gray-50 border border-transparent hover:bg-gray-100 focus:border-blue-100 focus:bg-white rounded-md text-xs px-2 py-1 outline-none transition-all"
            title="To date"
          />
        </div>

        {/* Right: Search, Sort, AI */}
        <div className="flex items-center gap-3 shrink-0">
          <div className={`relative ${activeView === 'analytics' ? 'hidden' : 'hidden lg:block'} group`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search content..." 
              value={filters.search}
              onChange={(e) => setFilters(prev => ({...prev, search: e.target.value}))}
              className="pl-9 pr-4 py-1.5 bg-gray-50 border border-transparent focus:border-blue-100 hover:bg-gray-100 focus:bg-white rounded-full text-sm w-48 transition-all outline-none"
            />
          </div>

          <div className={`${activeView === 'analytics' ? 'hidden' : 'flex'} items-center gap-1 text-gray-500 text-sm font-medium pl-2 border-l border-gray-200`}>
            <ArrowUpDown size={14} />
            <select 
              value={filters.sortBy}
              onChange={handleSortChange}
              className="bg-transparent py-1 pr-6 pl-1 focus:outline-none cursor-pointer hover:text-gray-800"
            >
              <option value="recent">Most Recent</option>
              <option value="views">Most Views</option>
              <option value="likes">Most Likes</option>
              <option value="engagement">Engagement</option>
            </select>
          </div>

          <button
            onClick={onAiAnalyzeClick}
            disabled={isAnalyzing}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all ${
              isAnalyzing 
                ? 'bg-indigo-400 cursor-wait' 
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 hover:-translate-y-0.5'
            }`}
          >
            <Sparkles size={14} className={isAnalyzing ? "animate-spin" : ""} />
            <span className="hidden sm:inline">{isAnalyzing ? 'Thinking...' : 'AI Insights'}</span>
          </button>

          <button
            onClick={onAnalyticsClick}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              activeView === 'analytics'
                ? 'bg-gray-900 text-white shadow-lg shadow-gray-300'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200 hover:from-emerald-600 hover:to-teal-700 hover:-translate-y-0.5'
            }`}
          >
            <BarChart3 size={14} />
            <span className="hidden sm:inline">{activeView === 'analytics' ? 'Feed' : 'Analytics'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;