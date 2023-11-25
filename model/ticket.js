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
    enum: ["open", "close/resoved", "pending"],
    // default: "open"
  },
  currentAssignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  media_url: {
    type: String,
  },
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
