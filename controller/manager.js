const Ticket = require("../model/ticket.js");
const User = require("../model/user.js");
const Joi = require("joi");

const createUser = async (req, res) => {
  console.log("object")
  try {
    const { error, value } = createUserValidation.validate(req.body);
    if(error){
      return res.status(400).json({
        error: true,
        message: error.message,
      })
    }

    const userExist = await User.findOne({ email: value.email });
    if (userExist) {
      return res.status(400).json({
        error: true,
        message: "Manager with the given email or phone_number already exists",
      });
    }
    const createUser = await User.create({ ...value });
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
    // Extract ticket data from the request body
    console.log(req.body)
    const {_id}= req.user
    console.log(_id)
    const { error, value } = createTicketValidation.validate(req.body);
    if(error){
      return res.status(400).json({
        error: false,
        message: error.message
      })
    }


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

    const staffMember = await User.findOne({ email: value.currentAssignedTo, role: "staff" });
    // const staffMember = await User.find({});
    console.log(staffMember)
    if(!staffMember) throw new Error("NO STAFF MEMBER")

    const createdTicket = await Ticket.create({ ...value, ticketId, currentAssignedTo: staffMember._id,createdBy:_id});
    // await User.updateOne({ _id: staffMember._id },{  $push: { assignedTickets: createdTicket._id} }).populate('assignedTickets').exec();
     await User.findByIdAndUpdate(
      staffMember._id,
      { $push: { assignedTickets: createdTicket._id } },
      { new: true }
    ).populate('assignedTickets').exec();

      




    // Return a success response
    res.status(201).json({
      error: false,
      data: createdTicket,
      message: "Ticket created successfully",
    });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

const updateStaff = async(req,res)=>{
  
}
const deleteStaff = async(req,res)=>{
const {email} = req.body
const existingStaff = await Staff.findOne({email})
if (!existingStaff) {
  return res.status(401).send({
    error:true,
    message:"You entered a Wrong id"
  })
}
const response = await Staff.findByIdAndDelete({_id:existingStaff._id})
res.status(201).send({data:response,
message:"Staff Deleted Succesfully"
})
}


const getAllStaff = async (req, res) => {
  try {
    const response = await User.find({ role: "staff" });
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


module.exports = {
  createUser,
  getAllStaff,
  createTicket,
  updateStaff,
  deleteStaff
};


// JOI VALIDATION

const createUserValidation = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid("manager", "staff").required()
})

const createTicketValidation = Joi.object({
  title: Joi.string().required(),
  media_url: Joi.string().required(),
  description: Joi.string().required(),
  priority: Joi.string().valid("High", "Mid", "Low").required(),
  // email: Joi.string(),
  Bug_Status:Joi.string().required(),
  currentAssignedTo:Joi.string().required()
})
