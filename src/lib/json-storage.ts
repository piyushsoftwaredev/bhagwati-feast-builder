
// Simple JSON storage system for local data persistence
export interface ContactInfo {
  address: string;
  phone1: string;
  phone2?: string;
  email1: string;
  email2?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  featured: boolean;
  featured_image?: string;
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface HomepageSection {
  id: string;
  name: string;
  visible: boolean;
  order: number;
  component: string;
}

export interface SiteConfig {
  contact_info: ContactInfo;
  homepage_sections: HomepageSection[];
  site_name: string;
  site_description: string;
}

// Default data
const defaultContactInfo: ContactInfo = {
  address: '123 Catering Street, Foodie District, Mumbai, Maharashtra 400001',
  phone1: '+91 98765 43210',
  phone2: '+91 91234 56780',
  email1: 'info@shreebhagwaticaterers.com',
  email2: 'bookings@shreebhagwaticaterers.com'
};

const defaultHomepageSections: HomepageSection[] = [
  { id: 'hero', name: 'Hero Banner', visible: true, order: 0, component: 'Hero' },
  { id: 'services', name: 'Our Services', visible: true, order: 1, component: 'Services' },
  { id: 'menu', name: 'Featured Menu', visible: true, order: 2, component: 'Menu' },
  { id: 'gallery', name: 'Photo Gallery', visible: true, order: 3, component: 'Gallery' },
  { id: 'recent-posts', name: 'Recent Posts', visible: true, order: 4, component: 'RecentPosts' },
  { id: 'about', name: 'About Us', visible: true, order: 5, component: 'About' },
  { id: 'contact', name: 'Contact Information', visible: true, order: 6, component: 'Contact' }
];

const defaultPosts: Post[] = [
  {
    id: 'post-1',
    title: 'Welcome to Shree Bhagwati Caterers',
    content: 'We are delighted to serve you with our premium vegetarian catering services. Our team of experienced chefs prepares authentic Indian cuisine with the finest ingredients.',
    published: true,
    featured: true,
    featured_image: '/lovable-uploads/5d5c7034-12e6-444d-bee5-9e030e2d821b.png',
    author_id: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'post-2',
    title: 'Our Catering Services',
    content: 'From weddings to corporate events, we provide comprehensive catering solutions tailored to your needs.',
    published: true,
    featured: false,
    author_id: 'admin',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  }
];

// Storage functions
export const getStorageData = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setStorageData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Specific data functions
export const getContactInfo = (): ContactInfo => {
  return getStorageData('contact_info', defaultContactInfo);
};

export const setContactInfo = (info: ContactInfo): void => {
  setStorageData('contact_info', info);
};

export const getHomepageSections = (): HomepageSection[] => {
  return getStorageData('homepage_sections', defaultHomepageSections);
};

export const setHomepageSections = (sections: HomepageSection[]): void => {
  setStorageData('homepage_sections', sections);
};

export const getPosts = (): Post[] => {
  return getStorageData('posts', defaultPosts);
};

export const setPosts = (posts: Post[]): void => {
  setStorageData('posts', posts);
};

export const addPost = (post: Omit<Post, 'id' | 'created_at' | 'updated_at'>): Post => {
  const posts = getPosts();
  const newPost: Post = {
    ...post,
    id: `post-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  posts.unshift(newPost);
  setPosts(posts);
  return newPost;
};

export const updatePost = (id: string, updates: Partial<Post>): Post | null => {
  const posts = getPosts();
  const index = posts.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  posts[index] = {
    ...posts[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  setPosts(posts);
  return posts[index];
};

export const deletePost = (id: string): boolean => {
  const posts = getPosts();
  const filtered = posts.filter(p => p.id !== id);
  if (filtered.length === posts.length) return false;
  
  setPosts(filtered);
  return true;
};

export const getPublishedPosts = (): Post[] => {
  return getPosts().filter(post => post.published);
};

export const getFeaturedPosts = (): Post[] => {
  return getPosts().filter(post => post.published && post.featured);
};
