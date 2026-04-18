const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router
  .route('/')
  .get(achievementController.getAchievements)
  .post(protect, upload.single('image'), achievementController.createAchievement);

router
  .route('/:id')
  .delete(protect, achievementController.deleteAchievement);

module.exports = router;
