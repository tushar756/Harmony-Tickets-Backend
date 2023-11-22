const express = require("express");

const managerRoute = require("./manager.js");
const Ticketrouter = require("./ticket.js");
const staffRouter = require("./staff.js");
const authRouter = require("./auth.js");
const router = express.Router();

router.use("/manager", managerRoute);
router.use("/ticket", Ticketrouter);
router.use("/staff", staffRouter);
router.use("/auth", authRouter);

module.exports = router;
