import { FacebookPost } from './types';
import facebookData from './data/facebook-posts.json';

export const FACEBOOK_POSTS: FacebookPost[] = facebookData as FacebookPost[];

// Backwards-compatible alias
export const MOCK_POSTS = FACEBOOK_POSTS;
