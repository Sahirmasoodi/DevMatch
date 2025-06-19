const express = require("express");
const { connectDB } = require("./config/database");
const { userServer } = require("./routes/userRoutes");
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const profileRoute = require('./routes/profile')
const connectionRouter = require("./routes/request");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(authRouter)
app.use(userRouter)
app.use(profileRoute)
app.use(userServer);
app.use(connectionRouter);


connectDB()
  .then(() => {
    console.log("connected db successfully");
    app.listen(7777, () => {
      console.log("connection succesfull on port 7777");
    });
  })
  .catch(() => {
    console.log("db server down");
  });
