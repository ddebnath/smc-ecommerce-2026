import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, Menu } from "lucide-react";
import Logo from "./Logo";
import { useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { user } = useSelector((store) => store.user);
  const { cart } = useSelector((store) => store.product);

  const admin = user?.role === "admin";
  const productOwner = user?.role === "productOwner";

  const totalNumberOfItems = user
    ? (cart?.items || []).reduce((acc, item) => acc + (item?.quantity ?? 0), 0)
    : 0;

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/">
          <Logo />
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/product" className={navLinkClass}>
            Products
          </NavLink>

          {user && (
            <NavLink
              to={`/show-user-orders/${user._id}`}
              className={navLinkClass}
            >
              Orders
            </NavLink>
          )}
          <NavLink to="/event" className={navLinkClass}>
            Event Gallery
          </NavLink>
        </div>

        {/* RIGHT SECTION */}
        <div className="hidden md:flex items-center gap-4">
          {/* CART */}
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-5 w-5 text-gray-700" />
            {totalNumberOfItems > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-blue-600 text-white px-1.5 rounded-full">
                {totalNumberOfItems}
              </span>
            )}
          </Link>

          {/* USER MENU */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                    {user.firstName?.charAt(0)}
                  </div>
                  <span className="hidden sm:block">{user.firstName}</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`/profile/${user._id}`}>Profile</Link>
                </DropdownMenuItem>

                {admin && (
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}

                {productOwner && (
                  <DropdownMenuItem asChild>
                    <Link to="/product-owner-dashboard">Owner Dashboard</Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem asChild>
                  <Link to="/auth/logout" className="text-red-500">
                    Logout
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="outline">
              <Link to="/auth/login">Login</Link>
            </Button>
          )}
        </div>

        {/* MOBILE MENU */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-64">
              <div className="flex flex-col gap-5 mt-6">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/product">Products</NavLink>
                <NavLink to="/gallery">Gallery</NavLink>

                {user && (
                  <Link to={`/show-user-orders/${user._id}`}>Orders</Link>
                )}

                {user ? (
                  <>
                    <Link to={`/profile/${user._id}`}>Profile</Link>

                    {admin && <Link to="/dashboard">Dashboard</Link>}
                    {productOwner && (
                      <Link to="/product-owner-dashboard">Dashboard</Link>
                    )}

                    <Link to="/auth/logout" className="text-red-500">
                      Logout
                    </Link>
                  </>
                ) : (
                  <Link to="/auth/login">Login</Link>
                )}

                <Link to="/cart">Cart ({totalNumberOfItems})</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
