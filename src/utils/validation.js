const validator = require("validator");
const { UserModel } = require("../model/user");
const bcrypt = require("bcrypt");

const signupValidation = (req) => {
  const { firstName, lastName, email, gender, age, password, imageUrl } =
    req.body;
  if (!firstName || !email || !password) {
    throw new Error("Bad Request");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  }
  if (imageUrl ? !validator.isURL(imageUrl) : false) {
    throw new Error("invalid url");
  }
  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    throw new Error(
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol."
    );
  }
};

const loginValidation = async (req) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Invalid email format.");
  }

  const user = await UserModel.findOne({ email });

  if (!user || !user.password) {
    throw new Error("Invalid credentials."); // Do not expose if user exists or not
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials.");
  }

  return user;
};

const passwordValidation = async function (req, loggedinUser) {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  // console.log(loggedinUser);
  
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    throw new Error("Bad Request");
  }
  const isCurrentPasswordMatch = await bcrypt.compare(currentPassword,loggedinUser.password)
  if (!isCurrentPasswordMatch) {
    throw new Error("current password does not match");
  }
  if (!validator.isStrongPassword(newPassword)) {
    throw new Error("use strong new password");
  }
  if (currentPassword == newPassword) {
    throw new Error("Use different password");
  }
  if (newPassword != confirmNewPassword) {
    throw new Error("new Passwords do not match.");
  }
};

module.exports = { signupValidation, loginValidation, passwordValidation };
