import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import Logo from "./Logo";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((store) => store.user);
  const { cart } = useSelector((store) => store.product);

  const [open, setOpen] = useState(false);

  const admin = user?.role === "admin";

  const totalNumberOfItems = user
    ? (cart?.items || []).reduce((acc, item) => acc + (item?.quantity ?? 0), 0)
    : 0;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <Logo />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-lg font-medium ${
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
                `text-lg font-medium ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`
              }
            >
              Products
            </NavLink>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-5">
            {user ? (
              <Link
                to={`/profile/${user._id}`}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                  {user.firstName?.charAt(0)}
                </div>
                <span className="text-gray-700">{user.firstName}</span>
              </Link>
            ) : (
              <Link
                to="/auth/login"
                className="text-gray-700 hover:text-blue-600"
              >
                Login
              </Link>
            )}

            {admin && (
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-blue-600"
              >
                Dashboard
              </Link>
            )}

            {user && (
              <Link
                to="/auth/logout"
                className="text-gray-700 hover:text-red-500"
              >
                Logout
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {totalNumberOfItems > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-blue-600 text-white px-1 rounded-full">
                  {totalNumberOfItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden mt-4 flex flex-col gap-4 border-t pt-4">
            <NavLink to="/" onClick={() => setOpen(false)}>
              Home
            </NavLink>

            <NavLink to="/product" onClick={() => setOpen(false)}>
              Products
            </NavLink>

            {user ? (
              <Link to={`/profile/${user._id}`} onClick={() => setOpen(false)}>
                Profile
              </Link>
            ) : (
              <Link to="/auth/login" onClick={() => setOpen(false)}>
                Login
              </Link>
            )}

            {admin && (
              <Link to="/dashboard" onClick={() => setOpen(false)}>
                Dashboard
              </Link>
            )}

            {user && (
              <Link to="/auth/logout" onClick={() => setOpen(false)}>
                Logout
              </Link>
            )}

            <Link to="/cart" onClick={() => setOpen(false)}>
              Cart ({totalNumberOfItems})
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
