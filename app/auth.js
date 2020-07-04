const express = require("express");
const router = express.Router();

let passport = require('passport');

let { addUser } = require('./db/users');

const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const validateEmail = (req, res, next) => {
  if (!emailRegex.test(req.body.email)) {
    return res.send({ valid: false, message: 'Invalid email.' });
  }
  next();
}

module.exports = collection => {
  const authSuccess = (req, res) => {
    req.session.cookie.originalMaxAge = 10 * 1000; // Expires in 10 sec
    res.send({
      valid: true,
      message: "success",
    });
  }

  router.post('/register', validateEmail, async (req, res) => {
    let { username, password, email } = req.body;

    const newUser = await addUser(collection, username, email, password);
    if (newUser === undefined) {
      return res.send({ valid: false, message: 'Username taken.' });
    }

    req.login(newUser, err => {
      if (err) {
        res.send({ valid: false, message: 'Login failed. Try again. ' });
      } else {
        authSuccess(req, res);
      }
    });
  });

  router.post('/login',passport.authenticate('local-login', {}), authSuccess);

  router.post('/valid', (req, res) => {
    res.send({
      valid: req.user !== undefined,
    });
  });

  return router;
};
