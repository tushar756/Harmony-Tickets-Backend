const mongoose = require("mongoose");

require("dotenv").config();
console.log(process.env.URI);
exports.dbConnected = async () => {
  // await mongoose.connect()
  await mongoose
    .connect(process.env.URI)
    .then(() => {
      console.log("db Connected succesfully");
    })
    .catch((error) => {
      console.log(error.message);
      process.exit(1);
    });
};
