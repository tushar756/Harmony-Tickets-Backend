const express = require("express");

const managerRoute = require("./manager.js");

const router = express.Router();

router.use("/manager", managerRoute);

module.exports = router;
