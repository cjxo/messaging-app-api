const db = require("../db/query");

const root = (req, res) => {
  res.json({ message: "Welcome to /user" });
};

const getAll = async (req, res, next) => {
  try {
    const users = await db.user.getAllUsersWhoIsNotId(req.userId);
    console.log(users);
    res.json({ message: "Request Granted", users: users })
  } catch (err) {
    next(err);
  }
}

module.exports = {
  root,
  getAll,
};
