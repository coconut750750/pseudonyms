const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(parseInt(process.env.SALT));

async function addUser(collection, username, email, password) {
  const existing = await findUser(collection, username);
  if (existing !== null) {
    return undefined;
  }
  const passhash = bcrypt.hashSync(password, salt);
  await collection.insertOne({
    username,
    passhash,
    email,
    created: new Date(),
    ranking: 100,
    games: 0,
    wins: 0,
  });
  return await findUser(collection, username);
}

function validPassword(user, password) {
  return bcrypt.compareSync(password, user.passhash);
}

async function findUser(collection, username) {
  return await collection.findOne({ username });
}

function userSession(user) {
  return {
    username: user.username,
    email: user.email,
    created: user.created,
    ranking: user.ranking,
    games: user.games,
    wins: user.wins,
  }
}

module.exports = {
  addUser,
  validPassword,
  findUser,
}