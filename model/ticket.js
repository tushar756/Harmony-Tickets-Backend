const mongoose = require("mongoose");
const Staff = require("./staff.js");
const moment = require('moment');
const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  priority: {
    type: String,
    enum: ["High", "Mid", "Low"],
    required: true,
  },

  Bug_Status: {
    type: String,
    enum: ["Open", "Resolved", "Pending"],
    // default: "open"
  },
  department: {
    type: String,
    enum: ["Harmony Pharmacy", "Ebenezer Pharmacy", "Both"],
    // default: "open"
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  currentAssignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  // media_url: {
  //   type: String,
  // },
  ticketId: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  transition: [],
  createdAt:{
    type: String, 
    default: () => moment().format('MM/DD/YYYY, h:mm:ss a')
    }
}, {
  collection: "tickets",
  timestamps: true,
  versionKey: false,
});

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
