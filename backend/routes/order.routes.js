import express from "express";
import { isAdmin, isAuthenticated } from "../middleware/Auth.middleware.js";
import {
  createOrder,
  getOrderById,
  getUerOrders,
  verifyPayment,
  getAllOrdersAdmin,
} from "../controllers/order.controllers.js";

const router = express.Router();

router.post("/create-order", isAuthenticated, createOrder);
router.post("/verify-payment", isAuthenticated, verifyPayment);
router.get("/:id", isAuthenticated, getOrderById);
router.get("/get-order/:userId", isAuthenticated, getUerOrders);
router.get(
  "/get-all-order/:userId",
  isAuthenticated,
  isAdmin,
  getAllOrdersAdmin,
);

export default router;
