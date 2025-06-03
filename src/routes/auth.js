const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { loginValidation, signupValidation } = require("../utils/validation");
const { UserModel } = require("../model/user");
const authRouter = express.Router();



authRouter.post("/login", async (req, res) => {
  try {
    const user = await loginValidation(req);
    const token = jwt.sign({ _id: user._id }, "8494076802!aB");
    res.cookie("token", token);
    res.send("login successfull");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/signup", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    gender,
    age,
    password,
    about,
    imageUrl,
    skills,
  } = req.body;
  try {
    //VALIDATION
    signupValidation(req);

    // ENCRYPTING THE PASSWORD
    const encryptedPassword = await bcrypt.hash(password, 10);

    // SAVING TO DB
    const userData = new UserModel({
      firstName,
      lastName,
      email,
      gender,
      age,
      password: encryptedPassword,
      about,
      imageUrl,
      skills,
    });
    await userData.save();
    res.send("user created successfully");
  } catch (err) {
    res.send("Error " + err.message);
  }
});

module.exports = authRouter