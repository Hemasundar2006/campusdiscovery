const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [150, 'Title max 150 chars'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [3000, 'Description max 3000 chars'],
    },
    date: { type: Date, required: [true, 'Date is required'] },
    endDate: { type: Date },
    imageUrl: { type: String, default: '' },
    imagePath: { type: String, default: '' },
    location: {
      address: { type: String, required: [true, 'Address required'] },
      name: { type: String, default: '' },
      coordinates: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] },
      },
    },
    organiser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['academic', 'social', 'sports', 'arts', 'tech', 'other'],
    },
    tags: [{ type: String, lowercase: true, trim: true }],
    rsvpCount: { type: Number, default: 0 },
    maxAttendees: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
    isCancelled: { type: Boolean, default: false },
    contactEmail: { type: String, default: '' },
    competitions: [
      {
        name: { type: String, required: true },
        prize: { type: String, default: '' },
        rules: { type: String, default: '' },
        winners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      },
    ],
  },
  { timestamps: true }
);

eventSchema.index({ 'location.coordinates': '2dsphere' });
eventSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Event', eventSchema);
