const TOTAL_COMPLETE_QUERY = { type: "classic_total" };
const TOTAL_STARTS_QUERY = { type: "classic_starts" };
const WORDLIST_COUNT_QUERY = { type: "classic_wordlist" };
const PLAYERS_COUNT_QUERY = { type: "classic_players" };
const MATURE_QUERY = { type: "classic_mature" };
const { RED, BLUE, N_START_TILES, N_OTHER_TILES } = require("../common/const").classic;

class GameStats {
  constructor() {
    this.matured = false,
    this.turns = 0;
    
    this.startTeam = undefined;
    this.timeInSec = 0;
    this.startTime = undefined;

    this.firstTeamWin = false;
    this.firstTeamScoreTrend = [N_START_TILES];
    this.secondTeamScoreTrend = [N_OTHER_TILES];
  }

  startGame(startTeam) {
    this.startTeam = startTeam;
    this.startTime = new Date();
  }

  addTurn(redScore, blueScore) {
    this.turns += 1;
    if (this.startTeam === RED) {
      this.firstTeamScoreTrend.push(redScore);
      this.secondTeamScoreTrend.push(blueScore);
    } else {
      this.firstTeamScoreTrend.push(blueScore);
      this.secondTeamScoreTrend.push(redScore);      
    }
  }

  endGame(matured, winner) {
    this.timeInSec = (new Date() - this.startTime) / 1000;
    this.matured = matured;
    this.firstTeamWin = this.startTeam === winner;
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

function addMatureGame(collection, matureStats) {
  let inc = {
    count: 1,
    totalTurnsTaken: matureStats.turns,
    totalTimeTaken: matureStats.timeInSec,
    firstTeamWins: matureStats.firstTeamWin ? 1 : 0,
    secondTeamWins: matureStats.firstTeamWin ? 0 : 1,
  };

  for (let [k, v] of matureStats.firstTeamScoreTrend.entries()) {
    inc[`firstTeamScoreTrend.${k}`] = v;
  }

  for (let [k, v] of matureStats.secondTeamScoreTrend.entries()) {
    inc[`secondTeamScoreTrend.${k}`] = v;
  }

  collection.findOneAndUpdate(
    MATURE_QUERY,
    {
      $inc: inc
    },
    {
      new: true,
      upsert: true,
    }
  );
}

function saveGame(collection, numPlayers, wordlist, matureStats) {
  if (wordlist === undefined) {
    wordlist = "custom";
  }
  incrementGameCount(collection);
  incrementWordlistCount(collection, wordlist);
  updateNumPlayerCount(collection, numPlayers);
  if (matureStats.matured) {
    addMatureGame(collection, matureStats);
  }
}

async function getStats(collection) {
  const totalCompleteDoc = await collection.findOne(TOTAL_COMPLETE_QUERY);
  const gameStartsDoc = await collection.findOne(TOTAL_STARTS_QUERY);
  const wordlistDoc = await collection.findOne(WORDLIST_COUNT_QUERY);
  const playerCountDoc = await collection.findOne(PLAYERS_COUNT_QUERY);
  const matureGamesDoc = await collection.findOne(MATURE_QUERY);

  const m = matureGamesDoc?.count;
  delete wordlistDoc?.["_id"];
  delete wordlistDoc?.["type"];

  return {
    totalGames: totalCompleteDoc?.count,
    gamesStarted: gameStartsDoc?.count,
    wordlistDistribution: wordlistDoc,
    averagePlayersPerGame: playerCountDoc?.players / playerCountDoc?.count,
    matureGames: {
      count: m,
      firstTeamWinPercent: matureGamesDoc?.firstTeamWins / m,
      secondTeamWinPercent: matureGamesDoc?.secondTeamWins / m,
      averageTimePerGame: matureGamesDoc?.totalTimeTaken / m,
      averageTurnsPerGame: matureGamesDoc?.totalTurnsTaken / m,
      firstTeamScoreTrend: Object.values(matureGamesDoc?.firstTeamScoreTrend).sort().reverse().map(s => s / m),
      secondTeamScoreTrend: Object.values(matureGamesDoc?.secondTeamScoreTrend).sort().reverse().map(s => s / m),
    }
  };
}

module.exports = {
  incrementGameStarts,
  saveGame,
  getStats,
  GameStats,
};