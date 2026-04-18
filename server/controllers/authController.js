const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'All fields required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, error: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !user.password) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        error: `Account banned: ${user.bannedReason || 'contact support'}`,
      });
    }

    const token = generateToken(user._id, user.role);
    return res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    return next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    return res.json({ success: true, user });
  } catch (err) {
    return next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const allowed = ['name', 'bio', 'socialLinks', 'avatar'];
    const updates = {};

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return res.json({ success: true, user });
  } catch (err) {
    return next(err);
  }
};

const googleCallback = (req, res) => {
  const token = generateToken(req.user._id, req.user.role);
  
  // 1. Try to get the Frontend URL from Environment Variables
  // 2. If missing, fall back to localhost (for testing)
  // 3. MOST IMPORTANT: On Render, ensure this points to your FRONTEND URL (e.g. your Vercel or Render Static site)
  const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
  
  console.log(`Success! Redirecting user (${req.user.email}) to: ${clientUrl}`);
  
  return res.redirect(`${clientUrl}/auth/callback?token=${token}&role=${req.user.role}`);
};

module.exports = { register, login, getMe, updateProfile, googleCallback };
