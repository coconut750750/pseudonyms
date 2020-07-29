// july 29 2020

require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.PSEUDO_MONGO_URI, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

statsCollection = db.collection("stats");

// MIGRATION

async function migrate() {
  const TOTAL_COMPLETE_QUERY = { type: "total" };
  const TOTAL_STARTS_QUERY = { type: "starts" };
  const WORDLIST_COUNT_QUERY = { type: "wordlist" };
  const PLAYERS_COUNT_QUERY = { type: "players" };
  const MATURE_QUERY = { type: "mature" };

  completeDoc = await statsCollection.findOne(TOTAL_COMPLETE_QUERY);
  playerDoc = await statsCollection.findOne(PLAYERS_COUNT_QUERY);

  await statsCollection.findOneAndUpdate(
    TOTAL_COMPLETE_QUERY,
    { $set: { type: "classic_total" } }
  );

  await statsCollection.findOneAndUpdate(
    TOTAL_STARTS_QUERY,
    { $set: { type: "classic_starts" } }
  );

  await statsCollection.findOneAndUpdate(
    WORDLIST_COUNT_QUERY,
    { $set: { type: "classic_wordlist" } }
  );

  await statsCollection.findOneAndUpdate(
    PLAYERS_COUNT_QUERY,
    { 
      $set: { 
        type: "classic_players",
        players: playerDoc.count,
        count: completeDoc.count,
      }
    }
  );

  await statsCollection.findOneAndUpdate(
    MATURE_QUERY,
    { $set: { type: "classic_mature" } }
  );
}

migrate().then(() => process.exit());