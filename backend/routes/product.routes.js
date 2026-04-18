import express from "express";
import {
  addProduct,
  getAllProduct,
} from "../controllers/product.controllers.js";
import { isAuthenticated, isAdmin } from "../middleware/Auth.middleware.js";
import { multipleUpload } from "../middleware/multer.js";

const router = express.Router();

router.post("/add", isAuthenticated, isAdmin, multipleUpload, addProduct);

router.get("/getAllProducts", getAllProduct);

export default router;
