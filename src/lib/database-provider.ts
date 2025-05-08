
import { supabase } from './supabase';
import mysql from 'mysql2/promise';

export enum DatabaseType {
  MYSQL = 'mysql',
  DEMO = 'demo',
}

// Store database connection info
let databaseType: DatabaseType | null = null;
let mysqlPool: mysql.Pool | null = null;

/**
 * Initialize the database provider by checking available connections
 * @param force Force reinitialization even if already initialized
 */
export const initializeDatabaseProvider = async (force = false): Promise<DatabaseType> => {
  // Return cached database type if available and not forcing reinitialization
  if (databaseType !== null && !force) {
    return databaseType;
  }

  console.log('Initializing database provider...');
  
  try {
    // Try MySQL connection first
    const mysqlConfig = {
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'bhagwati_feast',
      password: process.env.MYSQL_PASSWORD || 'bhagwati_feast',
      database: process.env.MYSQL_DATABASE || 'bhagwati_feast',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };

    console.log('Attempting MySQL connection...');
    
    // Close existing pool if it exists
    if (mysqlPool) {
      await mysqlPool.end();
      mysqlPool = null;
    }
    
    try {
      // Create a new connection pool
      mysqlPool = mysql.createPool(mysqlConfig);
      
      // Test the connection
      const [rows] = await mysqlPool.query('SELECT 1');
      console.log('MySQL connection successful', rows);
      
      databaseType = DatabaseType.MYSQL;
      return DatabaseType.MYSQL;
    } catch (error) {
      console.warn('MySQL connection failed:', error);
      
      // Fall back to demo mode
      console.log('Falling back to demo mode');
      databaseType = DatabaseType.DEMO;
      return DatabaseType.DEMO;
    }
  } catch (error) {
    console.error('Database initialization error:', error);
    databaseType = DatabaseType.DEMO;
    return DatabaseType.DEMO;
  }
};

/**
 * Initialize the database tables
 * @param userId The user ID
 * @param userEmail The user email
 */
export const initializeDatabase = async (userId: string, userEmail: string): Promise<boolean> => {
  try {
    console.log('Initializing database...');
    
    // Initialize the database provider if not already done
    const dbType = await initializeDatabaseProvider();
    
    // If demo mode, just return success
    if (dbType === DatabaseType.DEMO) {
      console.log('Using demo mode, no database initialization needed');
      return true;
    }
    
    // Initialize MySQL tables
    if (mysqlPool) {
      console.log('Creating MySQL tables if they do not exist...');
      
      // Create posts table
      await mysqlPool.query(`
        CREATE TABLE IF NOT EXISTS posts (
          id VARCHAR(36) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT,
          featured_image VARCHAR(255),
          published BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          author_id VARCHAR(36) NOT NULL
        )
      `);
      
      // Create profiles table
      await mysqlPool.query(`
        CREATE TABLE IF NOT EXISTS profiles (
          id VARCHAR(36) PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          password VARCHAR(255),
          role VARCHAR(50) DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      
      // Create site_config table
      await mysqlPool.query(`
        CREATE TABLE IF NOT EXISTS site_config (
          id VARCHAR(36) PRIMARY KEY,
          key_name VARCHAR(255) NOT NULL UNIQUE,
          value JSON,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      
      // Create contact_messages table
      await mysqlPool.query(`
        CREATE TABLE IF NOT EXISTS contact_messages (
          id VARCHAR(36) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(50),
          message TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Create images table
      await mysqlPool.query(`
        CREATE TABLE IF NOT EXISTS images (
          id VARCHAR(36) PRIMARY KEY,
          path VARCHAR(255) NOT NULL,
          url VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          size INT,
          type VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          uploaded_by VARCHAR(36)
        )
      `);
      
      // Check if user exists in profiles
      const [rows] = await mysqlPool.query(
        'SELECT id FROM profiles WHERE id = ?',
        [userId]
      );
      
      // Create admin profile if it doesn't exist
      if (Array.isArray(rows) && rows.length === 0) {
        await mysqlPool.query(
          'INSERT INTO profiles (id, email, role) VALUES (?, ?, ?)',
          [userId, userEmail, 'admin']
        );
        console.log('Admin profile created for', userEmail);
      }
      
      console.log('Database initialization complete');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
};

/**
 * Execute a query against the database
 * @param query The SQL query
 * @param params The parameters
 */
export const executeQuery = async <T = any>(query: string, params: any[] = []): Promise<T[]> => {
  if (databaseType === DatabaseType.MYSQL && mysqlPool) {
    try {
      const [rows] = await mysqlPool.query(query, params);
      return rows as T[];
    } catch (error) {
      console.error('MySQL query error:', error);
      throw error;
    }
  } else {
    console.warn('Database not initialized or in demo mode');
    return [];
  }
};

/**
 * Create a new item in the database
 * @param table The table name
 * @param data The data to insert
 */
export const createItem = async <T = any>(table: string, data: Record<string, any>): Promise<T> => {
  if (databaseType === DatabaseType.MYSQL && mysqlPool) {
    try {
      const columns = Object.keys(data).join(', ');
      const placeholders = Object.keys(data).map(() => '?').join(', ');
      const values = Object.values(data);
      
      const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
      const [result] = await mysqlPool.query(query, values);
      
      return { ...data, id: (result as any).insertId } as T;
    } catch (error) {
      console.error(`Error creating item in ${table}:`, error);
      throw error;
    }
  } else {
    console.warn('Database not initialized or in demo mode');
    return data as T;
  }
};

/**
 * Get items from the database
 * @param table The table name
 * @param conditions The conditions for the query
 * @param orderBy The column to order by
 * @param limit The maximum number of items to return
 */
export const getItems = async <T = any>(
  table: string,
  conditions: Record<string, any> = {},
  orderBy?: { column: string; direction: 'asc' | 'desc' },
  limit?: number
): Promise<T[]> => {
  if (databaseType === DatabaseType.MYSQL && mysqlPool) {
    try {
      let query = `SELECT * FROM ${table}`;
      const params: any[] = [];
      
      // Add conditions
      if (Object.keys(conditions).length > 0) {
        const whereClauses = Object.entries(conditions).map(([key, value]) => {
          params.push(value);
          return `${key} = ?`;
        });
        query += ` WHERE ${whereClauses.join(' AND ')}`;
      }
      
      // Add order by
      if (orderBy) {
        query += ` ORDER BY ${orderBy.column} ${orderBy.direction.toUpperCase()}`;
      }
      
      // Add limit
      if (limit) {
        query += ` LIMIT ?`;
        params.push(limit);
      }
      
      const [rows] = await mysqlPool.query(query, params);
      return rows as T[];
    } catch (error) {
      console.error(`Error getting items from ${table}:`, error);
      throw error;
    }
  } else {
    console.warn('Database not initialized or in demo mode');
    return [];
  }
};

/**
 * Update an item in the database
 * @param table The table name
 * @param id The ID of the item
 * @param data The data to update
 */
export const updateItem = async <T = any>(
  table: string,
  id: string | number,
  data: Record<string, any>
): Promise<T> => {
  if (databaseType === DatabaseType.MYSQL && mysqlPool) {
    try {
      const setClauses = Object.keys(data).map(key => `${key} = ?`).join(', ');
      const values = [...Object.values(data), id];
      
      const query = `UPDATE ${table} SET ${setClauses} WHERE id = ?`;
      await mysqlPool.query(query, values);
      
      return { ...data, id } as T;
    } catch (error) {
      console.error(`Error updating item in ${table}:`, error);
      throw error;
    }
  } else {
    console.warn('Database not initialized or in demo mode');
    return { ...data, id } as T;
  }
};

/**
 * Delete an item from the database
 * @param table The table name
 * @param id The ID of the item
 */
export const deleteItem = async (table: string, id: string | number): Promise<boolean> => {
  if (databaseType === DatabaseType.MYSQL && mysqlPool) {
    try {
      const query = `DELETE FROM ${table} WHERE id = ?`;
      await mysqlPool.query(query, [id]);
      return true;
    } catch (error) {
      console.error(`Error deleting item from ${table}:`, error);
      throw error;
    }
  } else {
    console.warn('Database not initialized or in demo mode');
    return true;
  }
};

/**
 * Get the current database type
 */
export const getCurrentDatabaseType = (): DatabaseType | null => {
  return databaseType;
};
