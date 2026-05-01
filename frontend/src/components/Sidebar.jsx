import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  PackageSearch,
  PackagePlus,
  Calendar,
  PlusCircle,
  List,
  ChevronDown,
} from "lucide-react";

import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [openProducts, setOpenProducts] = useState(true);
  const [openEvents, setOpenEvents] = useState(false);

  return (
    <div className="hidden md:flex fixed left-0 top-0 h-screen w-[260px] bg-blue-600 text-white shadow-lg flex-col p-6">
      {/* Title */}
      <div className="text-2xl font-bold mt-20 text-center">Admin Panel</div>

      <nav className="flex flex-col gap-2 mt-10">
        {/* DASHBOARD */}
        <SideLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" />

        {/* ================= PRODUCTS ================= */}
        <button
          onClick={() => setOpenProducts(!openProducts)}
          className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-blue-500"
        >
          <div className="flex items-center gap-3">
            <PackageSearch size={20} />
            Products
          </div>
          <ChevronDown
            className={`transition ${openProducts ? "rotate-180" : ""}`}
            size={18}
          />
        </button>

        {openProducts && (
          <div className="ml-6 flex flex-col gap-2">
            <SubLink
              to="/dashboard/add-product"
              icon={PackagePlus}
              label="Add Product"
            />

            <SubLink
              to="/dashboard/products"
              icon={PackageSearch}
              label="Manage Products"
            />
          </div>
        )}

        {/* ================= EVENTS ================= */}
        <button
          onClick={() => setOpenEvents(!openEvents)}
          className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-blue-500"
        >
          <div className="flex items-center gap-3">
            <Calendar size={20} />
            Events
          </div>
          <ChevronDown
            className={`transition ${openEvents ? "rotate-180" : ""}`}
            size={18}
          />
        </button>

        {openEvents && (
          <div className="ml-6 flex flex-col gap-2">
            <SubLink
              to="/dashboard/events/create"
              icon={PlusCircle}
              label="Create Event"
            />
          </div>
        )}

        {/* USERS */}
        <SideLink to="/dashboard/users" icon={Users} label="Users" />

        {/* ORDERS */}
        <SideLink to="/dashboard/orders" icon={ShoppingCart} label="Orders" />
      </nav>
    </div>
  );
};

/* ================= MAIN LINK ================= */
const SideLink = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
        isActive ? "bg-white text-blue-600" : "hover:bg-blue-500 text-white"
      }`
    }
  >
    <Icon size={20} />
    {label}
  </NavLink>
);

/* ================= SUB LINK ================= */
const SubLink = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
        isActive ? "bg-blue-500" : "hover:bg-blue-500/60"
      }`
    }
  >
    <Icon size={16} />
    {label}
  </NavLink>
);

export default Sidebar;
