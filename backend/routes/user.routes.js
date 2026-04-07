import express from "express";
import {
  register,
  verify,
  reVerify,
  login,
  logout,
  forgotPassword,
  verifyOTP,
  changePassword,
  getAllUser,
  getUserById,
} from "../controllers/user.controllers.js";
import { isAuthenticated, isAdmin } from "../middleware/Auth.middleware.js";

const router = express.Router();

router.post("/auth/register", register);
router.post("/auth/verify", verify);
router.post("/auth/reverify", reVerify);
router.post("/auth/login", login);
router.post("/auth/logout", isAuthenticated, logout);
router.post("/auth/forgot-password", forgotPassword);
router.post("/auth/verify-otp/:email", verifyOTP);
router.post("/auth/change-password/:email", changePassword);
router.get("/auth/get-all-users", isAuthenticated, isAdmin, getAllUser);
router.get("/auth/get-user/:userId", getUserById);

export default router;
