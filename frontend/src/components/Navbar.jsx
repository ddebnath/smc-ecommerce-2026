import React, { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import Logo from "./Logo";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Placeholder for auth state
  const [userName, setUserName] = useState("John"); // Placeholder for user name
  const { user, accessToken, cartValue, incrementCart, decrementCart } =
    useContext(AuthContext);

  return (
    <nav className="sticky top-0 z-50 border-b-4 border-blue-600 bg-gradient-to-r from-blue-800 to-blue-600 shadow-lg">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <Logo />
          </Link>
          {/* Navigation Links */}
          <div className="hidden gap-8 md:flex">
            <Link
              to="/"
              className="text-sm font-semibold text-blue-50 transition hover:text-white hover:underline hover:underline-offset-4"
            >
              Home
            </Link>
            <Link
              to="/"
              className="text-sm font-semibold text-blue-50 transition hover:text-white hover:underline hover:underline-offset-4"
            >
              Products
            </Link>
          </div>

          {/* User Greeting and Shopping Cart */}
          <div className="flex items-center gap-6">
            {(user && (
              <Link to="/profile">
                {
                  <span className="text-white">
                    Welcome, {user.firstName} {user.lastName}
                  </span>
                }
              </Link>
            )) || (
              <Link to="/auth/login">
                {" "}
                <span>Login</span>{" "}
              </Link>
            )}

            {accessToken && (
              <Link
                className="text-sm font-semibold text-blue-50 transition hover:text-white hover:underline hover:underline-offset-4"
                to="/auth/logout"
              >
                Logout
              </Link>
            )}
            {/* Shopping Cart */}
            <button className="relative inline-flex items-center justify-center rounded-full bg-white p-2 text-blue-600 transition hover:bg-blue-100 hover:shadow-md">
              <ShoppingCart className="h-6 w-6" />
              {cartValue >= 0 && (
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-md">
                  {cartValue}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
