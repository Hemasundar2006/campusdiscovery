const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          // 1. Try to find user by Google ID
          let user = await User.findOne({ googleId: profile.id });
          
          const email = profile.emails?.[0]?.value;
          const isAdminEmail = email === 'nagarjunafamilypk@gmail.com';

          // 2. If user exists by Google ID, ensure admin role if email matches
          if (user) {
            if (isAdminEmail && user.role !== 'admin') {
              user.role = 'admin';
              await user.save();
            }
            return done(null, user);
          }

          // 3. Try to find user by Email (if signing in with Google for the first time)
          user = await User.findOne({ email });
          if (user) {
            user.googleId = profile.id;
            if (!user.avatar) user.avatar = profile.photos?.[0]?.value || '';
            if (isAdminEmail) user.role = 'admin';
            await user.save();
            return done(null, user);
          }

          // 4. Register new user
          user = await User.create({
            name: profile.displayName,
            email,
            username: email, // satisfiies old DB index
            googleId: profile.id,
            avatar: profile.photos?.[0]?.value || '',
            role: isAdminEmail ? 'admin' : 'student',
          });

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
} else {
  console.warn('⚠️ Google OAuth keys missing in .env - Google Login will be disabled.');
}
