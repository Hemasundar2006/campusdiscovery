const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    title: { 
      type: String, 
      required: true,
      trim: true 
    },
    description: { 
      type: String, 
      required: true,
      trim: true 
    },
    imageUrl: { type: String, default: '' },
    imagePath: { type: String, default: '' },
    competitionName: { type: String, default: '' },
    rank: { type: String, default: 'Winner' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Achievement', achievementSchema);
