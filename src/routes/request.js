const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequestModel = require("../model/connectionRequest");
const { UserModel } = require("../model/user");
const connectionRouter = express.Router();

connectionRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    const { status, toUserId } = req.params;
    const fromUserId = res.user._id;   // user from userAuth
    // console.log(fromUserId,status,toUserId);
    console.log(res.user);
    
    const allowedStatus = ["ignored", "interested"];

    try {
      if (!status || !toUserId) {
        throw new Error("Bad Request");
      }
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status");
      }
      const isUserAvailable = await UserModel.findById(toUserId);
      if (!isUserAvailable) {
        throw new Error("unknown user");
      }
      const existingConnection = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnection) {
        throw new Error("connection already sent");
      }
      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      await connectionRequest.save();
      res.json({ message: "request sent successfully", status: 200 });
    } catch (error) {
      res.status(400).json({ message: error.message, status: 400 });
    }
  }
);

connectionRouter.post("/request/review/:status/:requestId",userAuth,async (req,res)=>{
const loggedInUser = res.user  // from userAuth
const {status,requestId} = req.params
const allowedStatus = ['accepted','rejected']
if (!allowedStatus.includes(status)) {
  return res.status(400).json({message:'bad status'})
}
const connectionRequest = await ConnectionRequestModel.findOne({   // check if the request exists
  _id:requestId,
  toUserId:loggedInUser._id,
  status:'interested'
})
// console.log(isRequestValid);
if (!connectionRequest) {
  return res.status(404).send('request not found')
}
connectionRequest.status = status
await connectionRequest.save()
console.log(status);

res.send(`connection request ${status}`)
})

module.exports = connectionRouter;
