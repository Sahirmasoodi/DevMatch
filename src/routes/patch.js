const express = require("express");
const { UserModel } = require("../model/user");
const server = express.Router();
server.patch("/updateUser/:id", async (req, res) => {
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
    const isupdateAllowed = Object.keys(data).every((k)=>allowedUpdateFields.includes(k))
    if (!isupdateAllowed) {
     throw new Error("Bad Request");
    }
    const updatedData =  await UserModel.findByIdAndUpdate(userId ,data,{returnDocument:'before'});
    res.send('user updated successfully')
    // console.log(updatedData);
    
  } catch (err) {
    res.status(400).send( err?.message);
  }
});

module.exports = server