const index = require("../controllers/index.js");
const express = require("express");
const indexRouter = express.Router();

indexRouter.get("/", index.root);

module.exports = indexRouter;
