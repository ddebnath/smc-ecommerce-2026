import {
  LayoutDashboard,
  ShoppingCart,
  PackageSearch,
  PackagePlus,
  Calendar,
  ChevronDown,
  PlusCircle,
  List,
} from "lucide-react";

import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar1 = () => {
  const [openProducts, setOpenProducts] = useState(true);
  const [openEvents, setOpenEvents] = useState(false);

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[270px] bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-xl flex-col">
      {/* HEADER */}
      <div className="mt-16 px-6 text-center">
        <h1 className="text-2xl font-bold mt-15">Product Panel</h1>
        <p className="text-xs text-blue-100 mt-1">Manage your products here</p>
      </div>

      {/* DIVIDER */}
      <div className="mt-6 border-t border-white/20 mx-6" />

      {/* MENU */}
      <nav className="flex flex-col gap-2 mt-6 px-4">
        {/* DASHBOARD */}
        <SideLink
          to="/product-owner-dashboard"
          icon={LayoutDashboard}
          label="Dashboard"
        />

        {/* ================= PRODUCTS ================= */}
        <button
          onClick={() => setOpenProducts(!openProducts)}
          className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/10 transition"
        >
          <div className="flex items-center gap-3">
            <PackageSearch size={20} />
            Products
          </div>

          <ChevronDown
            size={18}
            className={`transition ${openProducts ? "rotate-180" : ""}`}
          />
        </button>

        {openProducts && (
          <div className="ml-6 flex flex-col gap-2">
            <SubLink
              to="/product-owner-dashboard/add-product"
              icon={PackagePlus}
              label="Add Product"
            />

            <SubLink
              to="/product-owner-dashboard/products"
              icon={List}
              label="Manage Products"
            />
          </div>
        )}

        {/* ================= EVENTS ================= */}
        <button
          onClick={() => setOpenEvents(!openEvents)}
          className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/10 transition"
        >
          <div className="flex items-center gap-3">
            <Calendar size={20} />
            Events
          </div>

          <ChevronDown
            size={18}
            className={`transition ${openEvents ? "rotate-180" : ""}`}
          />
        </button>

        {openEvents && (
          <div className="ml-6 flex flex-col gap-2">
            <SubLink
              to="/product-owner-dashboard/events/create"
              icon={PlusCircle}
              label="Create Event"
            />
          </div>
        )}

        {/* ORDERS */}
        <SideLink
          to="/product-owner-dashboard/orders"
          icon={ShoppingCart}
          label="Orders"
        />
      </nav>

      {/* FOOTER */}
      <div className="mt-auto p-4 text-xs text-blue-100 text-center">
        © Product Panel
      </div>
    </aside>
  );
};

export default Sidebar1;

/* ================= MAIN LINK ================= */
const SideLink = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
        isActive
          ? "bg-white text-blue-700 shadow-md"
          : "text-white/90 hover:bg-white/10"
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
        isActive ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10"
      }`
    }
  >
    <Icon size={16} />
    {label}
  </NavLink>
);
