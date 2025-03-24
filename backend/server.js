  const express = require('express');
  const mongoose = require('mongoose');
  const bcrypt = require('bcrypt');
  const jwt = require('jsonwebtoken');
  const app = express();
  app.use(express.json());

  mongoose.connect('mongodb://localhost:27017/questionPaperDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

  const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' }
  });

  const paperSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subject: { type: String, required: true },
    fileUrl: { type: String, required: true },
    downloadCount: { type: Number, default: 0 }
  });

  const User = mongoose.model('User', userSchema);
  const Paper = mongoose.model('Paper', paperSchema);

  userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  });

  const JWT_SECRET = 'your_jwt_secret'; 

  const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };

  app.post('/api/register', async (req, res) => {
    try {
      const { username, password, role } = req.body;
      
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      const user = new User({ username, password, role });
      await user.save();
      
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  app.post('/api/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  app.get('/api/papers', authenticate, async (req, res) => {
    try {
      const papers = await Paper.find({}, 'title subject downloadCount');
      res.json(papers);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  app.get('/api/papers/:id/download', authenticate, async (req, res) => {
    try {
      const paper = await Paper.findById(req.params.id);
      
      if (!paper) {
        return res.status(404).json({ message: 'Paper not found' });
      }
      
      paper.downloadCount += 1;
      await paper.save();
      
      res.json({ fileUrl: paper.fileUrl, downloadCount: paper.downloadCount });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  app.post('/api/papers', authenticate, async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admin access required' });
      }
      
      const { title, subject, fileUrl } = req.body;
      const paper = new Paper({ title, subject, fileUrl });
      await paper.save();
      
      res.status(201).json(paper);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  app.get('/api/stats/downloads', authenticate, async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admin access required' });
      }
      
      const papers = await Paper.find({}, 'title downloadCount').sort('-downloadCount');
      res.json(papers);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));