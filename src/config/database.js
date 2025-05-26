const mongoose = require("mongoose");
const url ="mongodb+srv://sahirmasoodi:8494076802sahir@cluster0.0tmv18j.mongodb.net/devMatch";

const connectDB = async () => {
  await mongoose.connect(url);
};

module.exports = {connectDB}