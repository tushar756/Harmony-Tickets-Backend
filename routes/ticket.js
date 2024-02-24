const expore = require("express");
const Ticket = require("../model/ticket.js");
const Ticketrouter = expore.Router();
const { escaleticket, ticketHistory, statusCount, getAllTicket, getAllOpenTickets, getAllPendingTickets, getAllResolvedTickets, getAllHighPriorityickets, getAllMidPriorityickets, getAllLowPriorityickets, getRaisedTicketsHistory, getAllEbenezerTicket, getAllHarmonyTicket } = require("../controller/ticket.js");
const multer = require("multer");
const path = require("path");
const moment = require('moment')
const User = require('../model/user.js');
const fileUpload = require('express-fileupload');

// Middleware for handling file uploads
Ticketrouter.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
}));


Ticketrouter.get("/all", getAllTicket);
Ticketrouter.get("/statusCount", statusCount);
Ticketrouter.post("/esclate", escaleticket);
Ticketrouter.get("/ticketHistory/:id", ticketHistory);
Ticketrouter.get("/raisedTicketHistory", getRaisedTicketsHistory);
Ticketrouter.get("/totalOpenTickets", getAllOpenTickets);
Ticketrouter.get("/totalPendingTickets", getAllPendingTickets);
Ticketrouter.get("/totalResolvedTickets", getAllResolvedTickets);
Ticketrouter.get("/totalHighPriorityTickets", getAllHighPriorityickets);
Ticketrouter.get("/totalMidPriorityTickets", getAllMidPriorityickets);
Ticketrouter.get("/totalLowPriorityTickets", getAllLowPriorityickets);
Ticketrouter.get("/getAllEbenezerTickets", getAllEbenezerTicket);
Ticketrouter.get("/getAllHarmonyTickets", getAllHarmonyTicket);










// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");  
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
//   },
// });

// Configure multer with storage and file size limit
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
// });

 
// Ticketrouter.post("/esclateaaass", upload.single("file"), async (req, res) => {
//   console.log(req.body); // Check the form data received

//   try {
//     const {
//       ticketId,
//       assignedBy,
//       currentAssignedTo,
//       description,
//       Bug_Status,
//       priority,
//       media_url,
//     } = req.body;

//     if (!assignedBy || !description) {
//       return res.send({
//         error: true,
//         message: "All fields are required",
//       });
//     }

//     let fileURL = "";
//     if (req.files) {
//       // Check if a file was uploaded
//       const uploadedFile = req.files.file;
//       const fileName = `${ticketId}_${uploadedFile.originalname}`;

//       // Move the file to the desired location
//       await uploadedFile.mv(`uploads/${fileName}`);
//       fileURL = `/uploads/${fileName}`;
//     } else {
//       console.error("No file selected");
//     }

//     const ticket = await Ticket.findOne({
//       ticketId,
//     });

//     if (!ticket) {
//       return res.send({
//         error: true,
//         message: "Ticket not found",
//       });
//     }

//     const assignedToUser = await User.findOne({
//       email: currentAssignedTo,
//     });

//     const assignedByUser = await User.findOne({
//       name: assignedBy,
//     });

//     let userObject = {
//       description,
//       Bug_Status,
//       priority,
//       media_url,
//       ticketId,
//     };

//     const result = await Ticket.updateOne(
//       { ticketId },
//       { $set: { currentAssignedTo: assignedToUser } }
//     );

//     ticket.transition.push({
//       from: {
//         email: assignedBy,
//         ...assignedByUser._doc,
//         ...userObject,
//         createdAt: moment().format("lll"),
//       },
//       to: assignedToUser,
//       fileURL: fileURL,
//     });

//     await ticket.save();

//     res.send({
//       error: false,
//       message: "Ticket assigned successfully",
//       data: ticket,
//     });
//   } catch (err) {
//     res.send({
//       error: true,
//       message: err.message,
//     });
//   }
// });



 
module.exports = Ticketrouter;
