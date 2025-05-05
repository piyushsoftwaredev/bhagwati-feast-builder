require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Example: Get all users
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, email, role FROM profiles');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

// Example: Add an admin user
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));