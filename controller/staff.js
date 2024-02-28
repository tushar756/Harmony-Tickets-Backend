const Report = require("../model/reports.js");
const Ticket = require("../model/ticket.js");
const User = require("../model/user.js");
const bcrypt = require("bcrypt");
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
 
    

    
    const pendingCount = await Ticket.countDocuments({ currentAssignedTo: data._id, Bug_Status: "Pending" });
    const resolvedCount = await Ticket.countDocuments({ currentAssignedTo: data._id, Bug_Status: "Resolved" });
    const openCount = await Ticket.countDocuments({ currentAssignedTo: data._id, Bug_Status: "Open" });
    const HighPriorityCount = await Ticket.countDocuments({  currentAssignedTo: data._id,priority: "High" });
    const LowPriorityCount = await Ticket.countDocuments({ currentAssignedTo: data._id, priority: "Low" });
    const MidPriorityCount = await Ticket.countDocuments({  currentAssignedTo: data._id,priority: "Mid" });
    

    return res.status(200).json({
      error: false,
      message: "Ticket status counts",
      data: {
        pendingCount,
        resolvedCount,
        openCount,
       HighPriorityCount,
       LowPriorityCount,
       MidPriorityCount
      },
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Internal Server Error",
      data: null
    });
  }
};
const staffOpenTickets = async (req, res) => {
  try {
    // Assuming 'status' is the field representing the status of the ticket
    const data = req.user;
    const openTickets = await Ticket.find({ currentAssignedTo: data._id, Bug_Status: "Open" })
      .populate("currentAssignedTo")
      .populate("createdBy");

    return res.status(200).json({
      error: false,
      message: "Open tickets",
      data: openTickets,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Error retrieving open tickets",
      data: null,
    });
  }
}
const staffPendingTickets = async (req, res) => {
  try {
    // Assuming 'status' is the field representing the status of the ticket
    const data = req.user;
    const openTickets = await Ticket.find({ currentAssignedTo: data._id, Bug_Status: "Pending" })
      .populate("currentAssignedTo")
      .populate("createdBy");

    return res.status(200).json({
      error: false,
      message: "Open tickets",
      data: openTickets,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Error retrieving open tickets",
      data: null,
    });
  }
}
const staffResolveTickets = async (req, res) => {
  try {
    // Assuming 'status' is the field representing the status of the ticket
    const data = req.user;
    const openTickets = await Ticket.find({ currentAssignedTo: data._id, Bug_Status: "Resolve" })
      .populate("currentAssignedTo")
      .populate("createdBy");

    return res.status(200).json({
      error: false,
      message: "Open tickets",
      data: openTickets,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Error retrieving open tickets",
      data: null,
    });
  }
}
const staffHighPriorityTickets = async (req, res) => {
  try {
    // Assuming 'status' is the field representing the status of the ticket
    const data = req.user;
    const openTickets = await Ticket.find({ currentAssignedTo: data._id, priority: "High" })
      .populate("currentAssignedTo")
      .populate("createdBy");

    return res.status(200).json({
      error: false,
      message: "Open tickets",
      data: openTickets,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Error retrieving open tickets",
      data: null,
    });
  }
}
const staffMidPriorityTickets = async (req, res) => {
  try {
    // Assuming 'status' is the field representing the status of the ticket
    const data = req.user;
    const openTickets = await Ticket.find({ currentAssignedTo: data._id, priority: "High" })
      .populate("currentAssignedTo")
      .populate("createdBy");

    return res.status(200).json({
      error: false,
      message: "Open tickets",
      data: openTickets,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Error retrieving open tickets",
      data: null,
    });
  }
}
const staffLowPriorityTickets = async (req, res) => {
  try {
    // Assuming 'status' is the field representing the status of the ticket
    const data = req.user;
    const openTickets = await Ticket.find({ currentAssignedTo: data._id, priority: "Low" })
      .populate("currentAssignedTo")
      .populate("createdBy");

    return res.status(200).json({
      error: false,
      message: "Open tickets",
      data: openTickets,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Error retrieving open tickets",
      data: null,
    });
  }
}
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
const getRaisedTicketsHistory = async (req, res) => {
  try {
    const _id = req.user
    const allticket = await Ticket.find({createdBy:_id}).populate("currentAssignedTo").populate("createdBy");
    // const allticket = await Ticket.find({currentAssignedTo:_id}).populate("currentAssignedTo");
    // const allticket = await Ticket.find({currentAssignedTo:_id})
    // const alltickets = await Ticket.find({}).populate("createdBy");
    return res.status(200).json({
      error: false,
      message: "All ticket",
      data: allticket,  
      id:req.user
    });
  } catch (err) {
    res.send("Error" + err);
  }
}
const updateStaff = async (req, res) => {
  const { email, firstName, lastName, password, role } = req.body;

  try {
    // Find the existing staff member by email
    const existingStaff = await User.findOne({ email });

    // If staff member doesn't exist, return an error
    if (!existingStaff) {
      return res.status(404).json({
        error: true,
        message: "Staff member not found",
      });
    }

    // Update the staff member's data
    existingStaff.firstName = firstName;
    existingStaff.lastName = lastName;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      existingStaff.password = hashedPassword;
    }
    existingStaff.role = role;

    // Save the updated staff member
    await existingStaff.save();

    // Return success response
    res.status(200).json({
      error: false,
      message: "Staff member updated successfully",
      data: existingStaff,
    });
  } catch (error) {
    // Handle any errors that occur during the update process
    console.error("Error updating staff member:", error);
    res.status(500).json({
      error: true,
      message: "An error occurred while updating staff member",
    });
  }
};
const getAllStaffEbenezerTicket = async (req, res) => {
  try {
    const data = req.user;
 
    const allTicket = await Ticket.find({
      currentAssignedTo: data._id,
      department: "Ebenezer Pharmacy"
      // $or: [
      //   { department: "Ebenezer Pharmacy" }
      // ]
    }).populate("currentAssignedTo")
      .populate("createdBy");

    res.status(200).json({
      error: false,
      data: allTicket,
      message: "All tickets associated with the staff in Ebenezer Pharmacy department",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message,
    });
  }
};
const getAllStaffHarmonyTicket = async (req, res) => {
  try {
    const data = req.user;
 
    const allTicket = await Ticket.find({
      currentAssignedTo: data._id,
      // department: "Ebenezer Pharmacy"
      $or: [
        { department: "Ebenezer Pharmacy" },
        { department: "Both" }
      ]
    }).populate("currentAssignedTo")
      .populate("createdBy");

    res.status(200).json({
      error: false,
      data: allTicket,
      message: "All tickets associated with the staff in Ebenezer Pharmacy department",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message,
    });
  }
};

module.exports = { staffTicket,counters,createReport,getAllReport,getAllStaffEbenezerTicket,getAllStaffHarmonyTicket,updateStaff,staffOpenTickets,staffPendingTickets,staffResolveTickets,staffHighPriorityTickets,staffMidPriorityTickets,staffLowPriorityTickets,getRaisedTicketsHistory };
