require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI is missing from .env');
      return;
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('📡 Connected to MongoDB...');

    const email = 'marotinani06@gmail.com';
    const password = 'Campus';

    let user = await User.findOne({ email });

    if (user) {
      console.log('🔄 User already exists. Promoting to Admin...');
      user.role = 'admin';
      // If updating password too:
      user.password = password; 
      await user.save();
    } else {
      console.log('✨ Creating new Admin user...');
      user = await User.create({
        name: 'Super Admin',
        email,
        password,
        role: 'admin'
      });
    }

    console.log('\n✅ SUCCESS!');
    console.log('-------------------------');
    console.log(`Email: ${email}`);
    console.log('Password: (the one you provided)');
    console.log('Role: Admin');
    console.log('-------------------------');
    console.log('\nYou can now log in at /admin-login');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
    process.exit(1);
  }
};

createAdmin();
