const express = require("express");
const message = require("../controllers/message");
const { verifyToken } = require("../util/token-helper");
const messageRouter = express.Router();

messageRouter.get("/", message.root);
messageRouter.post("/add-user", verifyToken, message.addUser);

module.exports = messageRouter;
