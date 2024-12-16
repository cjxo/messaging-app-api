const express = require("express");
const message = require("../controllers/message");
const { verifyToken } = require("../util/token-helper");
const messageRouter = express.Router();

messageRouter.get("/", message.root);
messageRouter.post("/add-user", verifyToken, message.addUser);
messageRouter.get("/get-all", verifyToken, message.getAll);
messageRouter.post("/send-to", verifyToken, message.sendTo);

module.exports = messageRouter;
