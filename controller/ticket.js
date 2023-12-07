const Ticket = require("../model/ticket.js");
const User = require('../model/user.js');
const moment = require('moment');
const escaleticket = async (req, res) => {
  // console.log(req.body)
  try {
    const {
      ticketId,
      assignedBy,
      currentAssignedTo,
      description,
      Bug_Status,
      priority,
      media_url,
    } = req.body;

    if (!ticketId) {
      return res.send({
        error: true,
        message: "Ticket id is required",
      });
    }

    if (
      !assignedBy ||
      !assignedTo ||
      !description ||
      !Bug_Status ||
      !priority ||
      !media_url
    ) {
      return res.send({
        error: true,
        message: "All fields are required",
      });
    }

    const ticket = await Ticket.findOne({
      ticketId,
    });

    console.log(ticket);

    if (!ticket) {
      return res.send({
        error: true,
        message: "Ticket not found",
      });
    } 

    // if (ticket.currentAssignedTo.name !== assignedBy) {
    //   return res.send({
    //     error: true,
    //     message: "You are not allowed to assign this ticket",
    //   });
    // }
  console.log("above")
    const assignedToUser = await User.findOne({
      email: currentAssignedTo,
    });
    console.log(assignedToUser)


    const assignedByUser = await User.findOne({
      name: assignedBy,
    });
    console.log(assignedByUser)
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
      {ticketId },
      { $set: {currentAssignedTo:assignedToUser}}
    );
    console.log(newUser);
    ticket.transition.push({
      from: {
        ...newUser._doc,
        ...userObject,
        createdAt: moment().format("MM/DD/YYYY, h:mm:ss a"),
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

const ticketHistory = async (req, res) => {
  const id = req.params.id;
  const data = await Ticket.findOne({ ticketId: id });
  if (!data) {
    return res.send({
      error: true,
      message: "Ticket id not found ",
    });
  }
  res.status(201).send({
    error: false,
    message: "Ticket Data found successfully",
    data: data,
  });
  // res.status(201).json({data})
};

module.exports = { escaleticket, ticketHistory };
