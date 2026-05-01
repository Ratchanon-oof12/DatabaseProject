const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const MONGO_URI = 'mongodb://admin:password123@localhost:27017/silkreader?authSource=admin';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ══════════════════════════════════════════════════════════════
//  SCHEMAS & MODELS
// ══════════════════════════════════════════════════════════════

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  bio:      { type: String, default: '' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const blogSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  slug:       { type: String, required: true, unique: true },
  author:     { type: String, required: true },
  authorId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category:   { type: String, required: true },
  content:    { type: String, required: true },
  excerpt:    { type: String, required: true },
  coverImage: { type: String, default: '' },
  status:     { type: String, enum: ['draft', 'published'], default: 'published' },
  likes:      { type: Number, default: 0 },
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);

// ══════════════════════════════════════════════════════════════
//  HEALTH
// ══════════════════════════════════════════════════════════════

app.get('/', (req, res) => {
  res.send('Silk Reader API is running!');
});

// ══════════════════════════════════════════════════════════════
//  AUTH ROUTES  (bcrypt password hashing)
// ══════════════════════════════════════════════════════════════

// Register — hashes password with bcrypt before storing
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required' });
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: 'An account with that email already exists' });
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await new User({ name, email, password: hashedPassword }).save();
    // Return user without the password field
    const { password: _, ...safeUser } = user.toObject();
    res.status(201).json(safeUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login — finds user by email, compares bcrypt hash
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ error: 'No account found with that email' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Incorrect password' });
    // Return user without the password field
    const { password: _, ...safeUser } = user.toObject();
    res.status(200).json(safeUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════════════════════════════
//  USER CRUD ROUTES
// ══════════════════════════════════════════════════════════════

// GET all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single user
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update user
app.put('/api/users/:id', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════════════════════════════
//  BLOG AUTHORIZATION HELPER
// ══════════════════════════════════════════════════════════════

// Returns the blog if the requesting user owns it, otherwise sends 403/404
async function requireOwnership(req, res) {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404).json({ error: 'Blog not found' });
    return null;
  }
  const userId = req.headers['x-user-id'];
  if (!userId || blog.authorId.toString() !== userId) {
    res.status(403).json({ error: 'Forbidden: you do not own this post' });
    return null;
  }
  return blog;
}

// ══════════════════════════════════════════════════════════════
//  BLOG CRUD ROUTES
// ══════════════════════════════════════════════════════════════

// GET all blogs
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single blog
app.get('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create blog (requires x-user-id header)
app.post('/api/blogs', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'Unauthorized: please log in' });
    const blog = new Blog({ ...req.body, authorId: userId });
    const saved = await blog.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update blog (owner only)
app.put('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await requireOwnership(req, res);
    if (!blog) return;
    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE blog (owner only)
app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await requireOwnership(req, res);
    if (!blog) return;
    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH increment likes (any logged-in user)
app.patch('/api/blogs/:id/like', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
