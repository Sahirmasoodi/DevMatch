const express = require("express");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middleware/auth");
const profileRoute = express.Router();
const validator = require("validator");

profileRoute.get("/profile", userAuth, async (req, res) => {
  const user = res.user;
  try {
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

profileRoute.patch("/editProfile", userAuth, async (req, res) => {
  const { firstName, lastName, gender, age, about, imageUrl } = req.body;
  const looggedinUser = res.user;
  try {
    const allowedUpdates = [
      "firstName",
      "lastName",
      "gender",
      "age",
      "about",
      "imageUrl",
    ];
    const isUpdateAllowed = Object.keys(req.body).every((key) =>
      allowedUpdates.includes(key)
    );

    if (imageUrl && !validator.isURL(imageUrl)) {
      throw new Error("invalid URL");
    }
    if (about && about.length > 10) {
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
      throw new Error("Bad request");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

profileRoute.patch("/changePassword", userAuth, async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  const loggedinUser = res.user;
  try {
    passwordValidation(req)
    
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = profileRoute;
