// Authentication middleware for protecting routes.
//
// This file exports two middleware functions:
// - isAuthenticated: verifies the JWT access token, confirms the user exists,
//   and attaches the authenticated user object to the request.
// - isAdmin: ensures the authenticated user has an admin role before allowing access.

import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

/*
  isAuthenticated verifies that the incoming request includes a valid JWT.
  It authenticates the user by:
  1. checking for the Authorization header in the format "Bearer <token>"
  2. validating the token with the secret key
  3. looking up the user by decoded ID
  4. attaching the user object to req.user if valid
  If any step fails, it returns an error response instead of calling next().
*/
export const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(400).json({
        success: false,
        message: "authorization token is missing",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        success: false,
        message: "authorization token invalid",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          message: "access token has expired",
        });
      }

      return res.status(400).json({
        success: false,
        message: "access token is missing or invalid",
      });
    }

    const user = await User.findById(decoded.id);

    // USER NOT FOUND OR BLOCKED USER CHECK
    if (!user || !user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is blocked or user is not found",
      });
    }

    // Attach authenticated user data to the request for downstream handlers.
    req.user = user;
    req.id = user._id;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Invalid user: ${error.message}`,
    });
  }
};

/*
  isAdmin checks whether the authenticated user has admin privileges.
  It assumes isAuthenticated has already run and populated req.user.
  If the user is not an admin, it returns a 403 Forbidden response.
*/
export const isAdmin = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ success: false, message: "access denied" });
  }
};

/* middleware for product owner */
export const isProductOwner = async (req, res, next) => {
  if (req.user && req.user.role === "productOwner") {
    next();
  } else {
    return res.status(403).json({ success: false, message: "access denied" });
  }
};

// middleware/authorizeRoles
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // 🚫 No user (should already be handled by isAuthenticated)
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized. Please login.",
        });
      }

      // 🚫 Role not allowed
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied. Insufficient permissions.",
        });
      }

      // ✅ Allowed
      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };
};
