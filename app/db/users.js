const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(parseInt(process.env.SALT));
const { v4: uuidv4 } = require('uuid');

const PASSWORD_RESET_EXPIRY = 30 * 60 * 1000;
const INITIAL_RANKING = 1000;

function userSession(user) {
  return {
    username: user.username,
    email: user.email,
    created: user.created,
    ranking: user.ranking,
    games: user.games,
    wins: user.wins,
  };
}

function userProfile(user) {
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

async function addUser(collection, username, email, password) {
  const existingUsername = await findByUsername(collection, username);
  if (existingUsername !== null) {
    throw new Error("Username taken.");
  }
  const existingEmail = await findByEmail(collection, email);
  if (existingEmail !== null) {
    throw new Error("Email taken.");
  }

  const passhash = bcrypt.hashSync(password, salt);
  await collection.insertOne({
    username,
    passhash,
    email,
    created: new Date(),
    ranking: INITIAL_RANKING,
    games: 0,
    wins: 0,
  });
  return await findByUsername(collection, username);
}

function validPassword(user, password) {
  return bcrypt.compareSync(password, user.passhash);
}

async function findByUsername(collection, username) {
  return await collection.findOne({ username });
}

async function findByEmail(collection, email) {
  return await collection.findOne({ email });
}

async function setPassword(collection, username, password) {
  const passhash = bcrypt.hashSync(password, salt);
  await collection.findOneAndUpdate(
    { username },
    {
      $set: { passhash },
    }
  );
}

async function generateResetToken(collection, email) {
  const existingEmail = await findByEmail(collection, email);
  if (existingEmail === null) {
    throw new Error("Invalid Email.");
  }

  let currentDate = new Date();
  let expireDate = new Date();
  expireDate.setTime(currentDate.getTime() + PASSWORD_RESET_EXPIRY);
  let uuid = uuidv4();

  await collection.findOneAndUpdate(
    { email },
    {
      $set: {
        rtoken: uuid,
        expiry: expireDate,
      },
    }
  );

  return uuid;
}

async function completeReset(collection, resetToken, password) {
  if (resetToken === undefined) {
    throw new Error("Invalid reset link.")   
  }

  const user = await collection.findOne({ rtoken: resetToken });
  if (user === null) {
    throw new Error("Invalid reset link.")
  }
  const now = new Date();
  const expiry = new Date(user.expiry);

  let update = {
    $unset: {
      rtoken: "",
      expiry: "",
    }
  };

  if (now <= expiry) {
    const passhash = bcrypt.hashSync(password, salt);
    update = { ...update, $set: { passhash } };
  }

  await collection.findOneAndUpdate(
    { rtoken: resetToken }, update,
  );

  if (now > expiry) {
    throw new Error("Reset link expired.")
  }
}

async function completeGame(collection, username, win, newRank) {
  await collection.findOneAndUpdate(
    { username },
    {
      $inc: {
        wins: win ? 1 : 0,
        games: 1,
      },
      $set: {
        ranking: newRank,
      }
    },
  );
}

module.exports = {
  userSession,
  userProfile,
  addUser,
  validPassword,
  findByUsername,
  setPassword,
  generateResetToken,
  completeReset,
  completeGame,
}