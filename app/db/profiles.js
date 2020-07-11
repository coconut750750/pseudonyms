const INITIAL_RANKING = 1000;

function newProfile(username, passhash, email) {
  return {
    username,
    passhash,
    email,
    created: new Date(),
    ranking: INITIAL_RANKING,
    games: 0,
    wins: 0,
  }
}

function formatProfile(user) {
  const now = new Date();
  return {
    username: user.username,
    email: user.email,
    age: `${Math.round((now - (new Date (user.created)))/(1000 * 60 * 60 * 24))} days`,
    ranking: user.ranking,
    games: user.games,
    wins: user.wins,
  }
}

async function userProfile(collection, username) {
  const user = await collection.findOne({ username });
  return formatProfile(user);
}

module.exports = {
  newProfile,
  userProfile,
}