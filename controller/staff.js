const Ticket = require("../model/ticket.js");

const staffTicket = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const allTicket = await Ticket.find({ currentAssignedTo: id });

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
