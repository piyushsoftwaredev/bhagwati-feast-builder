
import { supabase } from './supabase';

/**
 * Helper function to create necessary database tables
 * This is an alternative to using direct SQL queries which aren't supported
 * by the Supabase JS client
 */
export const createTable = async (tableName: string, schema: string) => {
  try {
    // First check if the table exists
    const { error: checkError } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
      
    // If table doesn't exist, create it using our custom approach
    if (checkError && checkError.code === 'PGRST116') {
      console.log(`Table ${tableName} doesn't exist. Creating it.`);
      
      // In production, you would use Edge Functions or the Supabase dashboard
      // For now, we'll try a simplified approach using RPC if available
      const { error: createError } = await supabase.rpc('create_table', { 
        table_name: tableName,
        table_schema: schema
      });
      
      if (createError) {
        console.error(`Error creating table ${tableName}:`, createError);
        // For development purposes, display a helpful message
        console.log('Please create the tables manually in the Supabase dashboard');
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
    
    // Create profiles table and add admin user if needed
    await createTable('profiles', `
      id UUID PRIMARY KEY REFERENCES auth.users(id),
      email TEXT,
      role TEXT DEFAULT 'user',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    `);
    
    // Create admin profile if userId is provided
    if (userId && userEmail) {
      const { error: profileCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();
        
      if (profileCheckError) {
        await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: userEmail,
            role: 'admin'
          });
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};
