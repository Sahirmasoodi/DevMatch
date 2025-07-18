const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
      lowercase:true
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 20,
      lowercase:true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      lowercase:true,
      unique: true,
      // match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email id");
        }
      },
    },
    age: {
      type: Number,
      min: [18, "Age must be at least 18"],
    },
    gender: {
      type: String,
      lowercase:true,
      enum: {
        values:["male", "female"],
        message:`{VALUE}gender is not valid`
      },
    },
    password: {
      type: String,
      required: true,
      // select: false,
    },
    imageUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0mStgAq6UphPdQDqvAGbl9Usi9LSqi1-URQ&s",
    },
    skills:{
      type : [String],
      default:['Html','Css','JavaScript']
    },
    about: {
      type: String,
      default:
        "A software engineer focused on building scalable backend systems, optimizing complex logic like auto-scheduling, and delivering clean, maintainable code for impactful applications.",
    },
  },
  { timestamps: true }
);

userSchema.methods.generateToken = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "8494076802!aB",{expiresIn:"7d"});
  return token

};
const UserModel = mongoose.model("user", userSchema);
module.exports = { UserModel };
