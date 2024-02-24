const express = require("express");

const managerRoute = require("./manager.js");
const Ticketrouter = require("./ticket.js");
const staffRouter = require("./staff.js");
const authRouter = require("./auth.js");
const router = express.Router();
const protect = require("../middleware/auth.js");
const roleRouteAccess = require("../middleware/role_access.js");
// import { getAllStaff } from "../controller/manager.js";
router.use("/manager",protect,roleRouteAccess,  managerRoute);
 
router.use("/ticket",protect, Ticketrouter);
router.use("/staff", protect, staffRouter); 
// router.use("/staff",  staffRouter);
router.use("/auth", authRouter);
// router.get("getAllStaff", getAllStaff)

module.exports = router;
