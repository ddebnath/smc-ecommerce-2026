import express from "express";
import {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
} from "../controllers/cart.controllers.js";
import { isAuthenticated } from "../middleware/Auth.middleware.js";

const router = express.Router();

router.get("/", isAuthenticated, getCart);
router.post("/add", isAuthenticated, addToCart);
router.put("/update", isAuthenticated, updateQuantity);
router.delete("/remove", isAuthenticated, removeFromCart);

export default router;
