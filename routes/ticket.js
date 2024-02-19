const expore = require("express");
const Ticket = require("../model/ticket.js");
const Ticketrouter = expore.Router();
const { escaleticket, ticketHistory } = require("../controller/ticket.js");
const multer = require("multer");
const path = require("path");
const moment = require('moment')
const User = require('../model/user.js');
const fileUpload = require('express-fileupload');

// Middleware for handling file uploads
Ticketrouter.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
}));


Ticketrouter.get("/all", async (req, res) => {
  try {
    const allticket = await Ticket.find({}).populate("currentAssignedTo").populate("createdBy");
    const alltickets = await Ticket.find({}).populate("createdBy");
    return res.status(200).json({
      error: false,
      message: "All ticket",
      data: allticket,
    });
  } catch (err) {
    res.send("Error" + err);
  }
 
});
Ticketrouter.get("/statusCount", async (req, res) => {
  try {
    // Count tickets with different statuses
    const pendingCount = await Ticket.countDocuments({ Bug_Status: "Pending" });
    const resolvedCount = await Ticket.countDocuments({ Bug_Status: "Resolved" });
    const openCount = await Ticket.countDocuments({ Bug_Status: "Open" });
    const staffCount = await User.countDocuments({});
    
    // Calculate tickets pending for more than two days
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const pendingMoreThanTwoDaysCount = await Ticket.countDocuments({ 
      Bug_Status: "Pending",
      createdAt: { $lt: twoDaysAgo }
    });

    return res.status(200).json({
      error: false,
      message: "Ticket status counts",
      data: {
        pendingCount: pendingCount,
        resolvedCount: resolvedCount,
        openCount: openCount,
        pendingMoreThanTwoDaysCount: pendingMoreThanTwoDaysCount,
        staffCount
      },
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Internal Server Error",
      data: null
    });
  }
});


Ticketrouter.post("/esclate", escaleticket);
Ticketrouter.get("/ticketHistory/:id", ticketHistory);

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
