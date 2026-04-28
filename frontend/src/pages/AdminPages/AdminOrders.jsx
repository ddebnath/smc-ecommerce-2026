import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import store from "@/redux/store";
const AdminOrders = () => {
  const { user } = useSelector((store) => store.user);
  const admin = user?.role === "admin";
  return (
    <div className="mt-10 text-center">
      {admin && <Navigate to="/show-user-orders/${userId}" />}
    </div>
  );
};

export default AdminOrders;
