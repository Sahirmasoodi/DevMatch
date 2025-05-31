const express = require("express");
const bcrypt = require("bcrypt");
const {loginValidation} = require('../utils/validation')
const { UserModel } = require("../model/user");
const server = express();
server.use(express.json());

server.post('/login',async(req,res)=>{
    try {
      const user = await loginValidation(req)
      console.log(user);
      
       res.send('login successfull')
    } catch (err) {
        res.status(400).send(err.message)
    }
})
module.exports = server;
