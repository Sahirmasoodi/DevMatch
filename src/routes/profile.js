const express = require("express");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middleware/auth");
const profileRoute = express.Router();
const validator = require("validator");
const { passwordValidation } = require("../utils/validation");

profileRoute.get("/user/profile", userAuth, async (req, res) => {
  const user = res.user;
  try {
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

profileRoute.patch("/editProfile", userAuth, async (req, res) => {
  const { firstName, lastName, gender, age, about, imageUrl,skills } = req.body;
  const looggedinUser = res.user;
  try {
    const allowedUpdates = [
      "firstName",
      "lastName",
      "gender",
      "age",
      "about",
      "imageUrl",
      "skills"
    ];
    const isUpdateAllowed = Object.keys(req.body).every((key) =>
      allowedUpdates.includes(key)
    );
    // console.log(Object.keys(req.body));
    
    if (imageUrl && !validator.isURL(imageUrl)) {
      throw new Error("invalid URL");
    }
    if (about && about.length > 150) {
      throw new Error("max length of 100 chars for about");
    }
    
    if (isUpdateAllowed) {
      Object.keys(req.body).forEach(
        (key) => (looggedinUser[key] = req.body[key])
      );
      await looggedinUser.save();
      res.send({
        data: looggedinUser,
        message: "user updated successfully",
        status: 200,
      });
    } else {
      throw new Error("update not allowed");
    }
  } catch (error) {
   res.status(400).send({ message: error.message })
  }
});

profileRoute.patch("/changePassword", userAuth, async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  const loggedinUser = res.user;
  try {
   await passwordValidation(req,loggedinUser)
    const newEncryptedPassword =await bcrypt.hash(newPassword,10)
    loggedinUser.password = newEncryptedPassword
   await loggedinUser.save()
    res.send('password updated successfully')
    
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = profileRoute;
