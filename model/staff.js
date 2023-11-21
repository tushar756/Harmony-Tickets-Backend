const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  // managerId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Manager",
  //   default: null,
  // },
  ticketId: {
    type: String,
    ref: "Ticket",
    default: null,
  },
});

const staff = mongoose.model("Staff", staffSchema);

module.exports = staff;
