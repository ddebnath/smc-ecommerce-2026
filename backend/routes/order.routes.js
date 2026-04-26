import express from "express";
import { isAuthenticated } from "../middleware/Auth.middleware.js";
import {
  createOrder,
  verifyPayment,
} from "../controllers/order.controllers.js";

const router = express.Router();

router.post("/create-order", isAuthenticated, createOrder);
router.post("/verify-payment", isAuthenticated, verifyPayment);

export default router;
