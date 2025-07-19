
// Static data types for the application
export type ImageAsset = {
  id: string;
  path: string;
  url: string;
  name: string;
  size: number;
  type: string;
  created_at: string;
  uploaded_by: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  published: boolean;
  featured: boolean;
  featured_image?: string;
  author_id: string;
  created_at: string;
  updated_at: string;
};

export type Page = {
  id: string;
  title: string;
  content: string;
  slug: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type ThemeSettings = {
  id?: string;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  header_style: string;
  footer_style: string;
  custom_css?: string;
  created_at?: string;
  updated_at?: string;
};

// Static demo data
export const demoData = {
  posts: [
    {
      id: 'demo-1',
      title: 'Welcome to Shree Bhagwati Caterers',
      content: 'This is a sample post to demonstrate the post management functionality.',
      published: true,
      featured: false,
      featured_image: '/lovable-uploads/5d5c7034-12e6-444d-bee5-9e030e2d821b.png',
      author_id: 'demo-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'demo-2',
      title: 'Our Catering Services',
      content: 'Explore our wide range of vegetarian catering services for all occasions.',
      published: false,
      featured: false,
      author_id: 'demo-user',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
    }
  ],
  pages: [
    {
      id: 'demo-1',
      title: 'About Us',
      content: 'This is the about us page content.',
      slug: 'about-us',
      published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'demo-2',
      title: 'Contact Us',
      content: 'This is the contact us page content.',
      slug: 'contact-us',
      published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ]
};

// Mock functions for static site
export const uploadImage = async (file: File, folder: string = 'uploads') => {
  // Simulate upload for demo
  const timestamp = Date.now();
  const finalFileName = `${file.name}-${timestamp}`;
  
  return {
    path: `${folder}/${finalFileName}`,
    url: URL.createObjectURL(file), // Create local object URL for preview
    name: finalFileName,
    size: file.size,
    type: file.type,
  };
};

export const deleteImage = async (path: string) => {
  // Simulate delete for demo
  return true;
};

export const getThemeSettings = async (): Promise<ThemeSettings> => {
  return {
    primary_color: '#8B0000',
    secondary_color: '#FFD700',
    font_family: 'Inter, sans-serif',
    header_style: 'standard',
    footer_style: 'standard',
    custom_css: ''
  };
};

export const saveThemeSettings = async (settings: ThemeSettings): Promise<boolean> => {
  // Simulate save for demo
  console.log('Theme settings saved:', settings);
  return true;
};
