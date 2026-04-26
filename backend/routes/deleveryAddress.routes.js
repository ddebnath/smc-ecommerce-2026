import express from "express";
import { isAuthenticated } from "../middleware/Auth.middleware.js";
import {
  getUserAddresses,
  deleteAddress,
  setSelectedAddress,
  addAddress,
} from "../controllers/deleveryAddress.controllers.js";

const router = express.Router();

router.get("/get-address", isAuthenticated, getUserAddresses);
router.post("/add", isAuthenticated, addAddress);
router.put("/select", isAuthenticated, setSelectedAddress);
router.delete("/delete/:id", isAuthenticated, deleteAddress);

export default router;
