const Comment = require('../models/Comment');
const Event = require('../models/Event');

const getComments = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const all = await Comment.find({ event: eventId, isDeleted: false })
      .populate('author', 'name avatar')
      .sort({ createdAt: 1 });

    const map = {};
    const roots = [];

    all.forEach((comment) => {
      map[comment._id] = { ...comment.toObject(), replies: [] };
    });

    all.forEach((comment) => {
      if (comment.parentComment) {
        const parent = map[comment.parentComment];
        if (parent) parent.replies.push(map[comment._id]);
      } else {
        roots.push(map[comment._id]);
      }
    });

    return res.json({ success: true, comments: roots });
  } catch (err) {
    return next(err);
  }
};

const addComment = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { text, parentComment } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ success: false, error: 'Comment text required' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    const comment = await Comment.create({
      text: text.trim(),
      author: req.user._id,
      event: eventId,
      parentComment: parentComment || null,
    });

    await comment.populate('author', 'name avatar');
    return res.status(201).json({ success: true, comment });
  } catch (err) {
    return next(err);
  }
};

const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Not your comment' });
    }

    if (!req.body.text?.trim()) {
      return res.status(400).json({ success: false, error: 'Text required' });
    }

    comment.text = req.body.text.trim();
    comment.isEdited = true;
    await comment.save();
    await comment.populate('author', 'name avatar');

    return res.json({ success: true, comment });
  } catch (err) {
    return next(err);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }

    const isOwner = comment.author.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorised' });
    }

    comment.isDeleted = true;
    comment.text = '[deleted]';
    await comment.save();

    return res.json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    return next(err);
  }
};

const toggleLike = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ success: false, error: 'Not found' });

    const uid = req.user._id.toString();
    const liked = comment.likes.map(String).includes(uid);

    if (liked) {
      comment.likes.pull(req.user._id);
    } else {
      comment.likes.push(req.user._id);
    }

    await comment.save();
    return res.json({ success: true, likes: comment.likes.length, liked: !liked });
  } catch (err) {
    return next(err);
  }
};

module.exports = { getComments, addComment, editComment, deleteComment, toggleLike };
