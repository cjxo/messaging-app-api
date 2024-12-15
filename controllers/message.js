const db = require("../db/query.js");

const root = (req, res) => {
  res.json({ message: "Hello from /message" });
};

const addUser = async (req, res, next) => {
  try {
    const user0 = req.userId;
    const user1 = req.body.userId;

    if (user0 === user1) {
      return res.status(400).json({ message: "user0 should not be equal to user1." });
    }

    await db.message.addUser(user0, user1);

    res.status(201).json({ message: "Successfully added user to messages." })
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    const userId = req.userId;
    const result = await db.message.getMessagedUsersFromID(userId);

    res.json({
      message: "Request Granted.",
      users: result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  root,
  addUser,
  getAll,
};
