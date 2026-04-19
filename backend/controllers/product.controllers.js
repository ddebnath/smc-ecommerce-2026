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
    const { productName, productDesc, productPrice, category, brand } =
      req.body;

    const userId = req.id;

    if (!productName || !productDesc || !productPrice || !category || !brand) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // handle multiple image upload
    let productImg = [];
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const fileUri = getDataUri(file);
        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "products", // cloudinary folder to store product images
        });

        productImg.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    }

    // create a product in DB

    const newProduct = await Product.create({
      userId,
      productName,
      productDesc,
      productPrice,
      category,
      brand,
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

    return res
      .status(200)
      .json({ success: true, message: "products available", products });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
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

    // delete images from cloudinary
    if (product.productImg && product.productImg.length > 0) {
      for (let img of product.productImg) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    // delete product from DB
    await Product.findByIdAndDelete(productId);

    return res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
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
      existedImages,
    } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    let updatedImages = [];

    // keep existed images
    if (existedImages && existedImages.length > 0) {
      const keepIds = JSON.parse(existedImages);
      updatedImages = product.productImg.filter((img) =>
        keepIds.includes(img.public_id),
      );

      // delete images that are not in the keepIds
      const deleteIds = product.productImg.filter(
        (img) => !keepIds.includes(img.public_id),
      );

      for (let img of deleteIds) {
        await cloudinary.uploader.destroy(img);
      }
    } else {
      updatedImages = product.productImg; // keep all images if existedImages is not provided
    }

    // upload new images

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const fileUri = getDataUri(file);
        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "products", // cloudinary folder to store product images
        });

        updatedImages.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    }

    // update product in DB
    product.productName = productName || product.productName;
    product.productDesc = productDesc || product.productDesc;
    product.productPrice = productPrice || product.productPrice;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.productImg = updatedImages;

    const updatedProduct = await product.save();

    return res.status(200).json({
      success: true,
      message: "product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
