const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
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
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["manager", "staff"],
      default: "staff",
    },
    assignedTickets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
        default: [],
      },
    ],
  },
  {
    collection: "user",
  }
);

// Create a Manager model
const User = mongoose.model("user", userSchema);

module.exports = User;
