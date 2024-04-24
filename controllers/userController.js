import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User account doesn't exist",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    const token = createToken(user._id);
    res.json({
      success: true,
      token,
      message: `Welcome back, ${user.name}`,
      username: user.name,
    });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

//Register user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exist = await userModel.findOne({ email });
    //checking if user already exists
    if (exist) {
      return res.json({
        success: false,
        message: "User account already exixts",
      });
    }

    //validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter valid email address",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    //password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({
      success: true,
      token,
      message: `Welcome to Tasty Eat's, ${user.name}`,
      username: user.name,
    });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

//forgot password

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = userModel.findOne({ email });
    if (!oldUser) {
      res.json({})
    }
  } catch (error) {}
};

export { registerUser, loginUser, forgotPassword };
