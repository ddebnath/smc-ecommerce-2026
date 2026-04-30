import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

const ProtectedRoute = ({
  children,
  adminOnly = false,
  productOwner = false,
}) => {
  const { user } = useSelector((store) => store.user);

  // 🚫 Not logged in
  if (!user) {
    toast.error("Login first to access this page");
    return <Navigate to="/auth/login" state={{ loginStatus: "login_first" }} />;
  }

  // 🔐 Admin ONLY (exclusive)
  if (adminOnly) {
    if (user.role !== "admin") {
      toast.error("Admin access only");
      return <Navigate to="/" />;
    }
  }

  // 🔐 Product Owner ONLY (exclusive)
  if (productOwner) {
    if (user.role !== "productOwner") {
      toast.error("Product owner access only");
      return <Navigate to="/" />;
    }
  }

  return children;
};

export default ProtectedRoute;
