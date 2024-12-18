const db = require("../db/query");

const getProfile = async (req, res, next) => {
  try {
    const result = await db.user.getFromId(req.userId);
    const profile = {
      ...result,
      hashed_password: undefined,
    };

    console.log(profile);
    res.json({ message: "Request Granted.", profile });
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    const users = await db.user.getAllUsersWhoIsNotId(req.userId);
    res.json({ message: "Request Granted.", users });
  } catch (err) {
    next(err);
  }
};

const updateCredential = async (req, res, next) => {
  try {
    let err = "";
    console.log(req.body.type);
    switch (req.body.type) {
      case "username": {
        err = await db.user.tryUpdateUsername(req.userId, req.body.value);
      } break;

      case "first_name": {
        await db.user.updateFirstName(req.userId, req.body.value);
      } break;

      case "last_name": {
        await db.user.updateLastName(req.userId, req.body.value);
      } break;

      case "email": {
        err = await db.user.tryUpdateEmail(req.userId, req.body.value);
      } break;

      default: {
        err = "Invalid update request.";
      } break;
    }

    if (err) {
      res.status(409).json({ message: err });
    } else {
      res.json({ message: "Request Granted" });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  getAll,
  updateCredential,
};
