const express = require("express");
const { dbConnected } = require("./const/db");
require("dotenv").config();
const cors = require('cors')
const fileUpload = require('express-fileupload');


const app = express();


dbConnected();

app.use(express.json());
app.use(cors({
  origin: "*",
  origin:["https://ticket-frontend-qglq.vercel.app/"],
  methods:["POST","GET","DELETE","PATCH","PUT","OPTIONS"],
  credentials:true,
}))
app.get("/",(req,res)=>{
  res.send("hiii")
})
// app.use(cors({
//   origin: 'http://localhost:5173',
// }));
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
