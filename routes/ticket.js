const expore = require("express");
const Ticket = require("../model/ticket.js");
const Ticketrouter = expore.Router();
const { escaleticket, ticketHistory } = require("../controller/ticket.js");
Ticketrouter.get("/all", async (req, res) => {
  try {
    // const allticket = await Ticket.aggregate([
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "currentAssignedTo",
    //       foreignField: "_id",
    //       as: "user",
    //     },
    //   },
    //   {
    //     $addFields: {
    //       user: { $arrayElemAt: ["$user", 0] },
    //     },
    //   },
    // ]);

    const allticket = await Ticket.find({}).populate("currentAssignedTo");

    return res.status(200).json({
      error: false,
      message: "All ticket",
      data: allticket,
    });
  } catch (err) {
    res.send("Error" + err);
  }
});

Ticketrouter.post("/esclate", escaleticket);
Ticketrouter.get("/ticketHistory/:id", ticketHistory);

module.exports = Ticketrouter;
