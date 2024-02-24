const express = require("express");

const staffRouter = express.Router();

// all ticket assoicated with the staff

const { staffTicket, counters, createReport, getAllReport, staffOpenTickets, staffResolveTickets, staffHighPriorityTickets, staffMidPriorityTickets, staffLowPriorityTickets } = require("../controller/staff.js");

staffRouter.get("/staffTickets", staffTicket);
staffRouter.post("/createReport", createReport);
staffRouter.get("/getAllReport", getAllReport);
staffRouter.get("/counts", counters);
staffRouter.get("/staffOpenTickets", staffOpenTickets);
staffRouter.get("/staffPendingTickets", staffOpenTickets);
staffRouter.get("/staffResolveTickets", staffResolveTickets);
staffRouter.get("/staffHighPriorityTickets", staffHighPriorityTickets);
staffRouter.get("/staffMidPriorityTickets", staffMidPriorityTickets);
staffRouter.get("/staffLowPriorityTickets", staffLowPriorityTickets);

module.exports = staffRouter;
