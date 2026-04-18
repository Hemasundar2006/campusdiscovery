const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        error: `Account banned: ${user.bannedReason || 'contact support'}`,
      });
    }

    req.user = user;
    return next();
  } catch (_err) {
    return res.status(401).json({ success: false, error: 'Token invalid or expired' });
  }
};

module.exports = { protect };
