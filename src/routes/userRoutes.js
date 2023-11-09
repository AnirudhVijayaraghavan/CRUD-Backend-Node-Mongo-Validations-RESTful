const express = require("express");
const { createUser, updateUser, deleteUser, getAllUsers } = require("../controller/userController");

const userRouter = express.Router();

userRouter.post("/create", createUser);
userRouter.put("/edit", updateUser);
userRouter.delete("/delete", deleteUser);
userRouter.get("/getAll", getAllUsers);



module.exports = userRouter;
