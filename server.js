const express = require("express");

const { dbConnected } = require("./const/db");

const app = express();

dbConnected();

app.get("/", function (req, res) {
  res.send("Hello World!");
});
app.listen(8000, function () {
  console.log("Listening to Port 8000");
});
