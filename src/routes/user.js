const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequestModel = require("../model/connectionRequest");
const { UserModel } = require("../model/user");
const userRoutes = express.Router();

userRoutes.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = res.user;
    // console.log(loggedInUser);

    const recievedRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);

    if (recievedRequests.length == 0) {
      return res.send({ message: "you dont have any requests" });
    }
    res.json({ data: recievedRequests });
  } catch (error) {
    res.status(400).json({ message: "something went wrong" });
  }
});

userRoutes.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = res.user;
    const userConnections = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", ["firstName", "lastName", "imageUrl"])
      .populate("toUserId", ["firstName", "lastName", "imageUrl"]);

    if (userConnections.length == 0) {
      return res.send("zero connections");
    }
    console.log(userConnections);

    const filteredData = userConnections.map((d) => {
      if (d.fromUserId._id.equals(loggedInUser._id)) {
        return d.toUserId;
      }
      return d.fromUserId;
    });
    console.log(filteredData);

    res.json({ data: filteredData });
  } catch (error) {
    res.status(400).send("something went wrong");
  }
});

userRoutes.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = res.user;
    const page = Number(req.query?.page) || 0
    let limit = Number(req.query?.limit) || 10
    limit = limit>20 ? 20 : limit
    const skip = (page-1)*limit
    console.log(limit);
    
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    });

    const excludeFromFeed = new Set();
    connectionRequests.forEach((connectionRequest) => {
      excludeFromFeed.add(connectionRequest.fromUserId.toString());
      excludeFromFeed.add(connectionRequest.toUserId.toString());
    });
    // console.log(excludeFromFeed);
    const feedData = await UserModel.find({
      $and: [
        { _id: { $nin: Array.from(excludeFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select("firstName lastName imageUrl").skip(skip).limit(limit)

    res.json({ data: feedData });
  } 
  catch (error) {
    res.json({ message: error.message });
  }
});

module.exports = userRoutes;
