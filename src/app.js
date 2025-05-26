const express = require("express");
const { connectDB } = require("./config/database");
const { UserModel } = require("./model/user");
const app = express();
app.use(express.json())
app.post("/signup", (req, res) => {
  console.log(req.body);
  
 const user = new UserModel(req.body)
 try{
   user.save()
   res.send('user created success')
 }
 catch(err){
  res.send('some error occurerd at server')
 }

});

connectDB()
  .then(() => {
    console.log("connected db successfully");
    app.listen(7777, () => {
      console.log("connection succesfull on port 7777");
    });
  })
  .catch(() => {
    console.log("something went wrong");
  });
