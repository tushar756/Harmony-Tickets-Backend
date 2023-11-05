const mongoose = require("mongoose");

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
  assignDate: {
    type: Date,
    default: null,
  },
  expiryDate: {
    type: Date,
    default: null,
  },
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
    default: null,
  },

  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manager",
    default: null,
  },
});

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
