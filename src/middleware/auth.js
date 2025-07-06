const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/user");
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({message:'please login'})
    }
    const decodeObj = jwt.verify(token, "8494076802!aB");
    const { _id } = decodeObj;
    const user = await UserModel.findById(_id);
    if (!user) {
      throw new Error("user not found");
    }
    res.user = user; // setting user in response object
    next();
  } catch (err) {
    res.send(err.message);
  }
};
module.exports = { userAuth };
