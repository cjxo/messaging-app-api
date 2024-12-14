const express = require("express");
const authRouter = express.Router();
const auth = require("../controllers/auth.js");
const { verifyToken } = require("../util/token-helper.js");

authRouter.get("/", auth.root);
authRouter.post("/sign-up", auth.signUp);
authRouter.post("/sign-in", auth.signIn);
authRouter.post("/sign-out", auth.signOut);
authRouter.get("/check-auth", verifyToken, auth.checkAuth);

module.exports = authRouter;
