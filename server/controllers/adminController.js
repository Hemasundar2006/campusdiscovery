const User = require('../models/User');
const Event = require('../models/Event');
const RSVP = require('../models/RSVP');
const Comment = require('../models/Comment');
const deleteFile = require('../utils/deleteFile');

const getStats = async (_req, res, next) => {
  try {
    const [users, events, rsvps, comments] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments({ isCancelled: false }),
      RSVP.countDocuments(),
      Comment.countDocuments({ isDeleted: false }),
    ]);

    const banned = await User.countDocuments({ isBanned: true });
    return res.json({ success: true, stats: { users, events, rsvps, comments, banned } });
  } catch (err) {
    return next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, parseInt(req.query.limit, 10) || 20);
    const skip = (page - 1) * limit;
    const filter = {};

    if (req.query.search) {
      const rx = new RegExp(req.query.search, 'i');
      filter.$or = [{ name: rx }, { email: rx }];
    }

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      users,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    return next(err);
  }
};

const banUser = async (req, res, next) => {
  try {
    const { isBanned, bannedReason = '' } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    if (user.role === 'admin') {
      return res.status(403).json({ success: false, error: 'Cannot ban an admin' });
    }

    user.isBanned = isBanned;
    user.bannedReason = isBanned ? bannedReason : '';
    await user.save();

    return res.json({ success: true, user });
  } catch (err) {
    return next(err);
  }
};

const getAllEvents = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, parseInt(req.query.limit, 10) || 20);
    const skip = (page - 1) * limit;
    const filter = {};

    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    const [events, total] = await Promise.all([
      Event.find(filter)
        .populate('organiser', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Event.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      events,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    return next(err);
  }
};

const adminDeleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, error: 'Event not found' });

    deleteFile(event.imagePath);

    await Promise.all([
      RSVP.deleteMany({ event: event._id }),
      Comment.deleteMany({ event: event._id }),
      event.deleteOne(),
    ]);

    return res.json({ success: true, message: 'Event and related data deleted' });
  } catch (err) {
    return next(err);
  }
};

const changeRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ success: false, error: 'Not found' });

    return res.json({ success: true, user });
  } catch (err) {
    return next(err);
  }
};

module.exports = { getStats, getUsers, banUser, getAllEvents, adminDeleteEvent, changeRole };
