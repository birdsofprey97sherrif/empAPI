// Registeration/ login
const express = require("express");

const router = express.Router();
const { User } = require("../models/model");

// reqiure path to show where our file will be stored
// we require fs to create a new file

const path = require("path");
const fs = require("fs");

//importing json web token that will be used in authentication
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// bcrypt is for hashing password b4 they get to the db
const bcrypt = require("bcryptjs");
//nedded to handle files
const multer = require("multer");

// storage location
const upload = multer({ dest: "uploads/" });
// register
router.post("/register", upload.single("photo"), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // check if the user exist by the email
    const existuser = await User.findOne({ email });
    if (existuser) {
      return res.status(400).json({ message: "Email already exist" });
    }
    // hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
    console.log(name, email, password);
    // declare an null varibable
    let photo = null;
    //checking if our request has any file
    if (req.file) {
      const ext = path.extname(req.file.originalname); //extract the extension of the file
      const newFilename = Date.now() + ext;
      const newPath = path.join("uploads", newFilename);
      fs.renameSync(req.file.path, newPath);
      photo = newPath.replace(/\\/g, "/");
    }
    const user = new User({ name, email, password: hashedPassword, photo });
    const savedUser = await user.save();
    console.log(name, email, password);
    return res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// login

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Wrong credentials" });
    }
    //if user exist then we check the password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: "Wrong credentials" });
    }
    //generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1hr" });
    console.log(token);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
