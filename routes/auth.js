// Authentication file for user Login and register
const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const bcrypt = require("bcryptjs");
const {verifyToken} = require("../middlewares/verifyTokens")
const {
  User,
  validateLoginUser,
  validateRegisterUser,
} = require("../models/User");

/**
 * @desc Register New User
 * @route /api/auth/register
 * @method POST
 * @access public
 */

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    console.log("registeration stage");
    const { error } = validateRegisterUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: "this user already registered" }); //فيه مستخدم موجود بنفس البريدالالكتروني
    }
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt); //hash provides a one direction encryption
    user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
    });
    const result = await user.save();
    const token = user.generateToken();
    const { password, ...other } = result._doc;
    res.status(201).json({ ...other,message:"Registeration succeeded", token });
  }),
);

/**
 * @desc Login User
 * @route /api/auth/login
 * @method POST
 * @access public
 */

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { error } = validateLoginUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "invalid email or password" });
    }
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password,
    );
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "invalid email or password" });
    }

    const token = user.generateToken();
    const { password, ...other } = user._doc;
    res.status(200).json({ ...other,message:"Login succeeded", token });
  }),
);

router.get(
  "/me",
  verifyToken,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  }),
);


module.exports = router;
