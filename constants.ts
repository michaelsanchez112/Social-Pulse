import { FacebookPost, MediaType } from './types';

export const MOCK_POSTS: FacebookPost[] = [
  {
    id: '1',
    author: {
      name: 'Tech Insider',
      handle: '@techinsider',
      avatarUrl: 'https://picsum.photos/seed/tech/50/50'
    },
    content: 'The new Quantum Processor has shattered all previous benchmarks. Here is a deep dive into the architecture changes.',
    mediaType: MediaType.IMAGE,
    mediaUrl: 'https://picsum.photos/seed/cpu/800/600',
    postedAt: '2023-10-25T10:00:00Z',
    postUrl: '#',
    stats: {
      likes: 1250,
      comments: 340,
      shares: 120,
      views: 45000
    }
  },
  {
    id: '2',
    author: {
      name: 'Nature Daily',
      handle: '@naturedaily',
      avatarUrl: 'https://picsum.photos/seed/nature/50/50'
    },
    content: 'Sunset over the Pacific Coast Highway. Absolutely breathtaking views this evening.',
    mediaType: MediaType.IMAGE,
    mediaUrl: 'https://picsum.photos/seed/sunset/600/800', // Portrait
    postedAt: '2023-10-24T18:30:00Z',
    postUrl: '#',
    stats: {
      likes: 8900,
      comments: 120,
      shares: 4500,
      views: 120000
    }
  },
  {
    id: '3',
    author: {
      name: 'Dev Community',
      handle: '@thepracticaldev',
      avatarUrl: 'https://picsum.photos/seed/dev/50/50'
    },
    content: 'Which JavaScript framework are you betting on for 2024? React, Vue, Svelte, or Angular? Let us know in the comments!',
    mediaType: MediaType.TEXT,
    postedAt: '2023-10-26T09:15:00Z',
    postUrl: '#',
    stats: {
      likes: 450,
      comments: 890,
      shares: 50,
      views: 15000
    }
  },
  {
    id: '4',
    author: {
      name: 'Cooking with Sarah',
      handle: '@sarahcooks',
      avatarUrl: 'https://picsum.photos/seed/cook/50/50'
    },
    content: '5-Minute Chocolate Mug Cake 🍰. Full recipe in the link below!',
    mediaType: MediaType.VIDEO,
    thumbnailUrl: 'https://picsum.photos/seed/cake/800/450',
    postedAt: '2023-10-23T14:20:00Z',
    postUrl: '#',
    stats: {
      likes: 15000,
      comments: 200,
      shares: 3000,
      views: 500000
    }
  },
  {
    id: '5',
    author: {
      name: 'Global News',
      handle: '@globalnews',
      avatarUrl: 'https://picsum.photos/seed/news/50/50'
    },
    content: 'Breaking: Major policy shift announced regarding renewable energy subsidies.',
    mediaType: MediaType.LINK,
    thumbnailUrl: 'https://picsum.photos/seed/wind/800/400',
    linkUrl: 'https://example.com/news',
    postedAt: '2023-10-26T11:00:00Z',
    postUrl: '#',
    stats: {
      likes: 800,
      comments: 1500,
      shares: 600,
      views: 95000
    }
  },
  {
    id: '6',
    author: {
      name: 'Travel Bug',
      handle: '@travelbug',
      avatarUrl: 'https://picsum.photos/seed/travel/50/50'
    },
    content: 'Kyoto in autumn is something else. The colors are unreal.',
    mediaType: MediaType.ALBUM,
    mediaUrl: 'https://picsum.photos/seed/kyoto/700/700',
    postedAt: '2023-10-20T08:00:00Z',
    postUrl: '#',
    stats: {
      likes: 3400,
      comments: 150,
      shares: 800,
      views: 67000
    }
  },
  {
    id: '7',
    author: {
      name: 'Fitness Pro',
      handle: '@fitpro',
      avatarUrl: 'https://picsum.photos/seed/gym/50/50'
    },
    content: 'Stop doing sit-ups! Do these 3 core exercises instead for better results.',
    mediaType: MediaType.VIDEO,
    thumbnailUrl: 'https://picsum.photos/seed/fitness/800/800',
    postedAt: '2023-10-25T06:30:00Z',
    postUrl: '#',
    stats: {
      likes: 1200,
      comments: 45,
      shares: 200,
      views: 25000
    }
  },
  {
    id: '8',
    author: {
      name: 'Startup Hustle',
      handle: '@startups',
      avatarUrl: 'https://picsum.photos/seed/startup/50/50'
    },
    content: 'We just closed our Series A round! Huge thanks to everyone who supported us.',
    mediaType: MediaType.IMAGE,
    mediaUrl: 'https://picsum.photos/seed/office/800/500',
    postedAt: '2023-10-26T12:00:00Z',
    postUrl: '#',
    stats: {
      likes: 5600,
      comments: 800,
      shares: 1200,
      views: 89000
    }
  },
  {
    id: '9',
    author: {
      name: 'Minimalist Design',
      handle: '@minodesign',
      avatarUrl: 'https://picsum.photos/seed/design/50/50'
    },
    content: 'Less is more.',
    mediaType: MediaType.TEXT,
    postedAt: '2023-10-21T15:45:00Z',
    postUrl: '#',
    stats: {
      likes: 23000,
      comments: 120,
      shares: 5000,
      views: 300000
    }
  },
  {
    id: '10',
    author: {
      name: 'Funny Cats',
      handle: '@meow',
      avatarUrl: 'https://picsum.photos/seed/cat/50/50'
    },
    content: 'I present to you: The King of the Jungle (gym).',
    mediaType: MediaType.IMAGE,
    mediaUrl: 'https://picsum.photos/seed/kitten/600/600',
    postedAt: '2023-10-26T13:30:00Z',
    postUrl: '#',
    stats: {
      likes: 45000,
      comments: 3000,
      shares: 12000,
      views: 1200000
    }
  },
  {
    id: '11',
    author: {
      name: 'Crypto Watch',
      handle: '@cryptowatch',
      avatarUrl: 'https://picsum.photos/seed/bitcoin/50/50'
    },
    content: 'Market analysis for the upcoming week. Bear or Bull?',
    mediaType: MediaType.LINK,
    thumbnailUrl: 'https://picsum.photos/seed/chart/800/400',
    postedAt: '2023-10-26T08:00:00Z',
    postUrl: '#',
    stats: {
      likes: 200,
      comments: 600,
      shares: 50,
      views: 5000
    }
  },
    {
    id: '12',
    author: {
      name: 'Art Gallery',
      handle: '@modernart',
      avatarUrl: 'https://picsum.photos/seed/art/50/50'
    },
    content: 'New exhibition opening this Friday. Come see the abstract wonders of local artists.',
    mediaType: MediaType.IMAGE,
    mediaUrl: 'https://picsum.photos/seed/abstract/500/800',
    postedAt: '2023-10-22T10:00:00Z',
    postUrl: '#',
    stats: {
      likes: 850,
      comments: 40,
      shares: 90,
      views: 18000
    }
  }
];
