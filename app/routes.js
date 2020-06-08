const express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require("path");

const wordlistPath = path.join(__dirname, `./game/wordfiles/`);
const files = fs.readdirSync(wordlistPath);

const { getStats } = require("./game/analytics");

router.get('/wordlists', (req, res) => {
  res.send(files);
});

router.get('/stats', async (req, res) => {
  const stats = await getStats(req.dbCollection);
  res.send(stats);
})

module.exports = router;
