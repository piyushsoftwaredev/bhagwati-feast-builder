import { mysqlPool } from './mysql-config';
import { cache } from './cache-service';
import { v4 as uuidv4 } from 'uuid';

/**
 * Helper function to create necessary database tables
 */
export const createTable = async (tableName: string, schema: string) => {
  try {
    // Use cache to avoid redundant table creation checks
    const cacheKey = `mysql-table-exists-${tableName}`;
    if (cache.has(cacheKey)) {
      return true;
    }
    
    // Create the table with provided schema
    const createSQL = `CREATE TABLE IF NOT EXISTS ${tableName} (${schema})`;
    
    try {
      await mysqlPool.query(createSQL);
      console.log(`Table ${tableName} created or already exists.`);
    } catch (error) {
      console.error(`Failed to create table ${tableName}:`, error);
      return false;
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
 * Initialize database with required tables
 */
export const initializeDatabase = async (userId?: string, userEmail?: string) => {
  try {
    console.log('Initializing MySQL database...');
    
    // Check cache to avoid redundant initialization
    const cacheKey = 'mysql-database-tables-initialized';
    if (cache.has(cacheKey)) {
      console.log('Using cached MySQL database initialization status');
      return true;
    }
    
    // Create posts table
    await createTable('posts', `
      id VARCHAR(36) PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT,
      featured_image TEXT,
      published BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      author_id VARCHAR(36)
    `);
    
    // Create site_config table
    await createTable('site_config', `
      id VARCHAR(36) PRIMARY KEY,
      \`key\` VARCHAR(255) NOT NULL,
      value JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE(\`key\`)
    `);
    
    // Create contact_messages table
    await createTable('contact_messages', `
      id VARCHAR(36) PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);
    
    // Create booking_requests table
    await createTable('booking_requests', `
      id VARCHAR(36) PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      event_type TEXT NOT NULL,
      date DATE NOT NULL,
      guest_count INT NOT NULL,
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);
    
    // Create images table for tracking uploaded images
    await createTable('images', `
      id VARCHAR(36) PRIMARY KEY,
      path TEXT NOT NULL,
      url TEXT NOT NULL,
      name TEXT NOT NULL,
      size INT,
      type TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      uploaded_by VARCHAR(36)
    `);
    
    // Create profiles table and add admin user if needed
    await createTable('profiles', `
      id VARCHAR(36) PRIMARY KEY,
      email TEXT,
      role TEXT DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    `);
    
    // Create theme_settings table for custom themes
    await createTable('theme_settings', `
      id VARCHAR(36) PRIMARY KEY,
      primary_color TEXT DEFAULT '#8B0000',
      secondary_color TEXT DEFAULT '#FFD700',
      font_family TEXT DEFAULT 'Inter, sans-serif',
      header_style TEXT DEFAULT 'standard',
      footer_style TEXT DEFAULT 'standard',
      custom_css TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    `);
    
    // Create admin profile if userId is provided
    if (userId && userEmail) {
      try {
        const [rows] = await mysqlPool.query(
          'SELECT id FROM profiles WHERE id = ?',
          [userId]
        );
        
        if (!rows || (Array.isArray(rows) && rows.length === 0)) {
          await mysqlPool.query(
            'INSERT INTO profiles (id, email, role) VALUES (?, ?, ?)',
            [userId, userEmail, 'admin']
          );
          
          console.log('Admin profile created for', userEmail);
        }
      } catch (error) {
        console.warn('Error checking/creating admin profile:', error);
        // Continue execution even if profile creation fails
      }
    }
    
    // Cache the initialization status
    cache.set(cacheKey, true, 30); // Cache for 30 minutes
    
    console.log('MySQL database initialization complete.');
    return true;
  } catch (error) {
    console.error('Error initializing MySQL database:', error);
    return false;
  }
};

// Function to execute custom SQL queries
export const executeCustomSQL = async (sql: string, params?: any[]) => {
  try {
    console.log('Executing custom SQL:', sql);
    const [results] = await mysqlPool.query(sql, params || []);
    return { data: results, error: null };
  } catch (error) {
    console.error('Error executing custom SQL:', error);
    return { data: null, error };
  }
};

// Generic function to insert data into any table
export const insertData = async (tableName: string, data: any) => {
  try {
    // Ensure data has an ID
    if (!data.id) {
      data.id = uuidv4();
    }
    
    // Build the SQL query
    const keys = Object.keys(data);
    const placeholders = keys.map(() => '?').join(', ');
    const values = keys.map(key => data[key]);
    
    const sql = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders})`;
    
    const [result] = await mysqlPool.query(sql, values);
    return { data: { ...data, id: data.id }, error: null };
  } catch (error) {
    console.error(`Error inserting data into ${tableName}:`, error);
    return { data: null, error };
  }
};

// Generic function to update data in any table
export const updateData = async (tableName: string, id: string, data: any) => {
  try {
    // Build the SQL query
    const keys = Object.keys(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const values = [...keys.map(key => data[key]), id];
    
    const sql = `UPDATE ${tableName} SET ${setClause} WHERE id = ?`;
    
    const [result] = await mysqlPool.query(sql, values);
    return { data: { ...data, id }, error: null };
  } catch (error) {
    console.error(`Error updating data in ${tableName}:`, error);
    return { data: null, error };
  }
};

// Generic function to select data from any table
export const selectData = async (tableName: string, options: { 
  columns?: string[],
  where?: Record<string, any>,
  limit?: number,
  offset?: number,
  orderBy?: { column: string, direction: 'ASC' | 'DESC' }
} = {}) => {
  try {
    const columns = options.columns?.join(', ') || '*';
    
    let sql = `SELECT ${columns} FROM ${tableName}`;
    const values: any[] = [];
    
    // Add WHERE clause if provided
    if (options.where && Object.keys(options.where).length > 0) {
      const whereConditions = Object.keys(options.where).map(key => {
        values.push(options.where![key]);
        return `${key} = ?`;
      }).join(' AND ');
      
      if (whereConditions) {
        sql += ` WHERE ${whereConditions}`;
      }
    }
    
    // Add ORDER BY if provided
    if (options.orderBy) {
      sql += ` ORDER BY ${options.orderBy.column} ${options.orderBy.direction}`;
    }
    
    // Add LIMIT and OFFSET if provided
    if (options.limit !== undefined) {
      sql += ` LIMIT ?`;
      values.push(options.limit);
      
      if (options.offset !== undefined) {
        sql += ` OFFSET ?`;
        values.push(options.offset);
      }
    }
    
    const [rows] = await mysqlPool.query(sql, values);
    return { data: rows, error: null };
  } catch (error) {
    console.error(`Error selecting data from ${tableName}:`, error);
    return { data: null, error };
  }
};

// Function to delete data from any table
export const deleteData = async (tableName: string, id: string) => {
  try {
    const sql = `DELETE FROM ${tableName} WHERE id = ?`;
    const [result] = await mysqlPool.query(sql, [id]);
    return { data: { id }, error: null };
  } catch (error) {
    console.error(`Error deleting data from ${tableName}:`, error);
    return { data: null, error };
  }
};