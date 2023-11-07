// const {
//     createManager,
//     createStaff,
//     assignTicket,
//   } = require("../controllers/manager.js");

const Ticket = require("../model/ticket.js");

const Staff = require("../model/staff.js");

const Manager = require("../model/manager.js");
// manager id 654a2690393725642077a366
const createManager = async (req, res) => {
  try {
    // Extract manager data from the request body
    const { firstName, lastName, email, phone_number } = req.body;

    // Check if the manager with the given email or phone_number already exists
    const existingManager = await Manager.findOne({
      $or: [{ email }, { phone_number }],
    });
    if (existingManager) {
      return res.status(400).json({
        error: true,
        message: "Manager with the given email or phone_number already exists",
      });
    }

    // Create a new manager instance
    const manager = new Manager({
      firstName,
      lastName,
      email,
      phone_number,
    });

    // Save the manager to the database
    await manager.save();

    return res.status(201).json({
      error: false,
      data: manager,
      message: "Manager created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

const createStaff = async (req, res) => {
  try {
    // Extract staff data from the request body
    const { firstName, lastName, email, phone_number, managerId } = req.body;

    // Check if the staff member with the given email or phone_number already exists
    const existingStaff = await Staff.findOne({
      $or: [{ email }, { phone_number }],
    });
    if (existingStaff) {
      return res.status(400).json({
        error: true,
        message:
          "Staff member with the given email or phone_number already exists",
      });
    }

    // Create a new staff member instance
    const staffMember = new Staff({
      firstName,
      lastName,
      email,
      phone_number,
      managerId,
    });

    // Save the staff member to the database
    await staffMember.save();

    // Return a success response
    res.status(201).json({
      error: false,
      data: staffMember,
      message: "Staff member created successfully",
    });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

const assignTicket = async (req, res) => {
  try {
    const { staffId } = req.params;

    // Check if the staff member with the provided ID exists
    const staffMember = await Staff.findById(staffId);

    console.log(staffMember);

    if (!staffMember) {
      return res.status(404).json({ error: "Staff member not found" });
    }

    // Extract ticket data from the request body
    const { ticketId } = req.body;

    if (staffMember.tickedId) {
      return res
        .status(400)
        .json({ error: "Staff member is already assigned a ticket" });
    }

    // Create a new ticket instance and assign it to the staff member
    console.log(ticketId);
    const ticket = await Ticket.findById(ticketId);

    console.log(ticket);

    if (!ticket) {
      return res.status(400).json({
        error: true,
        message: "Ticket not found",
      });
    }
    const { priority, title, description, media_url } = ticket;

    const newTicket = await Ticket.create({
      priority,
      title,
      description,
      media_url,
      assignedTo: staffId,
    });

    // Return a success response
    res.status(201).json({
      error: false,
      data: newTicket,
      message: "Ticket created and assigned successfully",
    });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createManager,
  createStaff,
  assignTicket,
};
