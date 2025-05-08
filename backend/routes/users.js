
const express = require('express');
const router = express.Router();
const db = require('../db');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

// Hash password utility
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Get all users (admins only)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, email, role, created_at FROM profiles');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

// Get single user by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, email, role, created_at FROM profiles WHERE id = ?', 
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

// Create new user
router.post('/', async (req, res) => {
  try {
    const { email, password, role = 'user' } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Check if user already exists
    const [existingUsers] = await db.query('SELECT id FROM profiles WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    
    const userId = uuidv4();
    const hashedPassword = hashPassword(password);
    
    await db.query(
      'INSERT INTO profiles (id, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [userId, email, hashedPassword, role]
    );
    
    res.status(201).json({ 
      id: userId,
      email,
      role,
      message: 'User created successfully'
    });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const userId = req.params.id;
    
    // Check if user exists
    const [existingUsers] = await db.query('SELECT id FROM profiles WHERE id = ?', [userId]);
    if (existingUsers.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Build update query dynamically
    const updateFields = [];
    const queryParams = [];
    
    if (email) {
      updateFields.push('email = ?');
      queryParams.push(email);
    }
    
    if (password) {
      updateFields.push('password = ?');
      queryParams.push(hashPassword(password));
    }
    
    if (role) {
      updateFields.push('role = ?');
      queryParams.push(role);
    }
    
    // Add updated_at field and user ID
    updateFields.push('updated_at = NOW()');
    queryParams.push(userId);
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    await db.query(
      `UPDATE profiles SET ${updateFields.join(', ')} WHERE id = ?`,
      queryParams
    );
    
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const [existingUsers] = await db.query('SELECT id FROM profiles WHERE id = ?', [userId]);
    if (existingUsers.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    await db.query('DELETE FROM profiles WHERE id = ?', [userId]);
    
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const hashedPassword = hashPassword(password);
    
    const [users] = await db.query(
      'SELECT id, email, role FROM profiles WHERE email = ? AND password = ?',
      [email, hashedPassword]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const user = users[0];
    
    // Generate simple session token (in production, use JWT or other secure method)
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    // Store session in database (in production, use Redis or other session store)
    await db.query(
      'INSERT INTO user_sessions (token, user_id, expires_at) VALUES (?, ?, ?)',
      [token, user.id, expiresAt]
    );
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      token,
      expiresAt
    });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

module.exports = router;
