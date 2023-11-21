const Ticket = require("../model/ticket.js");
const Staff = require("../model/staff.js");

const escaleticket = async (req, res) => {
  try {
    const {
      ticketId,
      assignedBy,
      assignedTo,
      description,
      status,
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
    if (status) {
      userObject.status = status;
      ticket.status = status;
    }
    if (priority) {
      userObject.priority = priority;
      ticket.priority = priority;
    }
    if (media_url) {
      userObject.media_url = media_url;
      ticket.media_url = media_url;
    }

    const newUser = {
      ...assignedByUser,
    };

    console.log(newUser);
    ticket.transition.push({
      from: {
        ...newUser._doc,
        ...userObject,
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

module.exports = { escaleticket };
