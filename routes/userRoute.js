import express from "express";
import {
  forgotPassword,
  loginUser,
  registerUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/forgotpassword", forgotPassword);

export default userRouter;
