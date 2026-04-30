import {
  LayoutDashboard,
  ShoppingCart,
  PackagePlus,
  PackageSearch,
} from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar1 = () => {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/product-owner-dashboard",
      icon: LayoutDashboard,
      end: true, // ✅ only exact match
    },
    {
      name: "Add Products",
      path: "/product-owner-dashboard/add-product",
      icon: PackagePlus,
    },
    {
      name: "Products",
      path: "/product-owner-dashboard/products",
      icon: PackageSearch,
    },
    {
      name: "Orders",
      path: "/product-owner-dashboard/orders",
      icon: ShoppingCart,
    },
  ];

  return (
    <div className="hidden md:flex fixed left-0 top-0 h-screen w-[260px] bg-blue-600 text-white shadow-lg flex-col p-6">
      {/* Title */}
      <div className="text-2xl font-bold mt-20 text-center">Product Panel</div>

      {/* Menu */}
      <nav className="flex flex-col gap-3 mt-10">
        {menuItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={index}
              to={item.path}
              end={item.end} // ✅ applied here
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white text-blue-600 shadow-md"
                    : "hover:bg-blue-500 hover:text-white"
                }`
              }
            >
              <Icon size={22} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar1;
