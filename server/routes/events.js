const express = require('express');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
} = require('../controllers/eventController');

const router = express.Router();

router.get('/', getEvents);
router.get('/my', protect, getMyEvents);
router.get('/:id', getEventById);
router.post('/', protect, upload.single('image'), createEvent);
router.put('/:id', protect, upload.single('image'), updateEvent);
router.delete('/:id', protect, deleteEvent);

module.exports = router;
