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
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.send(user);
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
    const savedUser = await userData.save();
    const token = await savedUser.generateToken(); // generateToken() is defined as model in UserModel
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 36000000),
    });
    res.send(savedUser);
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  // res.cookie("token",null,{
  //   expires:new Date(Date.now())
  // });
  res.clearCookie("token");

  res.status(200).json({ message: "Logout successful" });
});

module.exports = authRouter;
