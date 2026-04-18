const express = require('express');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminOnly');
const {
  getStats,
  getUsers,
  banUser,
  getAllEvents,
  adminDeleteEvent,
  changeRole,
} = require('../controllers/adminController');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.patch('/users/:id/ban', banUser);
router.patch('/users/:id/role', changeRole);
router.get('/events', getAllEvents);
router.delete('/events/:id', adminDeleteEvent);

module.exports = router;
