import { supabase, isSupabaseConfigured } from './supabase';
import * as supabaseFunctions from './supabase-functions';
import { isMySqlConfigured } from './mysql-config';
import * as mysqlFunctions from './mysql-functions';
import { cache } from './cache-service';

// Enum for database types
export enum DatabaseType {
  SUPABASE = 'supabase',
  MYSQL = 'mysql',
  DEMO = 'demo'
}

// Database configuration state
let currentDatabase: DatabaseType = DatabaseType.DEMO;

// Check and set available database
export const initializeDatabaseProvider = async (forceReinitialize = false) => {
  // Clear cache if forcing reinitialization
  if (forceReinitialize) {
    cache.clear();
    console.log('Cleared database cache for reinitialization');
  }

  // Try MySQL first (if we're running locally)
  try {
    console.log('Attempting to connect to MySQL...');
    const mysqlConnected = await isMySqlConfigured();
    if (mysqlConnected) {
      currentDatabase = DatabaseType.MYSQL;
      console.log('Successfully connected to MySQL database');
      return DatabaseType.MYSQL;
    }
  } catch (err) {
    console.error('MySQL connection error:', err);
  }
  
  // Fall back to Supabase
  try {
    console.log('Attempting to connect to Supabase...');
    const supabaseConnected = await isSupabaseConfigured();
    if (supabaseConnected) {
      currentDatabase = DatabaseType.SUPABASE;
      console.log('Successfully connected to Supabase database');
      return DatabaseType.SUPABASE;
    }
  } catch (err) {
    console.error('Supabase connection error:', err);
  }
  
  // If neither is available, use demo mode
  console.log('No database connected, using demo mode');
  currentDatabase = DatabaseType.DEMO;
  return DatabaseType.DEMO;
};

// Get current database type
export const getCurrentDatabase = () => {
  return currentDatabase;
};

// Initialize the database (create tables, etc.)
export const initializeDatabase = async (userId?: string, userEmail?: string) => {
  console.log(`Initializing database (${currentDatabase}) for user:`, userId, userEmail);
  
  try {
    if (currentDatabase === DatabaseType.MYSQL) {
      return await mysqlFunctions.initializeDatabase(userId, userEmail);
    } else if (currentDatabase === DatabaseType.SUPABASE) {
      return await supabaseFunctions.initializeDatabase(userId, userEmail);
    }
    
    // Demo mode doesn't need initialization
    return true;
  } catch (error) {
    console.error('Error during database initialization:', error);
    // Return true anyway to allow the app to continue in a degraded state
    return true;
  }
};

// Execute custom SQL
export const executeCustomSQL = async (sql: string, params?: any[]) => {
  if (currentDatabase === DatabaseType.MYSQL) {
    return mysqlFunctions.executeCustomSQL(sql, params);
  } else if (currentDatabase === DatabaseType.SUPABASE) {
    return supabaseFunctions.executeCustomSQL(sql, params);
  }
  
  return { data: null, error: new Error('Demo mode does not support custom SQL') };
};

// Generic data operations that work with either database
export const db = {
  // Insert data into a table
  insert: async (tableName: string, data: any) => {
    try {
      if (currentDatabase === DatabaseType.MYSQL) {
        return mysqlFunctions.insertData(tableName, data);
      } else if (currentDatabase === DatabaseType.SUPABASE) {
        return supabase.from(tableName).insert(data).select().single();
      }
      
      // In demo mode, just return the data with a fake ID
      return { data: { ...data, id: `demo-${Date.now()}` }, error: null };
    } catch (error) {
      console.error(`Error inserting data into ${tableName}:`, error);
      return { data: null, error };
    }
  },
  
  // Update data in a table
  update: async (tableName: string, id: string, data: any) => {
    try {
      if (currentDatabase === DatabaseType.MYSQL) {
        return mysqlFunctions.updateData(tableName, id, data);
      } else if (currentDatabase === DatabaseType.SUPABASE) {
        return supabase.from(tableName).update(data).eq('id', id).select().single();
      }
      
      // In demo mode, just return the data
      return { data: { ...data, id }, error: null };
    } catch (error) {
      console.error(`Error updating data in ${tableName}:`, error);
      return { data: null, error };
    }
  },
  
  // Select data from a table with error handling
  select: async (tableName: string, options: any = {}) => {
    try {
      if (currentDatabase === DatabaseType.MYSQL) {
        return mysqlFunctions.selectData(tableName, options);
      } else if (currentDatabase === DatabaseType.SUPABASE) {
        let query = supabase.from(tableName).select(options.columns?.join(', ') || '*');
        
        // Apply filters if provided
        if (options.where) {
          Object.entries(options.where).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }
        
        // Apply order if provided
        if (options.orderBy) {
          query = query.order(options.orderBy.column, {
            ascending: options.orderBy.direction === 'ASC'
          });
        }
        
        // Apply pagination if provided
        if (options.limit !== undefined) {
          query = query.limit(options.limit);
          
          if (options.offset !== undefined) {
            query = query.range(options.offset, options.offset + options.limit - 1);
          }
        }
        
        return query;
      }
      
      // In demo mode, return demo data
      return { data: [], error: null };
    } catch (error) {
      console.error(`Error selecting data from ${tableName}:`, error);
      return { data: [], error };
    }
  },
  
  // Delete data from a table
  delete: async (tableName: string, id: string) => {
    try {
      if (currentDatabase === DatabaseType.MYSQL) {
        return mysqlFunctions.deleteData(tableName, id);
      } else if (currentDatabase === DatabaseType.SUPABASE) {
        return supabase.from(tableName).delete().eq('id', id);
      }
      
      // In demo mode, just return success
      return { data: { id }, error: null };
    } catch (error) {
      console.error(`Error deleting data from ${tableName}:`, error);
      return { data: null, error };
    }
  }
};