import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  PackagePlus,
  PackageSearch,
} from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", path: "/dashboard/sales", icon: LayoutDashboard },
    { name: "Add Products", path: "/dashboard/add-product", icon: PackagePlus },
    { name: "Products", path: "/dashboard/products", icon: PackageSearch },
    { name: "Users", path: "/dashboard/users", icon: Users },
    { name: "Orders", path: "/dashboard/orders", icon: ShoppingCart },
  ];

  return (
    <div className="hidden md:flex fixed left-0 top-0 h-screen w-[260px] bg-blue-600 text-white shadow-lg flex-col p-6">
      {/* Title */}
      <div className="text-2xl font-bold mt-20 text-center">Admin Panel</div>

      {/* Menu */}
      <nav className="flex flex-col gap-3 mt-10">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium transition-all duration-200
                ${
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

export default Sidebar;
