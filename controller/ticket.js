const express = require('express');
const Ticket = require('../model/ticket.js');
const User = require('../model/user.js');
const moment = require('moment');
const fileUpload = require('express-fileupload');

const router = express.Router();

// Middleware for file uploads
router.use(fileUpload());

const escaleticket = async (req, res) => {
  
 
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

    if (!assignedBy || !description) {
      return res.status(400).json({
        error: true,
        message: 'All fields are required',
      });
    }

    let fileURL = '';
    if (req.files && req.files.file) {
      const uploadedFile = req.files.file;
      const fileName = `${ticketId}_${uploadedFile.name}`;

      // Move the file to the desired location
      await uploadedFile.mv(`uploads/${fileName}`);
      fileURL = `/uploads/${fileName}`;
    } else {
      console.error('No file selected');
    }

    const ticket = await Ticket.findOne({ ticketId });

    if (!ticket) {
      return res.status(404).json({
        error: true,
        message: 'Ticket not found',
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
        ...newUser._doc,
        ...userObject,
        createdAt: moment().format('lll'),
      },
      to: assignedToUser,
      fileURL: fileURL,
    });

    await ticket.save();

    res.status(200).json({
      error: false,
      message: 'Ticket assigned successfully',
      data: ticket,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message,
    });
  }
};

const ticketHistory = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Ticket.findOne({ ticketId: id });
    if (!data) {
      return res.status(404).json({
        error: true,
        message: 'Ticket id not found',
      });
    }
    res.status(200).json({
      error: false,
      message: 'Ticket Data found successfully',
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message,
    });
  }
};

module.exports = { escaleticket, ticketHistory };
