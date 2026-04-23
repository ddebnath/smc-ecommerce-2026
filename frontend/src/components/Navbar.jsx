import React from "react";
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import Logo from "./Logo";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((store) => store.user);
  const { cart } = useSelector((store) => store.product);

  const admin = user?.role === "admin";

  const totalNumberOfItems = user
    ? (cart?.items || []).reduce((acc, item) => acc + (item?.quantity ?? 0), 0)
    : 0;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Logo />
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-lg font-medium transition ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/product"
              className={({ isActive }) =>
                `text-lg font-medium transition ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`
              }
            >
              Products
            </NavLink>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-5">
            {/* User */}
            {user ? (
              <Link
                to={`/profile/${user._id}`}
                className="flex items-center gap-2 group"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                  {user.firstName?.charAt(0)}
                </div>

                <span className="hidden sm:block text-lg text-gray-700 group-hover:text-blue-600 transition">
                  {user.firstName}
                </span>
              </Link>
            ) : (
              <Link
                to="/auth/login"
                className="text-lg text-gray-700 hover:text-blue-600 transition"
              >
                Login
              </Link>
            )}

            {/* Admin */}
            {admin && (
              <Link
                to="/dashboard"
                className="text-lg text-gray-700 hover:text-blue-600 transition"
              >
                Dashboard
              </Link>
            )}

            {/* Logout */}
            {user && (
              <Link
                to="/auth/logout"
                className="text-lg text-gray-700 hover:text-red-500 transition"
              >
                Logout
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center justify-center"
            >
              <div className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 transition">
                <ShoppingCart className="h-5 w-5 text-gray-700" />
              </div>

              {/* Badge */}
              {totalNumberOfItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-blue-600 text-[10px] text-white font-bold">
                  {totalNumberOfItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
