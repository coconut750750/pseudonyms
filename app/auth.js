const express = require("express");
const router = express.Router();

const passport = require('passport');
const sendmail = require('sendmail')({ silent: true });

const { userSession, addUser, setPassword, generateResetToken, completeReset } = require('./db/users');
const { checkName } = require('./utils');

const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const validateEmail = (req, res, next) => {
  if (!emailRegex.test(req.body.email)) {
    return res.status(400).send({ message: 'Invalid email.' });
  }
  next();
}

module.exports = collection => {
  const authSuccess = (req, res) => {
    req.session.cookie.originalMaxAge = 30 * 24 * 60 * 60 * 1000; // Expires in 30 days
    res.send({ user: userSession(req.user) });
  }

  router.post('/register', validateEmail, async (req, res) => {
    let { username, password, email } = req.body;

    try {
      checkName(username);
      const newUser = await addUser(collection, username, email, password);

      req.login(newUser, err => {
        if (err) {
          res.status(400).send({ message: 'Login failed. Try again.' });
        } else {
          authSuccess(req, res);
        }
      });
    } catch (err) {
      res.status(400).send({ message: err.message, });
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
      return res.send({ valid: true, message: "Success" });
    }
    return res.status(400).send({
       message: "Not logged in.",
    });
  });

  router.post('/forgot', validateEmail, async (req, res) => {
    let { email } = req.body;
    try {
      const uuid = await generateResetToken(collection, email);
      sendmail({
        from: 'no-reply@pseudonyms.com',
        to: email,
        subject: 'Pseudonyms Password Reset',
        html: `Reset your password here: https://pseudonyms.brandon-wang.com/forgot/${uuid}. Link expires in 30 minutes.`,
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
      return res.status(400).send({
         message: err.message,
      });
    }
    res.send({ valid: true, message: "Success" });
  });

  router.post('/profile', (req, res) => {
    res.send({
      user: req.user,
    });
  });

  router.post('/user', (req, res) => {
    res.send({
      username: req.user?.username,
    });
  });

  return router;
};
