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
  updateUser,
  getCurrentUser,
  blockUser,
} from "../controllers/user.controllers.js";
import { isAuthenticated, isAdmin } from "../middleware/Auth.middleware.js";
import { singleUpload } from "../middleware/multer.js";

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
router.put("/auth/update-user/:id", isAuthenticated, singleUpload, updateUser);
router.get("/auth/me", isAuthenticated, getCurrentUser);
router.post("/auth/block-user/:id", isAuthenticated, isAdmin, blockUser);

export default router;
