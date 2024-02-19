const mongoose = require("mongoose");
const Staff = require("./staff.js");
const moment = require('moment');
const reportSchema = new mongoose.Schema({
 
  description: {
    type: String,
    required: true,
    trim: true,
  },
  createdBy:{
    type: String,
    required: true,
    trim: true,
  },
  createdAt:{
    type: String, 
    default: () => moment().format('MM/DD/YYYY, h:mm:ss a')
    }
});

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
