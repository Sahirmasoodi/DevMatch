const signup = require("./post");
const updateUser = require("./patch");
const deleteUser = require("./delete");
const userServer = require("./userRoutes");

module.exports = { signup, updateUser, deleteUser,userServer };
