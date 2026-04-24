import express from "express";
import {
  addProduct,
  getAllProduct,
  deleteProduct,
  updateProduct,
  getProductById,
} from "../controllers/product.controllers.js";
import { isAuthenticated, isAdmin } from "../middleware/Auth.middleware.js";
import { multipleUpload } from "../middleware/multer.js";

const router = express.Router();

router.post("/add", isAuthenticated, isAdmin, multipleUpload, addProduct);

router.get("/getAllProducts", getAllProduct);
router.get("/:id", isAuthenticated, isAdmin, getProductById);

router.delete("/delete/:productId", isAuthenticated, isAdmin, deleteProduct);
router.put(
  "/update/:productId",
  isAuthenticated,
  isAdmin,
  multipleUpload,
  updateProduct,
);

export default router;
