const Report = require("../model/reports.js");
const Ticket = require("../model/ticket.js");
const User = require("../model/user.js");

const staffTicket = async (req, res) => {
  
  try {
    const data = req.user;
 
    // const allticket = await Ticket.find({}).populate("currentAssignedTo");
    const allTicket = await Ticket.find({ currentAssignedTo: data._id}).populate("currentAssignedTo").populate("createdBy");

    res.send({
      error: false,
      data: allTicket,
      message: "All ticket assoicated with the staff",
    });
  } catch (err) {
    res.send({
      error: true,
      message: err.message,
    });
  }
};



const counters = async (req, res) => {
  try {
    const data = req.user; // Assuming req.user contains the staff member's information
    if (!data) {
      res.json({
        message: "Your error"
      });
      return; // Add return statement to exit the function early
    }

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const staffCount = await User.countDocuments({});
    const pendingCount = await Ticket.countDocuments({ currentAssignedTo: data._id, Bug_Status: "Pending" });
    const resolvedCount = await Ticket.countDocuments({ currentAssignedTo: data._id, Bug_Status: "Resolved" });
    const openCount = await Ticket.countDocuments({ currentAssignedTo: data._id, Bug_Status: "Open" });
    const openSinceTwoDaysCount = await Ticket.countDocuments({
      currentAssignedTo: data._id,
      Bug_Status: "Open",
      createdAt: { $lte: twoDaysAgo }
    });

    return res.status(200).json({
      error: false,
      message: "Ticket status counts",
      data: {
        Pending: pendingCount,
        Resolved: resolvedCount,
        Open: openCount,
        OpenSinceLastTwoDays: openSinceTwoDaysCount,
        staffCount
      }
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Internal Server Error",
      data: null
    });
  }
};
const createReport = async (req, res) => {
  try {
    console.log("insede ")
    const { _id } = req.user;
 
    const user = await User.findById({_id})
    
   const value= req.body
   
    const createdTicket = await Report.create({
      ...value,
      createdBy:user.firstName +" "+ user.lastName
    });
 
    await createdTicket.save();

    res.status(201).json({
      error: false,
      data: createdTicket,
      message: "Report Submitted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

const getAllReport = async (req,res)=>{
  try {
   
 
    const data = await Report.find({})
    
 

    res.status(201).json({
      error: false,
      data,
      message: "Data fetched Succesfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
}

module.exports = { staffTicket,counters,createReport,getAllReport };
