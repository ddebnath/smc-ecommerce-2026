import React, { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    profilePic: null,
  });

  const [preview, setPreview] = useState(null);

  // 🔹 Dummy orders (replace with API later)
  const orders = [
    {
      id: "ORD1234",
      date: "12 Apr 2026",
      total: 999,
      status: "Delivered",
      items: ["T-Shirt", "Jeans"],
    },
    {
      id: "ORD5678",
      date: "05 Apr 2026",
      total: 1499,
      status: "Shipped",
      items: ["Shoes"],
    },
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profilePic") {
      const file = files[0];
      setFormData({ ...formData, profilePic: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
    });

    try {
      await fetch("http://localhost:8000/api/v1/user/update-profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer YOUR_TOKEN`,
        },
        body: data,
      });

      alert("Profile updated successfully");
    } catch {
      alert("Error updating profile");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-slate-900 px-4">
      <div className="w-full max-w-3xl">
        <Tabs defaultValue="settings" className="w-full">
          {/* Tabs */}
          <TabsList className="grid grid-cols-2 bg-gray-800 text-white rounded-xl mb-6">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          {/* ================= SETTINGS ================= */}
          <TabsContent value="settings">
            <Card className="bg-gray-900/80 backdrop-blur-xl border border-gray-700 shadow-2xl rounded-3xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl text-white">
                  Profile Settings
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Update your personal details
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Image */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-gray-800 border-2 border-blue-500 overflow-hidden">
                      {preview ? (
                        <img
                          src={preview}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 text-xs">
                          Upload
                        </div>
                      )}
                    </div>

                    <input
                      type="file"
                      name="profilePic"
                      accept="image/*"
                      onChange={handleChange}
                      className="text-sm text-gray-300 file:bg-blue-600 file:text-white file:px-3 file:py-1 file:rounded"
                    />
                  </div>

                  {/* Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      onChange={handleChange}
                      className="p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      onChange={handleChange}
                      className="p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="password"
                    name="password"
                    placeholder="New Password"
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                  />

                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:scale-[1.02] transition">
                    Save Changes
                  </button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ================= ORDERS ================= */}
          <TabsContent value="orders">
            <Card className="bg-gray-900/80 backdrop-blur-xl border border-gray-700 shadow-2xl rounded-3xl text-white">
              <CardHeader>
                <CardTitle className="text-2xl">Your Orders</CardTitle>
                <CardDescription className="text-gray-400">
                  View and track your purchases
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-blue-500 transition"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{order.id}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          order.status === "Delivered"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-400">Date: {order.date}</p>

                    <p className="text-sm text-gray-400">
                      Items: {order.items.join(", ")}
                    </p>

                    <div className="flex justify-between mt-2">
                      <span className="font-medium text-blue-400">
                        ₹{order.total}
                      </span>

                      <button className="text-sm text-indigo-400 hover:underline">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
