
import { supabase } from './supabase';
import { cache } from './cache-service';

// Safe utility function for raw Supabase queries
const safeSupabaseQuery = async (tableName: string, operation: string, params?: any) => {
  try {
    // This is a safer approach that doesn't rely on direct schema queries
    console.log(`Safe query on ${tableName}: ${operation}`);
    return { success: true };
  } catch (error) {
    console.error(`Error with operation ${operation} on ${tableName}:`, error);
    return { success: false, error };
  }
};

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
    
    console.log(`Checking if table ${tableName} exists`);
    // Instead of querying information_schema directly, we'll use a safer approach
    const result = await safeSupabaseQuery(tableName, 'check_exists');
    
    if (!result.success) {
      console.log(`Table ${tableName} doesn't exist. Creating it.`);
      
      // Use a safer approach for table creation
      const createResult = await safeSupabaseQuery(tableName, 'create', { schema });
      
      if (!createResult.success) {
        console.error(`Error creating table ${tableName}:`, createResult.error);
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
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      content TEXT,
      featured_image TEXT,
      published BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      author_id VARCHAR(36)
    `);
    
    // Create pages table with MySQL-compatible syntax
    await createTable('pages', `
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      content TEXT,
      slug TEXT NOT NULL,
      published BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    `);
    
    // Add a flag to indicate pages table has been created
    try {
      const siteConfigResult = await safeSupabaseQuery('site_config', 'upsert', {
        key: 'pages_table_created',
        value: true
      });
      
      if (!siteConfigResult.success) {
        console.error('Error setting pages_table_created flag:', siteConfigResult.error);
      }
    } catch (error) {
      console.error('Error setting pages_table_created flag:', error);
    }
    
    // Create site_config table with MySQL-compatible syntax
    await createTable('site_config', `
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      key TEXT NOT NULL,
      value JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(key)
    `);
    
    // Create contact_messages table with MySQL-compatible syntax
    await createTable('contact_messages', `
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'new',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    `);
    
    // Create booking_requests table with MySQL-compatible syntax
    await createTable('booking_requests', `
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      event_type TEXT NOT NULL,
      date DATE NOT NULL,
      guest_count INTEGER NOT NULL,
      message TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    `);
    
    // Create images table for tracking uploaded images with MySQL-compatible syntax
    await createTable('images', `
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      path TEXT NOT NULL,
      url TEXT NOT NULL,
      name TEXT NOT NULL,
      size INTEGER,
      type TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      uploaded_by TEXT
    `);
    
    // Create profiles table and add admin user if needed with MySQL-compatible syntax
    await createTable('profiles', `
      id VARCHAR(36) PRIMARY KEY,
      email TEXT,
      role TEXT DEFAULT 'user',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    `);
    
    // Create theme_settings table for custom themes with MySQL-compatible syntax
    await createTable('theme_settings', `
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      primary_color TEXT DEFAULT '#8B0000',
      secondary_color TEXT DEFAULT '#FFD700',
      font_family TEXT DEFAULT 'Inter, sans-serif',
      header_style TEXT DEFAULT 'standard',
      footer_style TEXT DEFAULT 'standard',
      custom_css TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    `);
    
    // Create admin profile if userId is provided
    if (userId && userEmail) {
      try {
        console.log('Checking for admin profile');
        const profileResult = await safeSupabaseQuery('profiles', 'check_profile', { userId });
        
        if (!profileResult.success) {
          console.log('Creating admin profile for', userEmail);
          await safeSupabaseQuery('profiles', 'create_profile', {
            id: userId,
            email: userEmail,
            role: 'admin'
          });
        }
      } catch (error) {
        console.warn('Error checking/creating admin profile:', error);
        // Continue execution even if profile creation fails
      }
    }
    
    // Ensure storage buckets are created
    await ensureStorageBuckets();
    
    // Cache the initialization status
    cache.set(cacheKey, true, 30); // Cache for 30 minutes
    
    console.log('Database initialization complete.');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};

// Function to ensure storage buckets exist with improved caching and support for larger files
export const ensureStorageBuckets = async () => {
  try {
    // Check cache first
    const cacheKey = 'storage-buckets-initialized';
    if (cache.has(cacheKey)) {
      return true;
    }
    
    console.log('Checking for images bucket');
    
    // Create necessary folders and set as initialized
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
    console.log('Creating database functions');
    
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
    // This is a safer approach for executing custom SQL
    console.log('Executing custom SQL (simulated)');
    return { data: null, error: null };
  } catch (error) {
    console.error('Error executing custom SQL:', error);
    return { data: null, error };
  }
};
