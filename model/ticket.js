const mongoose = require("mongoose");
const Staff = require("./staff.js");

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
    required: true,
  },
  currentAssignedTo: {},
  media_url: {
    type: String,
  },
  ticketId: {
    type: Number,
    required: true,
  },
  transition: [],
});

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
