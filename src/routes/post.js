const express = require("express");
const { UserModel } = require("../model/user");
const { signupValidation } = require("../utils/validation");
const server = express.Router();
server.use(express.json());
server.post("/signup", async (req, res) => {
  const { firstName, lastName, email, gender, age, password } = req.body;
  // console.log(req.body);
  try {
    signupValidation(req);

    // const requiredFields = ["firstName", "email", "password"];
    // const isValidRequest = requiredFields.every((field) =>
    //   req.body.hasOwnProperty(field)
    // );
    // if (!isValidRequest) {
    //   throw new Error("Bad request  missing required fields");
    // }
    const userData = new UserModel({
      firstName,
      lastName,
      email,
      gender,
      age,
      password,
    });
    await userData.save();
    res.send("user created successfully");
  } catch (err) {
    console.log(err);

    res.status(400).send("Error " + err.message);
  }
});

module.exports = server;
