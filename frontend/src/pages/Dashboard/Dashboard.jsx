import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
const Dashboard = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <Sidebar />

      <div className="flex-1">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
