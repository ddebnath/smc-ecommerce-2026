import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const TopOverlayMenu = () => {
  const [open, setOpen] = useState(false);

  // Auto open on page load
  useEffect(() => {
    setTimeout(() => setOpen(true), 300); // slight delay feels smoother
  }, []);

  return (
    <>
      {/* HERO SECTION */}
      <div className="h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-4xl font-bold">
        Hero Section
      </div>

      {/* OVERLAY MENU */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-500 ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* BACKDROP */}
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* SLIDING PANEL */}
        <div
          className={`absolute top-0 left-0 w-full bg-white shadow-xl rounded-b-3xl transform transition-transform duration-500 ${
            open ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="p-6 flex justify-between items-center border-b">
            <h2 className="text-xl font-semibold">Menu</h2>
            <Button size="icon" variant="ghost" onClick={() => setOpen(false)}>
              <X />
            </Button>
          </div>

          {/* MENU ITEMS */}
          <div className="p-6 grid gap-4 text-lg">
            <a href="#" className="hover:text-primary transition">
              Home
            </a>
            <a href="#" className="hover:text-primary transition">
              Events
            </a>
            <a href="#" className="hover:text-primary transition">
              Gallery
            </a>
            <a href="#" className="hover:text-primary transition">
              Contact
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopOverlayMenu;
