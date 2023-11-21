const mongoose = require("mongoose");
const Staff = require("./staff.js");

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  media_url: {
    type: String,
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
  currentAssignedTo: {},
  ticketId: {
    type: Number,
    required: true,
  },
  status: {
    type: Number,
    default: 0, // 0 pending 1 resolve
  },
  transition: [],
});

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
