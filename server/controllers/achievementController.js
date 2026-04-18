const Achievement = require('../models/Achievement');
const deleteFile = require('../utils/deleteFile');

const buildImageUrl = (req, filename) =>
  `${req.protocol}://${req.get('host')}/uploads/achievements/${filename}`;

const getAchievements = async (req, res, next) => {
  try {
    const achievements = await Achievement.find()
      .populate('user', 'name avatar')
      .populate('event', 'title')
      .sort({ createdAt: -1 });

    return res.json({ success: true, achievements });
  } catch (err) {
    return next(err);
  }
};

const createAchievement = async (req, res, next) => {
  try {
    const { event, title, description, competitionName, rank } = req.body;

    let imageUrl = '';
    let imagePath = '';

    if (req.file) {
      imageUrl = buildImageUrl(req, req.file.filename);
      imagePath = req.file.path;
    }

    const achievement = await Achievement.create({
      user: req.user._id,
      event,
      title,
      description,
      competitionName,
      rank,
      imageUrl,
      imagePath,
    });

    await achievement.populate('user', 'name avatar');
    await achievement.populate('event', 'title');

    return res.status(201).json({ success: true, achievement });
  } catch (err) {
    if (req.file) deleteFile(req.file.path);
    return next(err);
  }
};

const deleteAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) {
      return res.status(404).json({ success: false, error: 'Achievement not found' });
    }

    if (achievement.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorised' });
    }

    deleteFile(achievement.imagePath);
    await achievement.deleteOne();

    return res.json({ success: true, message: 'Achievement deleted' });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getAchievements,
  createAchievement,
  deleteAchievement,
};
