const express = require("express");

const staffRouter = express.Router();

// all ticket assoicated with the staff

const { staffTicket } = require("../controller/staff.js");

staffRouter.get("/staffTickets", staffTicket);

module.exports = staffRouter;
