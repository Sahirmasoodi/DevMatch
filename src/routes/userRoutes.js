const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/user");
const { userAuth } = require("../middleware/auth");
const userServer = express.Router();
// userServer.use(express.json());

userServer.get("/profile", userAuth, async (req, res) => {
  const user = res.user;
  try {
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

userServer.delete("/deleteUser", userAuth, async (req, res) => {
  const { id } = req.body;
  try {
    if (!id) {
      throw new Error("something went wrong");
    }
    const deletedUser = await UserModel.findByIdAndDelete(id);
    if (!deletedUser) {
      res.status(404).send("user not found");
    }
    res.send("user deleted successfully");
  } catch (err) {
    res.status(402).send("something went wrong");
  }
});

userServer.patch("/updateUser/:id", userAuth, async (req, res) => {
  const data = req.body;
  const userId = req.params?.id;
  //   console.log(userId);

  try {
    const allowedUpdateFields = [
      "firstName",
      "lastName",
      "password",
      "imageUrl",
      "about",
    ];
    const isupdateAllowed = Object.keys(data).every((k) =>
      allowedUpdateFields.includes(k)
    );
    if (!isupdateAllowed) {
      throw new Error("Bad Request");
    }
    const updatedData = await UserModel.findByIdAndUpdate(userId, data, {
      returnDocument: "before",
    });
    res.send("user updated successfully");
    // console.log(updatedData);
  } catch (err) {
    res.status(400).send(err?.message);
  }
});

userServer.get("/getUsers", async (req, res) => {
  try {
    const users = await UserModel.find({});

    if (!users) {
      throw new Error("data not found");
    }
    res.send(users);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

userServer.patch("/updateByEmail", userAuth, async (req, res) => {
  const email = req.body?.email;
  const data = req.body;
  // console.log(email);

  try {
    await UserModel.findOneAndUpdate({ email: email }, data);
    res.send("user updated via email");
  } catch (err) {
    res.send("something went wrong");
  }
});
module.exports = { userServer };
