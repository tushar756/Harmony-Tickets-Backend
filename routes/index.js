const express = require("express");

const managerRoute = require("./manager.js");
const Ticketrouter = require("./ticket.js");
const staffRouter = require("./staff.js");
const router = express.Router();

router.use("/manager", managerRoute);
router.use("/ticket", Ticketrouter);
router.use("/staff", staffRouter);

module.exports = router;
