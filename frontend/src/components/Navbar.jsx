import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import Logo from "./Logo";
import { useSelector } from "react-redux";
import store from "../../src/redux/store.js";

const Navbar = () => {
  const { user } = useSelector((store) => store.user); // Access user data from Redux store
  const { cart } = useSelector((store) => store.product);
  const admin = user?.role === "admin" ? true : false;
  //  const accessToken = localStorage.getItem("accessToken"); // Get access token from local storage
  // calculating to number of items in the cart store
  // const totalNumberOfItems = user
  //   ? cart?.items && Array.isArray(cart.items)
  //     ? cart.items.reduce((acc, item) => acc + item.quantity, 0)
  //     : 0
  //   : 0;

  const totalNumberOfItems = user
    ? (cart?.items || []).reduce((acc, item) => acc + (item?.quantity ?? 0), 0)
    : 0;

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
              to="/product"
              className="text-sm font-semibold text-blue-50 transition hover:text-white hover:underline hover:underline-offset-4"
            >
              Products
            </Link>
          </div>

          {/* User Greeting and Shopping Cart */}
          <div className="flex items-center gap-6">
            {(user && (
              <Link to={`/profile/${user._id}`}>
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
            {admin && (
              <Link to={`/dashboard`}>
                {<span className="text-white">Dashboard</span>}
              </Link>
            )}
            {user && (
              <Link
                className=" text-white transition hover:text-white hover:underline hover:underline-offset-4"
                to="/auth/logout"
              >
                Logout
              </Link>
            )}
            {/* Shopping Cart */}
            <Link
              className="relative inline-flex items-center justify-center rounded-full bg-white p-2 text-blue-600 transition hover:bg-blue-100 hover:shadow-md"
              to="/cart"
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-md">
                {totalNumberOfItems || 0}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
