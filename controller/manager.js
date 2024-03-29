const user = require("../const/user.js");
const Ticket = require("../model/ticket.js");
const User = require("../model/user.js");
const Joi = require("joi");
const moment = require("moment");
const bcrypt = require("bcrypt");



const createUser = async (req, res) => {
  try {
    const { error, value } = createUserValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: true,
        message: error.message,
      });
    }

    const userExist = await User.findOne({ email: value.email });
    if (userExist) {
      return res.status(400).json({
        error: true,
        message: "Manager with the given email or phone_number already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(value.password, 10);
    const createUser = await User.create({
      ...value,
      password: hashedPassword,
    });
    return res.status(201).json({
      error: false,
      data: createUser,
      message: "User created successfully",
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
    console.log(req.body);

    const { _id } = req.user;
    // const value = req.body;
    const { error, value } = createTicketValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: false,
        message: error.message,
      });
    }
    
    let ticketId;
    let existingTicket;

    do {
        ticketId = Math.floor(1000 + Math.random() * 9000);
        existingTicket = await Ticket.findOne({ ticketId });
    } while (existingTicket);


    const staffMember = await User.findOne({
      email: value.currentAssignedTo,
      // role: "staff",
    });

    if (!staffMember) throw new Error("NO STAFF MEMBER");

    const createdTicket = await Ticket.create({
      ...value,
      ticketId,
      currentAssignedTo: staffMember._id,
      createdBy: _id,
    });

    const user = await User.findOne({
      _id,
    });

    const { description, Bug_Status, priority, media_url,department } = createdTicket;
    const newObj = {
      department,
      description,
      Bug_Status,
      priority,
      media_url,
      ticketId,
      ...user._doc,
      createdAt: moment().format("lll"),
    };

    createdTicket.transition.push({
      from: newObj,
      to: staffMember,
    });

    await createdTicket.save();

    await User.findByIdAndUpdate(
      staffMember._id,
      { $push: { assignedTickets: createdTicket._id } },
      { new: true }
    )
      .populate("assignedTickets")
      .exec();

    res.status(201).json({
      error: false,
      data: createdTicket,
      message: "Ticket created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
const escaleticket = async (req, res) => {
  try {
    const { _id } = req.user;
    const {
      ticketId,
      assignedBy,
      currentAssignedTo,
      description,
      Bug_Status,
      priority,
      media_url,
    } = req.body;

    if (!assignedBy || !description) {
      return res.status(400).json({
        error: true,
        message: "All fields are required",
      });
    }

    let fileURL = "";
    if (req.files && req.files.file) {
      const uploadedFile = req.files.file;
      const fileName = `${ticketId}_${uploadedFile.name}`;

      // Move the file to the desired location
      await uploadedFile.mv(`uploads/${fileName}`);
      fileURL = `/uploads/${fileName}`;
    } else {
      console.error("No file selected");
    }

    const ticket = await Ticket.findOne({ ticketId });

    if (!ticket) {
      return res.status(404).json({
        error: true,
        message: "Ticket not found",
      });
    }

    const assignedToUser = await User.findOne({ email: currentAssignedTo });
    const assignedByUser = await User.findOne({ name: assignedBy });

    let userObject = {};

    if (description) {
      userObject.description = description;
      ticket.description = description;
    }
    if (Bug_Status) {
      userObject.Bug_Status = Bug_Status;
      ticket.Bug_Status = Bug_Status;
    }
    if (priority) {
      userObject.priority = priority;
      ticket.priority = priority;
    }
    if (media_url) {
      userObject.media_url = media_url;
      ticket.media_url = media_url;
    }
    if (ticketId) {
      userObject.ticketId = ticketId;
      ticket.ticketId = ticketId;
    }

    const newUser = {
      ...assignedByUser,
    };

    const result = await Ticket.updateOne(
      { ticketId },
      { $set: { currentAssignedTo: assignedToUser } }
    );

    ticket.transition.push({
      from: {
        email: assignedBy,
        ...newUser,
        ...userObject,
        firstName: assignedByUser.firstName,
        lastName: assignedByUser.lastName,
        createdAt: moment().format("lll"),
      },
      to: assignedToUser,
      fileURL: fileURL,
    });

    await ticket.save();

    res.status(200).json({
      error: false,
      message: "Ticket assigned successfully",
      data: ticket,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message,
    });
  }
};
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
      existingStaff.password = password;
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
const deleteStaff = async (req, res) => {
  const { email } = req.body;
  const existingStaff = await User.findOne({ email });
  if (!existingStaff) {
    return res.status(401).send({
      error: true,
      message: "You entered a Wrong id",
    });
  }
  const response = await User.findByIdAndDelete({ _id: existingStaff._id });
  res
    .status(201)
    .send({ data: response, message: "Staff Deleted Succesfully" });
};
const getAllStaff = async (req, res) => {
  try {
    // console.log()
    const response = await User.find({});
    res.status(200).json({
      error: false,
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};
const createReport = async (req, res) => {
  try {
    const { _id } = req.user;
    console.log(req.user);
    const value = req.body;

    const createdTicket = await Report.create({
      ...value,
    });

    await createdTicket.save();

    res.status(201).json({
      error: false,
      data: createdTicket,
      message: "Ticket created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

module.exports = {
  createUser,
  getAllStaff,
  createTicket,
  updateStaff,
  deleteStaff,
  createReport,
  escaleticket,
};

const createUserValidation = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid("manager", "staff").required(),
});
   

const createTicketValidation = Joi.object({
  title: Joi.string().required(),
  media_url: Joi.string(),
  description: Joi.string().required(),
  department:Joi.string().required().valid("Harmony Pharmacy", "Ebenezer Pharmacy", "Both"),
  priority: Joi.string().valid("High", "Mid", "Low").required(),
  Bug_Status: Joi.string().required(),
  currentAssignedTo: Joi.string().required(),
  // file: Joi.string().required().regex(/\.(pdf|doc|docx|jpg|png)$/i), 
})
;
