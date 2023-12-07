// const mongoose = require("mongoose");

// // Define the Manager schema
// const managerSchema = new mongoose.Schema({
//   firstName: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   lastName: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//   },
//   password: {
//     type: String,
//   },
//   phone_number: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//   },

//   assignedTickets: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Ticket",
//       default: [],
//     },
//   ],
// },{
//   collection: "manager",
// });

// // Create a Manager model
// const Manager = mongoose.model("Manager", managerSchema);

// module.exports = Manager;
