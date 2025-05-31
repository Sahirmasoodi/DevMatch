const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel } = require("../model/user");
const { signupValidation } = require("../utils/validation");
const server = express.Router();
server.use(express.json());
server.post("/signup", async (req, res) => {
  const { firstName, lastName, email, gender, age, password } = req.body;
  try {
    //VALIDATION
    signupValidation(req);
    // const requiredFields = ["firstName", "email", "password"];
    // const isValidRequest = requiredFields.every((field) =>
    //   req.body.hasOwnProperty(field)
    // );
    // if (!isValidRequest) {
    //   throw new Error("Bad request  missing required fields");
    // }


    // ENCRYPTING THE PASSWORD
    const encryptedPassword = await bcrypt.hash(password,10)


    // SAVING TO DB
    const userData = new UserModel({
      firstName,
      lastName,
      email,
      gender,
      age,
      password:encryptedPassword
    });
    await userData.save();
    res.send("user created successfully");
  } catch (err) {
    // console.log(err);

    res.send("Error " + err.message);
  }
});

module.exports = server;
