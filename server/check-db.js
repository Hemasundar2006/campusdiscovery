const mongoose = require('mongoose');
const Event = require('./models/Event');
require('dotenv').config();

async function checkEvents() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('DB Connected');
    
    const total = await Event.countDocuments({});
    const active = await Event.countDocuments({ date: { $gte: new Date() }, isPublished: true, isCancelled: false });
    
    console.log(`Total Events: ${total}`);
    console.log(`Active Events (>= today): ${active}`);
    
    if (total > 0) {
        const sample = await Event.findOne().sort({ date: 1 });
        console.log('Sample Event Date:', sample.date);
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkEvents();
