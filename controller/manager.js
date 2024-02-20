const user = require("../const/user.js");
const Ticket = require("../model/ticket.js");
const User = require("../model/user.js");
const Joi = require("joi");
const moment = require("moment");
const createUser = async (req, res) => {
  const bcrypt = require('bcrypt');
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
    const createUser = await User.create({ ...value, password: hashedPassword });
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
    console.log("object11")
    console.log(req.body)
    // console.log(value.priority)
    console.log("object12")
    const { _id } = req.user;
   const value= req.body
    // const { error, value } = createTicketValidation.validate(req.body);
    // if (error) {
    //   return res.status(400).json({
    //     error: false,
    //     message: error.message,
    //   });
    // }

    const ticketId = Math.floor(1000 + Math.random() * 9000);

    const existingTicket = await Ticket.findOne({
      ticketId,
    });
    if (existingTicket) {
      return res.status(400).json({
        error: true,
        message: "Ticket with the given ticketId already exists",
      });
    }
 
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

  
    const { description, Bug_Status, priority, media_url } = createdTicket;
    const newObj = {
      description,
      Bug_Status,
      priority,
      media_url,
      ticketId,
      ...user._doc,
      createdAt: moment().format('lll')
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

const updateStaff = async (req, res) => {};
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
    console.log(req.user)
   const value= req.body
 

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
 createReport
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
  // media_url: Joi.string().required(),
  description: Joi.string().required(),
  priority: Joi.string().valid("High", "Mid", "Low").required(),
  Bug_Status: Joi.string().required(),
  currentAssignedTo: Joi.string().required(),
  file: Joi.string().required().regex(/\.(pdf|doc|docx|jpg|png)$/i) // Validate file extension 
});
