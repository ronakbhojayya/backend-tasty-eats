import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import nodemailer from "nodemailer";
//app password = 'ueco whuu fmnh aums'
// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ronaktastyeats@gmail.com",
    pass: "ueco whuu fmnh aums",
  },
});
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
    //mail

    // Define email options
    const mailOptions = {
      from: "ronaktastyeats@gmail.com",
      to: email,
      subject: `Hi ${name}, Welcome to Tasty Eat's `,
      text: `Hi ${name}, Welcome to Tasty Eat's your account is successfully created`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error occurred:", error);
      } else {
        console.log("Email sent successfully:", info.response);
      }
    });

    //mailend
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
      res.json({});
    }
  } catch (error) {}
};

//change passsword

const changePassword = async (req, res) => {
  const { email, oldPassword, newPassword, confirmNewPassword } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User account doesn't exist",
      });
    }
      if (newPassword != confirmNewPassword) {
        return res.json({ success: false, message: "Confirm password must match new password" });
      }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect old password" });
    }

    //password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await userModel.findOneAndUpdate({email}, { password: hashedPassword });
    return res.json({ success: true, message: "Password Changed!" });

  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Errorrrrrrr" });
  }
};

export { registerUser, loginUser, forgotPassword, changePassword };
