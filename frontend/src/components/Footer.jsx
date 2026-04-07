import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-gray-900 text-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Company Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">SMC Store</h3>
            <p className="text-sm text-gray-400">
              Your trusted online shopping destination for quality products and
              great deals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="/" className="hover:text-gray-50">
                  Home
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-gray-50">
                  Products
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-gray-50">
                  About Us
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-gray-50">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">
              Contact Us
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <a
                  href="mailto:info@smcstore.com"
                  className="hover:text-gray-50"
                >
                  info@smcstore.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <a href="tel:+1234567890" className="hover:text-gray-50">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} />
                <span>123 Main St, City, State 12345</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-gray-700" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-400 md:flex-row">
          <p>&copy; 2026 SMC Store. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/" className="hover:text-gray-50">
              Privacy Policy
            </a>
            <a href="/" className="hover:text-gray-50">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
