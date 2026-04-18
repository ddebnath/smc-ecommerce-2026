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
