import express from "express";
import {
  addProduct,
  getAllProduct,
  deleteProduct,
  updateProduct,
  getProductById,
  getProductOwnerProduct,
  addOwnProduct,
  deleteOwnProduct,
} from "../controllers/product.controllers.js";
import {
  isAuthenticated,
  isProductOwner,
  isAdmin,
} from "../middleware/Auth.middleware.js";
import { multipleUpload } from "../middleware/multer.js";

const router = express.Router();

router.post("/add", isAuthenticated, isAdmin, multipleUpload, addProduct);
router.post(
  "/owner-product",
  isAuthenticated,
  isProductOwner,
  multipleUpload,
  addOwnProduct,
);

router.get("/getAllProducts", getAllProduct);

router.get(
  "/get-product-owner-product",
  isAuthenticated,
  isProductOwner,
  getProductOwnerProduct,
);

router.get("/:id", isAuthenticated, getProductById);

router.delete("/delete/:productId", isAuthenticated, isAdmin, deleteProduct);

router.delete(
  "/product-delete/:productId",
  isAuthenticated,
  isProductOwner,
  deleteOwnProduct,
);

router.put(
  "/update/:productId",
  isAuthenticated,
  isAdmin,
  multipleUpload,
  updateProduct,
);

export default router;
