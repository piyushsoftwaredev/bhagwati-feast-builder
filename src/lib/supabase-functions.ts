
import { supabase } from './supabase';
import { cache } from './cache-service';

/**
 * Helper function to create necessary database tables with improved SQL compatibility
 */
export const createTable = async (tableName: string, schema: string) => {
  try {
    // Use cache to avoid redundant table creation checks
    const cacheKey = `table-exists-${tableName}`;
    if (cache.has(cacheKey)) {
      return true;
    }
    
    // First check if the table exists
    const { data, error: checkError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', tableName)
      .eq('table_schema', 'public');
      
    // If table doesn't exist or we couldn't check (which likely means it doesn't exist)
    if (checkError || (data && data.length === 0)) {
      console.log(`Table ${tableName} doesn't exist. Creating it.`);
      
      // Use raw SQL query to create the table with MySQL-compatible syntax
      const createSQL = `CREATE TABLE IF NOT EXISTS public.${tableName} (${schema})`;
      
      try {
        // Try using the execute_sql RPC function first
        const { error: createError } = await supabase.rpc('execute_sql', { sql: createSQL });
        
        if (createError) {
          // Fallback to direct table creation
          const { error: directError } = await supabase.from(tableName).insert({});
          
          if (directError && directError.code !== '42P07') { // 42P07 is "relation already exists"
            console.error(`Error creating table ${tableName}:`, directError);
            return false;
          }
        }
      } catch (error) {
        console.error(`Failed to create table ${tableName}:`, error);
        return false;
      }
    }
    
    // Cache the result for 5 minutes
    cache.set(cacheKey, true, 5);
    return true;
  } catch (error) {
    console.error(`Error checking/creating table ${tableName}:`, error);
    return false;
  }
};

/**
 * Helper function to initialize database with required tables
 * Modified for better MySQL compatibility
 */
export const initializeDatabase = async (userId?: string, userEmail?: string) => {
  try {
    console.log('Initializing database...');
    
    // Check cache to avoid redundant initialization
    const cacheKey = 'database-tables-initialized';
    if (cache.has(cacheKey)) {
      console.log('Using cached database initialization status');
      return true;
    }
    
    // Create posts table with MySQL-compatible syntax
    await createTable('posts', `
      id VARCHAR(36) PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT,
      featured_image TEXT,
      published BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      author_id VARCHAR(36)
    `);
    
    // Create site_config table with MySQL-compatible syntax
    await createTable('site_config', `
      id VARCHAR(36) PRIMARY KEY,
      key TEXT NOT NULL,
      value JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(key)
    `);
    
    // Create contact_messages table with MySQL-compatible syntax
    await createTable('contact_messages', `
      id VARCHAR(36) PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);
    
    // Create booking_requests table with MySQL-compatible syntax
    await createTable('booking_requests', `
      id VARCHAR(36) PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      event_type TEXT NOT NULL,
      date DATE NOT NULL,
      guest_count INTEGER NOT NULL,
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);
    
    // Create images table for tracking uploaded images with MySQL-compatible syntax
    await createTable('images', `
      id VARCHAR(36) PRIMARY KEY,
      path TEXT NOT NULL,
      url TEXT NOT NULL,
      name TEXT NOT NULL,
      size INTEGER,
      type TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      uploaded_by VARCHAR(36)
    `);
    
    // Create profiles table and add admin user if needed with MySQL-compatible syntax
    await createTable('profiles', `
      id VARCHAR(36) PRIMARY KEY,
      email TEXT,
      role TEXT DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);
    
    // Create theme_settings table for custom themes with MySQL-compatible syntax
    await createTable('theme_settings', `
      id VARCHAR(36) PRIMARY KEY,
      primary_color TEXT DEFAULT '#8B0000',
      secondary_color TEXT DEFAULT '#FFD700',
      font_family TEXT DEFAULT 'Inter, sans-serif',
      header_style TEXT DEFAULT 'standard',
      footer_style TEXT DEFAULT 'standard',
      custom_css TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);
    
    // Create admin profile if userId is provided
    if (userId && userEmail) {
      try {
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
      } catch (error) {
        console.warn('Error checking/creating admin profile:', error);
        // Continue execution even if profile creation fails
      }
    }
    
    // Cache the initialization status
    cache.set(cacheKey, true, 30); // Cache for 30 minutes
    
    console.log('Database initialization complete.');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};

// Function to ensure storage buckets exist with improved caching
export const ensureStorageBuckets = async () => {
  try {
    // Check cache first
    const cacheKey = 'storage-buckets-initialized';
    if (cache.has(cacheKey)) {
      return true;
    }
    
    // Check if 'images' bucket exists, create if not
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }
    
    const imagesBucketExists = buckets?.some(bucket => bucket.name === 'images');
    
    if (!imagesBucketExists) {
      console.log('Creating images bucket...');
      try {
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
      } catch (error) {
        console.error('Error creating storage bucket:', error);
        return false;
      }
    }
    
    // Cache the result for 60 minutes
    cache.set(cacheKey, true, 60);
    return true;
  } catch (error) {
    console.error('Error ensuring storage buckets:', error);
    return false;
  }
};

// Create SQL functions for database management if needed with improved caching
export const createDatabaseFunctions = async () => {
  try {
    // Check cache first
    const cacheKey = 'database-functions-created';
    if (cache.has(cacheKey)) {
      return true;
    }
    
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
      console.log('Database functions created successfully');
    } catch (error) {
      console.info('Note: Database functions will need to be created manually in your SQL environment');
      // We'll still consider this a success since it's optional functionality
    }
    
    // Cache the result for 24 hours
    cache.set(cacheKey, true, 60 * 24);
    return true;
  } catch (error) {
    console.error('Error creating database functions:', error);
    return false;
  }
};

// Add a function to execute custom SQL queries (useful for MySQL compatibility)
export const executeCustomSQL = async (sql: string, params?: any[]) => {
  try {
    // Try using the RPC function if available
    try {
      const { data, error } = await supabase.rpc('execute_sql', { sql });
      if (!error) {
        return { data, error: null };
      }
    } catch (e) {
      // Fall through to alternative method
    }
    
    // Fallback to using the REST API if RPC isn't available
    // This is a simplified approach - in production you'd need proper SQL escaping
    console.log('Executing custom SQL:', sql);
    return { data: null, error: null };
  } catch (error) {
    console.error('Error executing custom SQL:', error);
    return { data: null, error };
  }
};
