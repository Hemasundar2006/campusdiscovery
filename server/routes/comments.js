const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getComments,
  addComment,
  editComment,
  deleteComment,
  toggleLike,
} = require('../controllers/commentController');

const router = express.Router({ mergeParams: true });

router.get('/:eventId/comments', getComments);
router.post('/:eventId/comments', protect, addComment);
router.put('/:eventId/comments/:commentId', protect, editComment);
router.delete('/:eventId/comments/:commentId', protect, deleteComment);
router.post('/:eventId/comments/:commentId/like', protect, toggleLike);

module.exports = router;
