const express = require("express");
const { connectDB } = require("./config/database");
const { userServer } = require("./routes/userRoutes");
const userRouter = require('./routes/auth')
const profileRoute = require('./routes/profile')

// console.log(userRouter);
const cookieParser = require("cookie-parser");


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(userRouter)
app.use(profileRoute)
app.use(userServer);

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
