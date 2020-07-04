let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;

let { userSession, findByUsername, validPassword } = require('./db/users');

module.exports = collection => {
  passport.use('local-login', new LocalStrategy(
    async (username, password, done) => {
      const user = await findByUsername(collection, username);
      if (user === null) {
        return done(null, false);
      } else if (!validPassword(user, password)) {
        return done(null, false);
      }
      return done(null, user);
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.username);
  });

  passport.deserializeUser(async function(username, done) {
    const user = await findByUsername(collection, username);  
    done(null, userSession(user));
  });
}
