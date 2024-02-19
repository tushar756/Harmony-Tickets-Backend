const express = require("express");

const staffRouter = express.Router();

// all ticket assoicated with the staff

const { staffTicket, counters, createReport, getAllReport } = require("../controller/staff.js");

staffRouter.get("/staffTickets", staffTicket);
staffRouter.get("/counts", counters);
staffRouter.post("/createReport", createReport);
staffRouter.get("/getAllReport", getAllReport);

module.exports = staffRouter;
