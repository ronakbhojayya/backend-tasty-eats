import express from "express";
import {
  changePassword,
  forgotPassword,
  loginUser,
  registerUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/forgotpassword", forgotPassword);
userRouter.post("/changepassword", changePassword);

export default userRouter;
