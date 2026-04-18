const RSVP = require('../models/RSVP');
const Event = require('../models/Event');

const rsvpEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { status = 'going' } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    if (event.isCancelled) {
      return res.status(400).json({ success: false, error: 'Event is cancelled' });
    }

    if (event.maxAttendees > 0 && event.rsvpCount >= event.maxAttendees && status === 'going') {
      return res.status(400).json({ success: false, error: 'Event is full' });
    }

    const existing = await RSVP.findOne({ user: req.user._id, event: eventId });

    if (existing) {
      const oldStatus = existing.status;
      existing.status = status;
      await existing.save();

      if (oldStatus !== 'going' && status === 'going') {
        await Event.findByIdAndUpdate(eventId, { $inc: { rsvpCount: 1 } });
      } else if (oldStatus === 'going' && status !== 'going') {
        await Event.findByIdAndUpdate(eventId, { $inc: { rsvpCount: -1 } });
      }

      return res.json({ success: true, rsvp: existing });
    }

    const rsvp = await RSVP.create({ user: req.user._id, event: eventId, status });
    if (status === 'going') {
      await Event.findByIdAndUpdate(eventId, { $inc: { rsvpCount: 1 } });
    }

    return res.status(201).json({ success: true, rsvp });
  } catch (err) {
    return next(err);
  }
};

const cancelRSVP = async (req, res, next) => {
  try {
    const rsvp = await RSVP.findOne({ user: req.user._id, event: req.params.eventId });
    if (!rsvp) {
      return res.status(404).json({ success: false, error: 'RSVP not found' });
    }

    const wasGoing = rsvp.status === 'going';
    await rsvp.deleteOne();

    if (wasGoing) {
      await Event.findByIdAndUpdate(req.params.eventId, { $inc: { rsvpCount: -1 } });
    }

    return res.json({ success: true, message: 'RSVP cancelled' });
  } catch (err) {
    return next(err);
  }
};

const getMyRSVPs = async (req, res, next) => {
  try {
    const rsvps = await RSVP.find({ user: req.user._id })
      .populate({
        path: 'event',
        populate: { path: 'organiser', select: 'name avatar' },
      })
      .sort({ createdAt: -1 });

    return res.json({ success: true, rsvps });
  } catch (err) {
    return next(err);
  }
};

const getRSVPStatus = async (req, res, next) => {
  try {
    const rsvp = await RSVP.findOne({ user: req.user._id, event: req.params.eventId });
    return res.json({ success: true, rsvp: rsvp || null });
  } catch (err) {
    return next(err);
  }
};

module.exports = { rsvpEvent, cancelRSVP, getMyRSVPs, getRSVPStatus };
