const express = require("express");
const { dbConnected } = require("./const/db");
require("dotenv").config();
const cors = require('cors')
const fileUpload = require('express-fileupload');


const app = express();


dbConnected();

app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: true }));
const router = require("./routes/index.js");
app.use("/api", router);
app.use(fileUpload());
app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.listen(8080, function () {
  console.log("Listening to Port 8080");
});
