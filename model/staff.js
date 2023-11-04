const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
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

  phone_number: {
    type: Number,
    required: true,
    unique: true,
    trim: true,
  },
});

const staff = mongoose.model("Staff", staffSchema);

module.exports = staff;
