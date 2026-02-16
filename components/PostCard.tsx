import React from 'react';
import { FacebookPost, MediaType } from '../types';
import { Heart, MessageCircle, Share2, PlayCircle, ExternalLink, FileText } from 'lucide-react';

interface PostCardProps {
  post: FacebookPost;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
};

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  // Destructure with default values for safety
  const { 
    author, 
    content, 
    mediaType, 
    mediaUrl, 
    thumbnailUrl, 
    stats = { likes: 0, comments: 0, shares: 0, views: 0 }, 
    postedAt 
  } = post;

  const renderMedia = () => {
    switch (mediaType) {
      case MediaType.IMAGE:
      case MediaType.ALBUM:
        return (
          <div className="w-full bg-gray-100 overflow-hidden">
            <img 
              src={mediaUrl} 
              alt="Post content" 
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
          </div>
        );
      case MediaType.VIDEO:
        return (
          <div className="relative w-full aspect-video bg-gray-900 group overflow-hidden">
            <img 
              src={thumbnailUrl || mediaUrl} 
              alt="Video thumbnail" 
              className="w-full h-full object-cover opacity-90 group-hover:opacity-75 transition-opacity duration-300" 
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
                <PlayCircle className="w-8 h-8 text-white fill-current" />
              </div>
            </div>
          </div>
        );
      case MediaType.LINK:
        return (
          <div className="bg-gray-50 border-y border-gray-100 group-hover:bg-gray-100 transition-colors">
            {thumbnailUrl && (
              <img src={thumbnailUrl} alt="Link preview" className="w-full h-40 object-cover" />
            )}
            <div className="p-3 flex items-center text-xs text-gray-500">
              <ExternalLink className="w-3 h-3 mr-2" />
              <span className="truncate flex-1">{post.linkUrl ? new URL(post.linkUrl).hostname : 'example.com'}</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-300 transition-all duration-300 break-inside-avoid mb-4 cursor-pointer"
      onClick={() => post.postUrl && window.open(post.postUrl, '_blank', 'noopener,noreferrer')}
    >
      
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 overflow-hidden">
          <img src={author?.avatarUrl} alt={author?.name} className="w-8 h-8 rounded-full bg-gray-100" />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 truncate">{author?.name || 'Unknown Author'}</h3>
            <p className="text-[10px] text-gray-400 truncate">{postedAt ? new Date(postedAt).toLocaleDateString() : ''}</p>
          </div>
        </div>
        <div className="text-gray-300">
          {mediaType === MediaType.TEXT && <FileText size={14} />}
        </div>
      </div>

      {/* Content */}
      <div className={`px-4 ${mediaType === MediaType.TEXT ? 'py-2 pb-6' : 'pb-3'}`}>
        <p className={`text-gray-700 text-sm whitespace-pre-wrap leading-relaxed ${mediaType === MediaType.TEXT ? 'text-lg font-medium' : ''}`}>
          {content}
        </p>
      </div>

      {/* Media */}
      {renderMedia()}

      {/* Stats */}
      <div className="px-4 py-3 flex items-center justify-between text-xs text-gray-500 border-t border-gray-50 bg-gray-50/50">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 hover:text-red-500 transition-colors">
            <Heart className="w-3.5 h-3.5" />
            <span className="font-medium">{formatNumber(stats.likes)}</span>
          </div>
          <div className="flex items-center space-x-1.5 hover:text-blue-500 transition-colors">
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="font-medium">{formatNumber(stats.comments)}</span>
          </div>
          <div className="flex items-center space-x-1.5 hover:text-green-500 transition-colors">
            <Share2 className="w-3.5 h-3.5" />
            <span className="font-medium">{formatNumber(stats.shares)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;