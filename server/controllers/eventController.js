const Event = require('../models/Event');
const deleteFile = require('../utils/deleteFile');

const buildImageUrl = (req, filename) =>
  `${req.protocol}://${req.get('host')}/uploads/events/${filename}`;

const getEvents = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, parseInt(req.query.limit, 10) || 9);
    const skip = (page - 1) * limit;

    const filter = { isPublished: true, isCancelled: false };

    if (req.query.category) filter.category = req.query.category.toLowerCase();
    if (!req.query.past) filter.date = { $gte: new Date() };
    if (req.query.search) filter.$text = { $search: req.query.search };

    const [events, total] = await Promise.all([
      Event.find(filter)
        .populate('organiser', 'name avatar email')
        .sort(req.query.search ? { score: { $meta: 'textScore' } } : { date: 1 })
        .skip(skip)
        .limit(limit),
      Event.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      events,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    return next(err);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      'organiser',
      'name avatar email bio socialLinks'
    );

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    return res.json({ success: true, event });
  } catch (err) {
    return next(err);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      date,
      endDate,
      locationAddress,
      locationName,
      locationLng,
      locationLat,
      category,
      tags,
      maxAttendees,
      contactEmail,
      competitions,
    } = req.body;

    const location = {
      address: locationAddress,
      name: locationName || '',
    };

    if (locationLng && locationLat) {
      location.coordinates = {
        type: 'Point',
        coordinates: [parseFloat(locationLng), parseFloat(locationLat)],
      };
    }

    let imageUrl = '';
    let imagePath = '';

    if (req.file) {
      imageUrl = buildImageUrl(req, req.file.filename);
      imagePath = req.file.path;
    }

    const event = await Event.create({
      title,
      description,
      date,
      endDate,
      location,
      imageUrl,
      imagePath,
      category,
      externalLink: req.body.externalLink || '',
      tags: tags ? JSON.parse(tags) : [],
      competitions: competitions ? JSON.parse(competitions) : [],
      maxAttendees: maxAttendees || 0,
      contactEmail: contactEmail || '',
      organiser: req.user._id,
    });

    await event.populate('organiser', 'name avatar email');
    return res.status(201).json({ success: true, event });
  } catch (err) {
    if (req.file) deleteFile(req.file.path);
    return next(err);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    const isOwner = event.organiser.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorised' });
    }

    const fields = [
      'title',
      'description',
      'date',
      'endDate',
      'category',
      'tags',
      'maxAttendees',
      'contactEmail',
      'isCancelled',
      'competitions',
      'externalLink',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'competitions' || field === 'tags') {
          try {
            event[field] = typeof req.body[field] === 'string' ? JSON.parse(req.body[field]) : req.body[field];
          } catch (e) {
            event[field] = req.body[field];
          }
        } else {
          event[field] = req.body[field];
        }
      }
    });

    if (req.body.locationAddress) {
      event.location.address = req.body.locationAddress;
      event.location.name = req.body.locationName || event.location.name;
    }

    if (req.body.locationLng && req.body.locationLat) {
      event.location.coordinates = {
        type: 'Point',
        coordinates: [parseFloat(req.body.locationLng), parseFloat(req.body.locationLat)],
      };
    }

    if (req.file) {
      const oldPath = event.imagePath;
      event.imageUrl = buildImageUrl(req, req.file.filename);
      event.imagePath = req.file.path;
      deleteFile(oldPath);
    }

    await event.save();
    await event.populate('organiser', 'name avatar email');

    return res.json({ success: true, event });
  } catch (err) {
    if (req.file) deleteFile(req.file.path);
    return next(err);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    const isOwner = event.organiser.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorised' });
    }

    deleteFile(event.imagePath);
    await event.deleteOne();

    return res.json({ success: true, message: 'Event deleted' });
  } catch (err) {
    return next(err);
  }
};

const getMyEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ organiser: req.user._id }).sort({ createdAt: -1 });
    return res.json({ success: true, events });
  } catch (err) {
    return next(err);
  }
};

const trackEventClick = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, error: 'Event not found' });

    event.clickCount = (event.clickCount || 0) + 1;
    await event.save();
    return res.json({ success: true, clickCount: event.clickCount });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
  trackEventClick,
};
