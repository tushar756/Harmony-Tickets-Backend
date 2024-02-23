// manager creation and manager ticket creation and staff creation and manager ticket assign

const { Router } = require("express");
const roleRouteAccess = require("../middleware/role_access.js");

const managerRoute = Router();


// just create manager and staff and ticket assign to staff

const {
  createUser,
  createTicket,
  updateStaff,
  deleteStaff,
  getAllStaff,
  createReport,
  escaleticket,
} = require("../controller/manager.js");

managerRoute.post("/create-user", createUser);
managerRoute.post("/update-staff", updateStaff);
managerRoute.post("/delete-staff", deleteStaff);
managerRoute.get("/getAllStaff", getAllStaff);
managerRoute.post("/create-ticket", createTicket);
managerRoute.post("/escalate-ticket", escaleticket);
managerRoute.post("/create-report", createReport);


module.exports = managerRoute;
