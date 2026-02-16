export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  LINK = 'LINK',
  TEXT = 'TEXT',
  ALBUM = 'ALBUM'
}

export interface PostStats {
  likes: number;
  comments: number;
  shares: number;
  views: number;
}

export interface FacebookPost {
  id: string;
  author: {
    name: string;
    avatarUrl: string;
    handle: string;
  };
  content: string;
  mediaType: MediaType;
  mediaUrl?: string; // For images/videos
  thumbnailUrl?: string; // For video thumbnails or link previews
  linkUrl?: string; // For external links
  postedAt: string; // ISO Date string
  postUrl: string; // Link to the actual FB post
  usesImageExploit: boolean; // True if post uses 1px dummy image for reach
  stats: PostStats;
}

export type SortOption = 'views' | 'likes' | 'comments' | 'engagement' | 'recent';

export interface FilterState {
  search: string;
  mediaType: MediaType | 'ALL';
  sortBy: SortOption;
  dateFrom?: string;
  dateTo?: string;
}
