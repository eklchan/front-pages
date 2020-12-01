const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');

const config = require('./config');
const googleClientID = config.clientID;
const googleClientSecret = config.clientSecret;

const User = require('./server/models/User');

passport.serializeUser((user, done) => {
  done(null, user.googleId);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findOne({ googleId: id });
  done(null, user.googleId);
});

passport.use(
  new Strategy(
    {
      clientID: googleClientID,
      clientSecret: googleClientSecret,
      callbackURL: '/auth/google/callback',
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        return done(null, existingUser);
      }

      const user = await User.create({
        googleId: profile.id,
        username: profile.displayName,
        email: profile._json.email
      });

      done(null, user);
    }
  )
);
