const express = require("express");

const authRouter = express.Router();

const { signin } = require("../controller/auth");

authRouter.post("/signin", signin);

module.exports = authRouter;
