import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';

// Loads .env from the project root (no need for fs/path)
dotenv.config();

export const mysqlConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'bhagwati_feast',
  password: process.env.MYSQL_PASSWORD || 'bhagwati_feast',
  database: process.env.MYSQL_DATABASE || 'bhagwati_feast',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
};

console.log('MySQL Configuration (without password):', {
  ...mysqlConfig,
  password: '<hidden>'
});

export const mysqlPool = createPool(mysqlConfig);

// Helper function to check if MySQL connection is working
export const isMySqlConfigured = async () => {
  try {
    console.log('Checking MySQL connection...');
    const connection = await mysqlPool.getConnection();
    await connection.query('SELECT 1');
    connection.release();
    console.log('MySQL connection successful');
    return true;
  } catch (e) {
    console.error('MySQL connection check failed:', e);
    return false;
  }
};

// Create database if it doesn't exist
export const ensureDatabaseExists = async () => {
  try {
    console.log('Ensuring database exists:', mysqlConfig.database);
    const tempConfig = { ...mysqlConfig };
    delete tempConfig.database;
    const tempPool = createPool(tempConfig);
    const connection = await tempPool.getConnection();
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${mysqlConfig.database}\``);
    connection.release();
    await tempPool.end();
    console.log('Database exists or was created successfully');
    return true;
  } catch (e) {
    console.error('Failed to ensure database exists:', e);
    return false;
  }
};