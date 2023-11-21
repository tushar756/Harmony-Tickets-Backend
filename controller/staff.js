const Ticket = require("../model/ticket.js");

const staffTicket = async (req, res) => {
  try {
    const { email } = req.params;

    const allTicket = await Ticket.find({ assignedTo: email });

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

module.exports = { staffTicket };
