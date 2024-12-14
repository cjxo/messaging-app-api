const express = require("express");
const user = require("../controllers/user");
const userRouter = express.Router();
const { verifyToken } = require("../util/token-helper.js");

userRouter.get("/", user.root);
userRouter.get("/get-all", verifyToken, user.getAll);

module.exports = userRouter;
