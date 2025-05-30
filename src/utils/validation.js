const validator = require('validator')

const signupValidation = (req) => {
  const { firstName, lastName, email, gender, age, password,imageUrl } = req.body;
  if (!firstName || !email || !password) {
    throw new Error('Bad Request')
  }
  if (!validator.isEmail(email)) {
    throw new Error('Email is not valid')
  }
   if (imageUrl ? !validator.isURL(imageUrl):false) {
    throw new Error('invalid url')
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error('use strong password')
  }
};

module.exports = { signupValidation };
