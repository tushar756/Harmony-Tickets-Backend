const express = require("express");

const { dbConnected } = require("./const/db");

require("dotenv").config();
const cors = require('cors')
const app = express();

const router = require("./routes/index.js");

dbConnected();

app.use(express.json());
app.use(cors())
app.use("/api", router);

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.listen(8080, function () {
  console.log("Listening to Port 8080");
});
