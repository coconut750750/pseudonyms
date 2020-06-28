const express = require("express");
const rateLimit = require("express-rate-limit");

const router = express.Router();
const fs = require('fs');
const path = require("path");

const wordlistPath = path.join(__dirname, `./common/wordfiles/`);
const files = fs.readdirSync(wordlistPath);

const { getStats } = require("./classic/analytics");

router.get('/wordlists', (req, res) => {
  res.send(files);
});

const feedbackLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 1 day window
  max: 3, // start blocking after 3 requests
  message: JSON.stringify({ message: "Too many feedback submissions from this IP, please try again tomorrow." }),
});

router.post('/feedback', feedbackLimiter, (req, res) => {
  const { text } = req.body;
  if (text.length > 0) {
    req.feedbackCollection.insertOne({
      text,
      time: new Date(),
    });
  }  
  res.send({});
});

router.get('/stats', async (req, res) => {
  const stats = await getStats(req.dbCollection);
  res.send(stats);
})

module.exports = router;
