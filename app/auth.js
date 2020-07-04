const express = require("express");
const router = express.Router();

const passport = require('passport');
const sendmail = require('sendmail')({ silent: true });

const { userSession, addUser, setPassword, generateResetToken, completeReset } = require('./db/users');

const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const validateEmail = (req, res, next) => {
  if (!emailRegex.test(req.body.email)) {
    return res.send({ valid: false, message: 'Invalid email.' });
  }
  next();
}

module.exports = collection => {
  const authSuccess = (req, res) => {
    req.session.cookie.originalMaxAge = 30 * 24 * 60 * 60 * 1000; // Expires in 30 days
    res.send({
      valid: true,
      user: userSession(req.user),
    });
  }

  router.post('/register', validateEmail, async (req, res) => {
    let { username, password, email } = req.body;

    try {
      const newUser = await addUser(collection, username, email, password);

      req.login(newUser, err => {
        if (err) {
          res.send({ valid: false, message: 'Login failed. Try again. ' });
        } else {
          authSuccess(req, res);
        }
      });
    } catch (err) {
      res.send({ valid: false, message: err.message });
    }
  });

  router.post('/login', passport.authenticate('local-login', {}), authSuccess);

  router.post('/logout', (req, res) => {
    if (req.user !== undefined) {
      req.logout();
    }
    res.send({ message: "Success" });
  });

  router.post('/change', async (req, res) => {
    if (req.user !== undefined) {
      let { password } = req.body;
      await setPassword(collection, req.user.username, password);
      res.send({ valid: true, message: "Success" });
    }
    res.send({ valid: false, message: "Not logged in." });
  });

  router.post('/forgot', validateEmail, async (req, res) => {
    let { email } = req.body;
    try {
      const uuid = await generateResetToken(collection, email);
      sendmail({
        from: 'no-reply@pseudonyms.com',
        to: email,
        subject: 'Pseudonyms Password Reset',
        html: `Reset your password here: ${uuid}`,
      });
    } catch (err) {
    }

    res.send({ valid: true, message: "Success" });
  });

  router.post('/forgot_return', async (req, res) => {
    let { resetToken, password } = req.body;
    try {
      await completeReset(collection, resetToken, password);
    } catch (err) {
      return res.send({ valid: false, message: err.message });
    }
    res.send({ valid: true, message: "Success" });
  });

  router.post('/user', (req, res) => {
    res.send({
      valid: req.user !== undefined,
      user: req.user,
    });
  });

  return router;
};
