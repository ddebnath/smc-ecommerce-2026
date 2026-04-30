import cloudinary from "../Utils/cloudinary.js";
import getDataUri from "../Utils/dataUri.js";
import { Product } from "../models/product.models.js";

/*
    Product Controller addProduct: Adds a new product to the database
    - Validates the input fields (productName, productDesc, productPrice, category, brand)
    - Handles multiple image uploads using Cloudinary
    - Creates a new product document in the database with the provided details and uploaded images
    - Returns a success response with the created product or an error message if any step fails
*/

export const addProduct = async (req, res) => {
  try {
    const {
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      quantity,
      sold,
    } = req.body;

    const userId = req.id;

    if (!productName || !productDesc || !productPrice || !category || !brand) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const safeCategory = category
      ? category.toLowerCase().replace(/[^a-z0-9]/g, "-")
      : "uncategorized";

    // handle multiple image upload
    let productImg = [];
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const fileUri = getDataUri(file);
        const result = await cloudinary.uploader.upload(fileUri, {
          folder: `products/${safeCategory}/${userId}`, // cloudinary folder to store product images
          public_id: `${safeCategory}/${userId}/${Date.now()}`,
        });

        productImg.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    } else {
      return res
        .status(400)
        .json({ success: false, message: "At least 1 image is required" });
    }

    // create a product in DB

    const newProduct = await Product.create({
      userId,
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      quantity,
      sold,
      productImg, //array of objects [{url, public_id},{url, public_id}]
    });

    return res.status(200).json({
      success: true,
      message: "product added successfully",
      product: newProduct,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/*
    getAllProduct Controller: Retrieves all products from the database
    - Fetches all product documents from the database
    - Returns a success response with the list of products or an error message if the retrieval fails
*/

export const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find();

    if (!products) {
      return res.status(400).json({
        success: false,
        message: "No products available",
        products: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "products fetched successfully",
      products,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/*
  get product by ID
*/
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
  Delete Product Controller: Deletes a product from the database
  - Validates the product ID from the request parameters
  - Deletes the product document from the database based on the provided ID
  - Returns a success response if the product is deleted successfully or an error message if the deletion fails
*/

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const safeCategory = product.category
      ? product.category.toLowerCase().replace(/[^a-z0-9]/g, "-")
      : "uncategorized";

    // ✅ delete all images

    for (let img of product.productImg) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    const folderPath = `products/${safeCategory}/${product._id}`;

    // ✅ delete folder (only if empty)
    try {
      await cloudinary.api.delete_folder(folderPath);
    } catch (error) {
      console.error("Folder not empty or not found");
    }

    // ✅ delete product from DB
    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/*
  Update Product Controller: Updates a product in the database
  - Validates the product ID from the request parameters and input fields (productName, productDesc, productPrice, category, brand)
  - Handles multiple image uploads using Cloudinary and updates the product document in the database with the new details and uploaded images
  - Returns a success response with the updated product or an error message if any step fails
*/

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const {
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      quantity,
      sold,
      existingImages, // public_id(s)
    } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ==============================
    // 1. Normalize existingImages
    // ==============================
    let keepIds = [];

    if (existingImages) {
      keepIds = Array.isArray(existingImages)
        ? existingImages
        : [existingImages];
    }

    // ==============================
    // 2. Keep only selected images
    // ==============================
    let updatedImages = product.productImg.filter((img) =>
      keepIds.includes(img.public_id),
    );

    // ==============================
    // 3. Delete removed images
    // ==============================
    const deletedImages = product.productImg.filter(
      (img) => !keepIds.includes(img.public_id),
    );

    for (let img of deletedImages) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    // ==============================
    // 4. Upload new images
    // ==============================

    const safeCategory = product.category
      ? product.category.toLowerCase().replace(/[^a-z0-9]/g, "-")
      : "uncategorized";

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const fileUri = getDataUri(file);

        const result = await cloudinary.uploader.upload(fileUri, {
          folder: `products/${safeCategory}/${product._id}`, // cloudinary folder to store product images
          public_id: `${safeCategory}/${product._id}/${Date.now()}`,
        });

        updatedImages.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    }

    // ==============================
    // 5. Update product fields
    // ==============================
    product.productName = productName || product.productName;
    product.productDesc = productDesc || product.productDesc;
    product.productPrice = productPrice || product.productPrice;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.quantity = quantity || product.quantity;
    product.sold = sold || product.sold;
    product.productImg = updatedImages;

    const updatedProduct = await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* 
add products by the product owner

*/

export const addOwnProduct = async (req, res) => {
  try {
    const {
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      quantity,
      sold,
    } = req.body;

    const userId = req.id;

    if (!productName || !productDesc || !productPrice || !category || !brand) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const safeCategory = category
      ? category.toLowerCase().replace(/[^a-z0-9]/g, "-")
      : "uncategorized";

    // handle multiple image upload
    let productImg = [];
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const fileUri = getDataUri(file);
        const result = await cloudinary.uploader.upload(fileUri, {
          folder: `products/${safeCategory}/${userId}`, // cloudinary folder to store product images
          public_id: `${safeCategory}/${userId}/${Date.now()}`,
        });

        productImg.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    } else {
      return res
        .status(400)
        .json({ success: false, message: "At least 1 image is required" });
    }

    // create a product in DB

    const newProduct = await Product.create({
      userId,
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      quantity,
      sold,
      productImg, //array of objects [{url, public_id},{url, public_id}]
    });

    return res.status(200).json({
      success: true,
      message: "product added successfully",
      product: newProduct,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/*get products by product owner */
export const getProductOwnerProduct = async (req, res) => {
  try {
    const userId = req.id;

    const products = await Product.find({ owner: userId });

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products available",
        products: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* delete product by owner */

export const deleteOwnProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const safeCategory = product.category
      ? product.category.toLowerCase().replace(/[^a-z0-9]/g, "-")
      : "uncategorized";

    // ✅ delete all images

    for (let img of product.productImg) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    const folderPath = `products/${safeCategory}/${product._id}`;

    // ✅ delete folder (only if empty)
    try {
      await cloudinary.api.delete_folder(folderPath);
    } catch (error) {
      console.error("Folder not empty or not found");
    }

    // ✅ delete product from DB
    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
