const expore = require("express");
const Ticket = require("../model/ticket.js");
const Ticketrouter = expore.Router();
const { escaleticket } = require("../controller/ticket.js");
Ticketrouter.get("/all", async (req, res) => {
  try {
    const allticket = await Ticket.find();
    res.json(allticket);
  } catch (err) {
    res.send("Error" + err);
  }
});

Ticketrouter.post("/esclate", escaleticket);

module.exports = Ticketrouter;
