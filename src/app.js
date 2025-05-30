const express = require("express");
const { connectDB } = require("./config/database");
const { UserModel } = require("./model/user");
const {signup,updateUser,deleteUser} = require('./routes')

const app = express();
app.use(express.json());
app.use(signup)
app.use(updateUser)
app.use(deleteUser)

// app.post("/signup", async (req, res) => {
//   const user = new UserModel(req.body);
//   try {
//     await user.save();
//     res.send("user created success");
//   } catch (err) {
//     res.send("some error occurerd at server . " + err.message);
//   }
// });

app.get("/getUsers", async (req, res) => {
  const firstName = req.body?.firstName;
  try{
  const user = await UserModel.find({firstName:firstName })
    // if (user) {
    //   res.send(user)
    // }
    if (user.length > 0) {
      res.send(user)
    }
    else{
      res.send('user not found')
    }
  }
  catch(err){
    res.status(402).send('something went wrong')
  }
});

// app.delete('/deleteUser',async (req,res)=>{
//   const id = req.body?.id
//   try{
//     await UserModel.findByIdAndDelete(id)
//     res.send('user deleted successfully')
//   }
//   catch(err){
//     res.send('some error')
//   }
// })

app.patch('/updateByEmail',async (req,res)=>{
  const email = req.body?.email
  const data = req.body
  // console.log(email);
  
  try{
    await UserModel.findOneAndUpdate({email:email},data)
    res.send('user updated via email')
  }
  catch(err){
   res.send('something went wrong')
  }
})

// app.patch('/updateUser',async (req,res)=>{
  
//   const id = req.body?.id
//   const data = req.body
  
  
//   try{
//    const user =  await UserModel.findByIdAndUpdate(id,data,{returnDocument:'after'})
//    res.send('user updated successfully')
//   //  console.log(user);
   
//   }
//   catch(err){
//     res.send('something went wrong')
//   }
// })
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
