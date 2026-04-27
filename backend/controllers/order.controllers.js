import razorpayInstance from "../config/razorPay.js";
import { Order } from "../models/order.models.js";
import crypto from "crypto";
import { Cart } from "../models/cart.models.js";
import "dotenv/config.js";
import mongoose from "mongoose";
/* create order */

export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, tax, shipping, currency } = req.body;

    const options = {
      amount: Math.round(Number(totalAmount) * 100),
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorPayOrder = await razorpayInstance.orders.create(options);

    // save order in DB
    const newOrder = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      tax,
      shipping,
      currency,
      status: "Pending",
      razorPayOrderId: razorPayOrder.id,
    });

    await newOrder.save();
    return res
      .status(200)
      .json({ success: true, order: razorPayOrder, dbOrder: newOrder });
  } catch (error) {
    console.log("razorpay error : ", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// verify Payment
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentFailed,
    } = req.body;

    const userId = req.user._id;

    if (paymentFailed) {
      const order = await Order.findOneAndUpdate(
        { razorPayOrderId: razorpay_order_id },
        { status: "Failed" },
        { returnDocument: "after" },
      );

      return res.status(200).json({
        success: false,
        message: "Payment Failed",
        order,
      });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(razorpay_signature),
    );

    if (isValid) {
      const order = await Order.findOneAndUpdate(
        { razorPayOrderId: razorpay_order_id },
        {
          status: "Paid",
          razorPayPaymentId: razorpay_payment_id,
          razorPaySignature: razorpay_signature,
        },
        { returnDocument: "after" },
      );

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      await Cart.findOneAndUpdate(
        { userId },
        { $set: { items: [], totalPrice: 0 } },
      );

      return res.status(200).json({
        success: true,
        message: "Payment successful",
        order,
      });
    } else {
      await Order.findOneAndUpdate(
        { razorPayOrderId: razorpay_order_id },
        { status: "Failed" },
        { returnDocument: "after" },
      );

      return res.status(400).json({
        success: false,
        message: "Invalid Signature",
      });
    }
  } catch (error) {
    console.log("razor verification error : ", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get order for loggedin user

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔒 Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    // 🔍 Find order (only for logged-in user)
    const order = await Order.findById(id)
      .populate({
        path: "items.productId",
        select: "productName productPrice productImg",
      })
      .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // keeping only one product image
    order.items = order.items.map((item) => ({
      ...item,
      productId: {
        ...item.productId,
        productImg: item.productId.productImg?.[0],
      },
    }));

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("getOrderById error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
