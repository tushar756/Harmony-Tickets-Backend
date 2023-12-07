const Ticket = require("../model/ticket.js");

const staffTicket = async (req, res) => {
  // console.log(req)
  try {
    const data = req.user;
    console.log(data._id);
    // const allticket = await Ticket.find({}).populate("currentAssignedTo");
    const allTicket = await Ticket.find({ currentAssignedTo: data._id}).populate("currentAssignedTo");

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
