const express = require("express");
const { UserModel } = require("../model/user");
const server = express.Router();
server.use(express.json());
server.delete('/deleteUser',async(req,res)=>{
  const id = req.body?.id
  try {
    const deletedUser =  await  UserModel.findByIdAndDelete(id)
    if (!deletedUser) {
        res.status(404).send('user not found')
    }
    res.send('user deleted successfully')
    
  } catch (err) {
    res.status(402).send("something went wrong")
  }
})

module.exports = server