import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";

import connectDB from "./database/db.js";

// ROUTES
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import deleveryRoutes from "./routes/deleveryAddress.routes.js";
import orderRoutes from "./routes/order.routes.js";
import eventRoutes from "./routes/event.routes.js";

// -----------------------------
// CONFIG
// -----------------------------
dotenv.config();

const app = express();

// -----------------------------
// MIDDLEWARES
// -----------------------------
app.use(
  cors({
    origin: ["http://localhost:5173", "https://smc-ecommerce-2026.vercel.app"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -----------------------------
// HEALTH CHECK
// -----------------------------
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// -----------------------------
// ROUTES
// -----------------------------
app.use("/api/v1/event", eventRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/address", deleveryRoutes);
app.use("/api/v1/orders", orderRoutes);

// -----------------------------
// 404 HANDLER (OPTIONAL BUT GOOD)
// -----------------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// -----------------------------
// GLOBAL ERROR HANDLER (LAST)
// -----------------------------
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);

  // Multer errors (file upload issues)
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // File type validation errors
  if (err.message?.includes("Only")) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Default fallback
  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// -----------------------------
// START SERVER
// -----------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`🚀 Server running on port ${PORT}`);
  } catch (error) {
    console.error("❌ DB connection failed:", error);
  }
});
