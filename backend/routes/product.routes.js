import express from "express";
import {
  addProduct,
  getAllProduct,
  deleteProduct,
  updateProduct,
  getProductById,
  getProductOwnerProduct,
} from "../controllers/product.controllers.js";
import {
  isAuthenticated,
  isProductOwner,
  isAdmin,
  authorizeRoles,
} from "../middleware/Auth.middleware.js";
import { multipleUpload } from "../middleware/multer.js";

const router = express.Router();

router.post(
  "/add",
  isAuthenticated,
  authorizeRoles("admin", "productOwner"),
  multipleUpload,
  addProduct,
);

router.get("/getAllProducts", getAllProduct);

router.get(
  "/get-product-owner-product",
  isAuthenticated,
  isProductOwner,
  getProductOwnerProduct,
);

router.get("/:id", isAuthenticated, getProductById);

router.delete(
  "/delete/:productId",
  isAuthenticated,
  authorizeRoles("admin", "productOwner"),
  deleteProduct,
);

router.put(
  "/update/:productId",
  isAuthenticated,
  authorizeRoles("admin", "productOwner"),
  multipleUpload,
  updateProduct,
);

export default router;
