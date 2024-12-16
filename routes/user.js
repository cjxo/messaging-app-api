const express = require("express");
const user = require("../controllers/user");
const userRouter = express.Router();
const { verifyToken } = require("../util/token-helper.js");

userRouter.get("/", verifyToken, user.getProfile);
userRouter.get("/get-all", verifyToken, user.getAll);
userRouter.post("/update", verifyToken, user.updateCredential);

module.exports = userRouter;
