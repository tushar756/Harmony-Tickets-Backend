// manager creation and manager ticket creation and staff creation and manager ticket assign

const { Router } = require("express");

const managerRoute = Router();

// just create manager and staff and ticket assign to staff

const {
  createManager,
  createStaff,
  createTicket,
} = require("../controller/manager.js");

managerRoute.post("/create-manager", createManager);

managerRoute.post("/create-staff", createStaff);

managerRoute.post("/create-ticket", createTicket);

module.exports = managerRoute;
