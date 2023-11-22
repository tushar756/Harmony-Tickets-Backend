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
    const { name, email, password } = req.body;

    // Check if the staff member with the given email or phone_number already exists
    const existingStaff = await Staff.findOne({
      email,
    });
    if (existingStaff) {
      return res.status(400).json({
        error: true,
        message: "Staff member with the given email already exists",
      });
    }

    // Create a new staff member instance
    const staffMember = new Staff({
      name,
      email,
      password,
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
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

const createTicket = async (req, res) => {
  try {
    // Extract ticket data from the request body
    const { title, media_url, description, priority, assignedTo,Bug_Status} = req.body;
    console.log(req.body)
    // random four digit number
    const ticketId = Math.floor(1000 + Math.random() * 9000);

    // Check if the ticket with the given ticketId already exists
    const existingTicket = await Ticket.findOne({
      ticketId,
    });
    if (existingTicket) {
      return res.status(400).json({
        error: true,
        message: "Ticket with the given ticketId already exists",
      });
    }

    const staffMember = await Staff.findOne({
      name:assignedTo
    });
    console.log(staffMember);
    staffMember.tickets = ticketId;

    await staffMember.save();

    // Create a new ticket instance
    const ticket = new Ticket({
      title,
      media_url,
      description,
      priority,
      ticketId,
      currentAssignedTo: staffMember,
      Bug_Status
    });

    // Save the ticket to the database
    await ticket.save();

    // Return a success response
    res.status(201).json({
      error: false,
      data: ticket,
      message: "Ticket created successfully",
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
  // assignTicket,
  createTicket,
};
