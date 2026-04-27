import express from "express";
import { isAuthenticated } from "../middleware/Auth.middleware.js";
import {
  createOrder,
  getOrderById,
  getUerOrders,
  verifyPayment,
} from "../controllers/order.controllers.js";

const router = express.Router();

router.post("/create-order", isAuthenticated, createOrder);
router.post("/verify-payment", isAuthenticated, verifyPayment);
router.get("/:id", isAuthenticated, getOrderById);
router.get("/get-order/:userId", isAuthenticated, getUerOrders);

export default router;
