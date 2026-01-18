const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// --- Models ---
const Resource = require('./models/Resource');
const Booking = require('./models/Booking');
const User = require('./models/User');

// --- Database Connection ---
mongoose.connect('mongodb+srv://admin:password77@cluster0.rxrsgwv.mongodb.net/?appName=Cluster0')
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('MongoDB Connection Failed:', err));

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// --- ROUTES ---

// 1. GET ALL OWNERS (For Dropdown)
app.get('/api/owners', async (req, res) => {
  try {
    const owners = await User.find({ role: 'OWNER' }).select('name username _id');
    res.json({ success: true, data: owners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. CREATE NEW OWNER (Instant Registration)
app.post('/api/register-owner', async (req, res) => {
  const { name, username, password } = req.body;
  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ success: false, message: "Username already taken" });

    const newUser = await User.create({ name, username, password, role: 'OWNER' });
    res.json({ success: true, user: newUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. LOGIN
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    if (username === 'admin' && password === 'admin123') {
      return res.json({ success: true, user: { id: 'SUPER_ADMIN', name: 'Super Admin', role: 'SUPER_ADMIN' } });
    }
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid Credentials" });
    }
    res.json({ success: true, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. GET MY RESOURCES
app.get('/api/my-resources', async (req, res) => {
  const { userId } = req.query;
  try {
    let resources;
    if (userId === 'SUPER_ADMIN') {
      resources = await Resource.find({});
    } else {
      resources = await Resource.find({ ownerId: userId });
    }
    res.json({ success: true, data: resources });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. ADD NEW PROPERTY
app.post('/api/resources', async (req, res) => {
  try {
    const newResource = new Resource(req.body);
    await newResource.save();
    res.json({ success: true, message: "✅ New Property Added!", data: newResource });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6. BOOKINGS & SEARCH (Keeping your existing logic)
app.get('/api/bookings', async (req, res) => {
    const { role, userId } = req.query; 
    try {
      let filter = {};
      if (role === 'OWNER') {
        const myResources = await Resource.find({ ownerId: userId });
        const resourceIds = myResources.map(r => r._id);
        filter = { resourceId: { $in: resourceIds } };
      }
      const bookings = await Booking.find(filter).populate('resourceId');
      res.json({ success: true, data: bookings });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
});
app.post('/api/search', async (req, res) => {
    const { activeTab } = req.body;
    const resources = await Resource.find({ type: activeTab });
    res.json({ success: true, data: resources });
});
app.post('/api/book', async (req, res) => {
    /* ... (Keep your existing booking logic) ... */
    res.json({ success: true }); 
});
app.get('/api/seed-users', async (req, res) => {
    /* ... (Keep your existing seed logic) ... */
    res.json({ message: "Reset Complete" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));