const bcrypt = require("bcryptjs");
const db = require("../db/query");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const root = (req, res) => {
  res.json({ message: "Hello from /auth" });
};

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#client_error_responses
const signUp = async (req, res, next) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;
    
    const uniqueEmail = await db.user.emailIsUnique(username);
    if (!uniqueEmail) {
      res.status(400).json({
        message: "Email already exists"
      });
      return;
    }

    const uniqueUsername = await db.user.usernameIsUnique(username);

    if (!uniqueUsername) {
      res.status(400).json({
        message: "Username already exists"
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.insert(firstName, lastName, username, email, hashedPassword);
    
    res
      .status(201)
      .json({
        message: "Successfully created. Please sign in."
      });
  } catch (err) {
    next(err);
  }
};

const signIn = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await db.user.getFromUsername(username);
    if (!user) {
      res
        .status(400)
        .json({
          message: "User does not exist."
        });

      return;
    }

    const matched = await bcrypt.compare(password, user.hashed_password);

    if (!matched) {
      res
        .status(403)
        .json({
          message: "Passwords do not match.",
        });

      return;
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_ACCESS, {
      expiresIn: "15m"
    });

    res
      .cookie("token", token, {
        maxAge: 15 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        httpOnly: true,
      })
      .json({
        message: "Successfully signed in."
      });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  root,
  signUp,
  signIn
};
