const bcrypt = require("bcrypt"); /* to hash and verify passwords*/
const userModel = require("../models/user");

/*
CREATE USER
@POST
*/
const createUser = async (req, res) => {
  const { fullname, email, password } = req.body;

  let regExFirstName = /^[A-Za-z]+ [A-Za-z]+$/;
  let regExEmail = /[a-z0-9]+@northeastern.edu/;
  let regExPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[^\s]{8,}$/;
  ///^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
                      

  if (!regExFirstName.test(fullname)) {
    res.status(400).json({
      message: "Please enter a valid full name. (Rules :  1. Cannot be null. 2. Can only have first name and last name, with 1 space in between. 3. No numbers allowed.)",
    });
  } else if (!regExEmail.test(email)) {
    res.status(400).json({ message: "Please enter a valid email. (Rules :  1. Cannot be null. 2. Must be of e-mail format and end with @northeastern.edu.)" });
  } else if (!regExPassword.test(password)) {
    res.status(400).json({
      message:
        "Please enter a valid password. (Rules :  1. Atleast 8 characters. 2. Atleast 1 capital letter. 3. Atleast 1 small letter. 4. Atleast 1 special character.)",
    });
  } else {
    try {
      const existingUser = await userModel.findOne({ email: email });
      if (existingUser) {
        return res.status(400).json({ message: "A user already exists with this e-mail ID." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await userModel.create({
        fullname: fullname,
        email: email,
        password: hashedPassword,
      });

      res
        .status(201)
        .json({ message: "User added.", user: result });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Oops! There was an error." });
    }
  }
};

/*
UPDATE USER
@PUT
*/
const updateUser = async (req, res) => {
  const { fullname, email, password } = req.body;

  let regExFirstName = /^[A-Za-z]+ [A-Za-z]+$/;
  let regExEmail = /[a-z0-9]+@[northeastern]+\.(edu)$/;
  let regExPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[^\s]{8,}$/;

  if (!regExFirstName.test(fullname)) {
    res.status(400).json({
      message: "Please enter a valid full name. (Rules : 1. Cannot be null. 2. Can only have first name and last name, with 1 space in between. 3. No numbers allowed.)",
    });
  } else if (!regExEmail.test(email)) {
    res.status(400).json({ message: "Please enter a valid email. (Rules : 1. Cannot be null. 2. Must be of e-mail format and end with @northeastern.edu.)" });
  } else if (!regExPassword.test(password)) {
    res.status(400).json({
      message:
        "Please enter a valid password. (Rules :  1. Atleast 8 characters. 2. Atleast 1 capital letter. 3. Atleast 1 small letter. 4. Atleast 1 special character.)",
    });
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      fullname: fullname,
      password: hashedPassword,
    };

    try {
      const returnedNewUser = await userModel.findOneAndUpdate(
        { email: email },
        newUser,
        { new: true }
      );
      if (returnedNewUser != null) {
        res
          .status(200)
          .json({
            message: "User updated.",
            updatedUser: newUser,
          });
      } else {
        res.status(400).json({ message: "Email Not Found!" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Oops! There was an error." });
    }
  }
};

/*
DELETE USER
@DELETE
*/
const deleteUser = async (req, res) => {
  const { email } = req.body;

  let regExEmail = /[a-z0-9]+@[northeastern]+\.(edu)$/;

  if (!regExEmail.test(email)) {
    res.status(400).json({ message: "Please enter a valid email. (Rules :  1. Cannot be null. 2. Must be of e-mail format and end with @northeastern.edu.)" });
  } else {
    try {
      const userToDelete = await userModel.findOneAndDelete({ email: email });
      if (userToDelete != null) {
        res
          .status(202)
          .json({
            message: "User Deleted Successfully!",
            deletedUser: userToDelete,
          });
      } else {
        res.status(400).json({ message: "Email Not Found!" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Oops! There was an error." });
    }
  }
};

/*
GET ALL USER
@GET
*/
const getAllUsers = async (req, res) => {

  try {
    const notes = await userModel.find({})
    res.status(200).json(notes)
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Oops! There was an error." });
  }


};

module.exports = { createUser, updateUser, deleteUser, getAllUsers };
