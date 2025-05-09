
// Database provider type definitions
export enum DatabaseType {
  SUPABASE = 'supabase',
  JSON = 'json',
  MYSQL = 'mysql',
  DEMO = 'demo',  // Added for demo mode
  NONE = 'none'
}

// Database provider interface
export interface DatabaseProvider {
  type: DatabaseType;
  name: string;
  description: string;
  icon: string;
  isConnected: boolean;
  maxFileSizeMB?: number;
}

// Available database providers
export const databaseProviders: DatabaseProvider[] = [
  {
    type: DatabaseType.SUPABASE,
    name: 'Supabase',
    description: 'PostgreSQL database with realtime capabilities',
    icon: '/icons/supabase.svg',
    isConnected: true,
    maxFileSizeMB: 50,
  },
  {
    type: DatabaseType.JSON,
    name: 'JSON',
    description: 'Local JSON file storage',
    icon: '/icons/json.svg',
    isConnected: false,
    maxFileSizeMB: 5,
  },
  {
    type: DatabaseType.MYSQL,
    name: 'MySQL',
    description: 'MySQL database',
    icon: '/icons/mysql.svg',
    isConnected: false,
    maxFileSizeMB: 25,
  },
  {
    type: DatabaseType.NONE,
    name: 'No Database',
    description: 'No database connection',
    icon: '/icons/no-database.svg',
    isConnected: false,
    maxFileSizeMB: 2,
  }
];

// Get database provider by type
export const getDatabaseProvider = (type: DatabaseType): DatabaseProvider => {
  return databaseProviders.find(provider => provider.type === type) || databaseProviders[3];
};

// Initialize database provider
export const initializeDatabaseProvider = async (forceCheck = false): Promise<DatabaseType> => {
  try {
    // Implementation placeholder - would check connection to different DBs
    // Default to Supabase since it's implemented
    return DatabaseType.SUPABASE;
  } catch (error) {
    console.error("Error initializing database provider:", error);
    return DatabaseType.DEMO;
  }
};

// Initialize the database (creating tables, etc.)
export const initializeDatabase = async (userId?: string, userEmail?: string): Promise<boolean> => {
  try {
    // This function can call the actual implementation in supabase-functions.ts
    const { initializeDatabase: initSupabaseDB } = await import('./supabase-functions');
    return await initSupabaseDB(userId, userEmail);
  } catch (error) {
    console.error("Error in database initialization:", error);
    return false;
  }
};
