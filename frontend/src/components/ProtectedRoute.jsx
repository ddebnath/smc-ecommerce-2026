import store from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useSelector((store) => store.user);

  if (!user) {
    return (
      <>
        {toast.success("login first to access page")}
        <Navigate to="/auth/login" />
      </>
    );
  }

  if (adminOnly && user.role !== "admin")
    return (
      <div>
        {toast.success("invalid access")}
        <Navigate to="/" />
      </div>
    );

  return children;
  // comment
};

export default ProtectedRoute;
