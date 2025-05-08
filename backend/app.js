
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const usersRouter = require('./routes/users');

const app = express();
app.use(cors());
app.use(express.json());

// Basic route
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Bhagwati Caterers API',
    version: '1.0.0',
    status: 'active'
  });
});

// Mount user routes
app.use('/api/users', usersRouter);

// Get all users (legacy route)
app.get('/api/users-legacy', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, email, role FROM profiles');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

// Add an admin user (legacy route)
app.post('/api/admin', async (req, res) => {
  const { id, email, password } = req.body;
  try {
    await db.query(
      'INSERT INTO profiles (id, email, password, role, created_at, updated_at) VALUES (?, ?, ?, "admin", NOW(), NOW())',
      [id, email, password]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

// Add posts routes
app.get('/api/posts', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM posts ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM posts WHERE id = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const { id, title, content, featured_image, published, author_id } = req.body;
    
    await db.query(
      'INSERT INTO posts (id, title, content, featured_image, published, author_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [id, title, content, featured_image, published, author_id]
    );
    
    res.status(201).json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.put('/api/posts/:id', async (req, res) => {
  try {
    const { title, content, featured_image, published } = req.body;
    const postId = req.params.id;
    
    await db.query(
      'UPDATE posts SET title = ?, content = ?, featured_image = ?, published = ?, updated_at = NOW() WHERE id = ?',
      [title, content, featured_image, published, postId]
    );
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

// Contact message routes
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }
    
    await db.query(
      'INSERT INTO contact_messages (id, name, email, phone, message, created_at) VALUES (UUID(), ?, ?, ?, ?, NOW())',
      [name, email, phone || null, message]
    );
    
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.get('/api/contact', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

// Image routes
app.get('/api/images', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM images ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.post('/api/images', async (req, res) => {
  try {
    const { id, path, url, name, size, type, uploaded_by } = req.body;
    
    await db.query(
      'INSERT INTO images (id, path, url, name, size, type, uploaded_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [id, path, url, name, size, type, uploaded_by]
    );
    
    res.status(201).json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.delete('/api/images/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM images WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));

module.exports = app;
