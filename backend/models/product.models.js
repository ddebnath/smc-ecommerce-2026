import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    productName: {
      type: String,
      required: true,
    },
    productDesc: {
      type: String,
      required: true,
    },
    productImg: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    productPrice: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: function () {
        return this.userId;
      },
    },
    quantity: {
      type: Number,
      default: 10,
      min: [1, "Quantity must be greater than 0"],
    },

    sold: {
      type: Number,
      default: 0,
      min: [0, "Sold cannot be negative"],
      validate: {
        validator: function (value) {
          return value <= this.quantity;
        },
        message: "Sold cannot be greater than quantity",
      },
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const Product = mongoose.model("Product", productSchema);
