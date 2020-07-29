const TOTAL_COMPLETE_QUERY = { type: "duet_total" };
const TOTAL_STARTS_QUERY = { type: "duet_starts" };
const WORDLIST_COUNT_QUERY = { type: "duet_wordlist" };
const PLAYERS_COUNT_QUERY = { type: "duet_players" };
const WINS_QUERY = { type: "duet_wins" };
const { N_GREEN_TILES } = require("../common/const").duet;

class GameStats {
  constructor() {
    this.turns = 0;
    
    this.timeInSec = 0;
    this.startTime = undefined;

    this.win = false;
    this.scoreTrend = [N_GREEN_TILES];
  }

  startGame() {
    this.startTime = new Date();
  }

  addTurn(score) {
    this.turns += 1;
    this.scoreTrend.push(score);
  }

  endGame(win) {
    this.timeInSec = (new Date() - this.startTime) / 1000;
    this.win = win;
  }
}

function incrementGameStarts(collection) {
  collection.findOneAndUpdate(
    TOTAL_STARTS_QUERY,
    {
      $inc: { count: 1 },
    },
    {
      new: true,
      upsert: true,
    }
  );
}

function incrementGameCount(collection) {
  collection.findOneAndUpdate(
    TOTAL_COMPLETE_QUERY,
    {
      $inc: { count: 1 },
    },
    {
      new: true,
      upsert: true,
    }
  );
}

function incrementWordlistCount(collection, wordlist) {
  collection.findOneAndUpdate(
    WORDLIST_COUNT_QUERY,
    {
      $inc: { [wordlist]: 1 },
    },
    {
      new: true,
      upsert: true,
    }
  );
}

function updateNumPlayerCount(collection, numPlayers) {
  collection.findOneAndUpdate(
    PLAYERS_COUNT_QUERY,
    {
      $inc: {
        count: 1,
        players: numPlayers,
      },
    },
    {
      new: true,
      upsert: true,
    }
  );
}

function updateWinCount(collection, win) {
  collection.findOneAndUpdate(
    WINS_QUERY,
    {
      $inc: {
        count: 1,
        wins: win ? 1 : 0,
      },
    },
    {
      new: true,
      upsert: true,
    }
  );
}

function saveGame(collection, numPlayers, wordlist, win) {
  if (wordlist === undefined) {
    wordlist = "custom";
  }
  incrementGameCount(collection);
  incrementWordlistCount(collection, wordlist);
  updateNumPlayerCount(collection, numPlayers);
  updateWinCount(collection, win);
}

async function getStats(collection) {
  const totalCountDoc = await collection.findOne(TOTAL_COMPLETE_QUERY);
  const gameStartsDoc = await collection.findOne(TOTAL_STARTS_QUERY);
  const wordlistDoc = await collection.findOne(WORDLIST_COUNT_QUERY);
  const playerCountDoc = await collection.findOne(PLAYERS_COUNT_QUERY);
  const winsDoc = await collection.findOne(WINS_QUERY);

  delete wordlistDoc?.["_id"];
  delete wordlistDoc?.["type"];

  return {
    totalGames: totalCountDoc?.count,
    gamesStarted: gameStartsDoc?.count,
    wordlistDistribution: wordlistDoc,
    averagePlayersPerGame: playerCountDoc?.players / playerCountDoc?.count,
    winPercent: winsDoc?.wins / winsDoc?.count,
  };
}

module.exports = {
  incrementGameStarts,
  saveGame,
  getStats,
  GameStats,
};