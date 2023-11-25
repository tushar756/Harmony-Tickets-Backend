const Ticket = require("../model/ticket.js");
const Staff = require("../model/staff.js");
const moment = require('moment');
const escaleticket = async (req, res) => {
  try {
    const {
      ticketId,
      assignedBy,
      assignedTo,
      description,
      Bug_Status,
      priority,
      media_url,
    } = req.body;
    const ticket = await Ticket.findOne({
      ticketId,
    });

    // console.log(ticket);

    if (!ticket) {
      return res.send({
        error: true,
        message: "Ticket not found",
      });
    }

    if (ticket.currentAssignedTo.name !== assignedBy) {
      return res.send({
        error: true,
        message: "You are not allowed to assign this ticket",
      });
    }

    const assignedToUser = await Staff.findOne({
      name: assignedTo,
    });

    const assignedByUser = await Staff.findOne({
      name: assignedBy,
    });

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
      {ticketId }, // Using the unique identifier to match the specific document
      { $set: {currentAssignedTo:assignedToUser}}
    );
    console.log(newUser);
    ticket.transition.push({
      from: {
        ...newUser._doc,
        ...userObject,
        createdAt: moment().format('MM/DD/YYYY, h:mm:ss a')
      },
      to: assignedToUser,
    });

    await ticket.save();

    res.send({
      error: false,
      message: "Ticket assigned successfully",
      data: ticket,
    });
  } catch (err) {
    res.send({
      error: true,
      message: err.message,
    });
  }
};

const ticketHistory = async(req,res)=>{
  const id = req.params.id;
  const data = await Ticket.findOne({ticketId:id})
  if(!data){
    return res.send({
      error: true,
      message: "Ticket id not found ",
    })
  }
  res.status(201).send({
    error: false,
    message: "Ticket Data found successfully",
    data:data,
  });
  // res.status(201).json({data})
}

module.exports = { escaleticket,ticketHistory };
