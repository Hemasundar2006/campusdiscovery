const express = require('express');
const { protect } = require('../middleware/auth');
const {
  rsvpEvent,
  cancelRSVP,
  getMyRSVPs,
  getRSVPStatus,
} = require('../controllers/rsvpController');

const router = express.Router();

router.get('/my', protect, getMyRSVPs);
router.get('/:eventId/status', protect, getRSVPStatus);
router.post('/:eventId', protect, rsvpEvent);
router.delete('/:eventId', protect, cancelRSVP);

module.exports = router;
