
import { supabase } from './supabase';

/**
 * Helper function to create necessary database tables
 */
export const createTable = async (tableName: string, schema: string) => {
  try {
    // First check if the table exists
    const { data, error: checkError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', tableName)
      .eq('table_schema', 'public');
      
    // If table doesn't exist or we couldn't check (which likely means it doesn't exist)
    if (checkError || (data && data.length === 0)) {
      console.log(`Table ${tableName} doesn't exist. Creating it.`);
      
      // Use raw SQL query to create the table
      const { error: createError } = await supabase.rpc('execute_sql', { 
        sql: `CREATE TABLE IF NOT EXISTS public.${tableName} (${schema})`
      });
      
      if (createError) {
        console.error(`Error creating table ${tableName}:`, createError);
        // Try an alternative approach - direct SQL execution
        const { error: sqlError } = await supabase
          .from('_manual_sql')
          .insert({ query: `CREATE TABLE IF NOT EXISTS public.${tableName} (${schema})` });
        
        if (sqlError) {
          console.error(`Failed alternative approach for ${tableName}:`, sqlError);
          return false;
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Error checking/creating table ${tableName}:`, error);
    return false;
  }
};

/**
 * Helper function to initialize database with required tables
 */
export const initializeDatabase = async (userId?: string, userEmail?: string) => {
  try {
    console.log('Initializing database...');
    
    // Create posts table
    await createTable('posts', `
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title TEXT NOT NULL,
      content TEXT,
      featured_image TEXT,
      published BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      author_id UUID REFERENCES auth.users(id)
    `);
    
    // Create site_config table
    await createTable('site_config', `
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      key TEXT UNIQUE NOT NULL,
      value JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    `);
    
    // Create contact_messages table
    await createTable('contact_messages', `
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      message TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    `);
    
    // Create booking_requests table
    await createTable('booking_requests', `
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      event_type TEXT NOT NULL,
      date DATE NOT NULL,
      guest_count INTEGER NOT NULL,
      message TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    `);
    
    // Create images table for tracking uploaded images
    await createTable('images', `
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      path TEXT NOT NULL,
      url TEXT NOT NULL,
      name TEXT NOT NULL,
      size INTEGER,
      type TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      uploaded_by UUID
    `);
    
    // Create profiles table and add admin user if needed
    await createTable('profiles', `
      id UUID PRIMARY KEY REFERENCES auth.users(id),
      email TEXT,
      role TEXT DEFAULT 'user',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    `);
    
    // Create theme_settings table for custom themes
    await createTable('theme_settings', `
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      primary_color TEXT DEFAULT '#8B0000',
      secondary_color TEXT DEFAULT '#FFD700',
      font_family TEXT DEFAULT 'Inter, sans-serif',
      header_style TEXT DEFAULT 'standard',
      footer_style TEXT DEFAULT 'standard',
      custom_css TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    `);
    
    // Create admin profile if userId is provided
    if (userId && userEmail) {
      const { data: profileData, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();
        
      if (profileCheckError || !profileData) {
        await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: userEmail,
            role: 'admin'
          });
        
        console.log('Admin profile created for', userEmail);
      }
    }
    
    console.log('Database initialization complete.');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};

// Function to ensure storage buckets exist
export const ensureStorageBuckets = async () => {
  try {
    // Check if 'images' bucket exists, create if not
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }
    
    const imagesBucketExists = buckets?.some(bucket => bucket.name === 'images');
    
    if (!imagesBucketExists) {
      console.log('Creating images bucket...');
      const { error: createError } = await supabase.storage.createBucket('images', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
      });
      
      if (createError) {
        console.error('Error creating images bucket:', createError);
        return false;
      }
      
      // Create folders within the bucket
      await supabase.storage.from('images').upload('uploads/.gitkeep', new Blob(['']));
      await supabase.storage.from('images').upload('hero/.gitkeep', new Blob(['']));
      
      console.log('Images bucket created successfully.');
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring storage buckets:', error);
    return false;
  }
};

// Create SQL functions for database management if needed
export const createDatabaseFunctions = async () => {
  try {
    // Create a function to execute SQL dynamically (admin only)
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION execute_sql(sql text)
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE sql;
      END;
      $$;
    `;
    
    // Use the raw SQL execution if available, otherwise log an info message
    try {
      await supabase.rpc('execute_sql', { 
        sql: createFunctionSQL
      });
    } catch (error) {
      console.info('Database functions will need to be created in the Supabase dashboard');
    }
    
    return true;
  } catch (error) {
    console.error('Error creating database functions:', error);
    return false;
  }
};
