import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

const COLORS = ["#22c55e", "#facc15", "#ef4444"];

// 🔘 VIEW STATE DATA

const statsData = {
  weekly: [
    { title: "Users", value: 120 },
    { title: "Orders", value: 32 },
    { title: "Products", value: 15 },
    { title: "Revenue", value: "₹4,200" },
  ],
  monthly: [
    { title: "Users", value: 1200 },
    { title: "Orders", value: 320 },
    { title: "Products", value: 85 },
    { title: "Revenue", value: "₹12,400" },
  ],
  yearly: [
    { title: "Users", value: 15000 },
    { title: "Orders", value: 4200 },
    { title: "Products", value: 500 },
    { title: "Revenue", value: "₹2,40,000" },
  ],
};

// 📊 SALES
const salesData = {
  weekly: [
    { label: "W1", paid: 1200, pending: 400, failed: 100 },
    { label: "W2", paid: 1500, pending: 500, failed: 120 },
    { label: "W3", paid: 1800, pending: 600, failed: 150 },
    { label: "W4", paid: 2000, pending: 700, failed: 200 },
    { label: "W5", paid: 2200, pending: 800, failed: 250 },
  ],
  monthly: [
    { label: "Jan", paid: 8000, pending: 3000, failed: 800 },
    { label: "Feb", paid: 9000, pending: 3200, failed: 900 },
    { label: "Mar", paid: 10000, pending: 3500, failed: 1000 },
    { label: "Apr", paid: 11000, pending: 4000, failed: 1200 },
    { label: "May", paid: 12000, pending: 4200, failed: 1400 },
  ],
  yearly: [
    { label: "2021", paid: 80000, pending: 20000, failed: 5000 },
    { label: "2022", paid: 90000, pending: 25000, failed: 6000 },
    { label: "2023", paid: 110000, pending: 30000, failed: 7000 },
    { label: "2024", paid: 130000, pending: 35000, failed: 8000 },
    { label: "2025", paid: 150000, pending: 40000, failed: 9000 },
  ],
};
// 📈 REVENUE
const revenueData = {
  weekly: [
    { label: "W1", revenue: 5000 },
    { label: "W2", revenue: 7000 },
    { label: "W3", revenue: 9000 },
    { label: "W4", revenue: 11000 },
    { label: "W5", revenue: 13000 },
  ],
  monthly: [
    { label: "Jan", revenue: 20000 },
    { label: "Feb", revenue: 25000 },
    { label: "Mar", revenue: 30000 },
    { label: "Apr", revenue: 35000 },
    { label: "May", revenue: 40000 },
  ],
  yearly: [
    { label: "2021", revenue: 200000 },
    { label: "2022", revenue: 250000 },
    { label: "2023", revenue: 300000 },
    { label: "2024", revenue: 350000 },
    { label: "2025", revenue: 400000 },
  ],
};
// 👑 TOP CUSTOMERS
const topCustomers = {
  weekly: [
    { name: "Rahul", spent: 1200 },
    { name: "Aman", spent: 950 },
    { name: "Priya", spent: 870 },
    { name: "Neha", spent: 650 },
    { name: "Ravi", spent: 500 },
  ],
  monthly: [
    { name: "Rahul", spent: 12000 },
    { name: "Aman", spent: 9500 },
    { name: "Priya", spent: 8700 },
    { name: "Neha", spent: 6500 },
    { name: "Ravi", spent: 5000 },
  ],
  yearly: [
    { name: "Rahul", spent: 120000 },
    { name: "Aman", spent: 95000 },
    { name: "Priya", spent: 87000 },
    { name: "Neha", spent: 65000 },
    { name: "Ravi", spent: 50000 },
  ],
};

// 🛍️ MOST SOLD
const topProducts = {
  weekly: [
    { name: "Shoes", sold: 40 },
    { name: "T-shirt", sold: 35 },
    { name: "Bag", sold: 28 },
    { name: "Watch", sold: 22 },
    { name: "Cap", sold: 15 },
  ],
  monthly: [
    { name: "Shoes", sold: 140 },
    { name: "T-shirt", sold: 120 },
    { name: "Bag", sold: 100 },
    { name: "Watch", sold: 90 },
    { name: "Cap", sold: 70 },
  ],
  yearly: [
    { name: "Shoes", sold: 1400 },
    { name: "T-shirt", sold: 1200 },
    { name: "Bag", sold: 1000 },
    { name: "Watch", sold: 900 },
    { name: "Cap", sold: 700 },
  ],
};

// ⚠️ RESTOCK
const restockProducts = {
  weekly: [
    { name: "iPhone Case", stock: 2 },
    { name: "Hoodie XL", stock: 0 },
    { name: "Sneakers", stock: 3 },
    { name: "Backpack", stock: 1 },
    { name: "Cap", stock: 2 },
  ],
  monthly: [
    { name: "iPhone Case", stock: 5 },
    { name: "Hoodie XL", stock: 1 },
    { name: "Sneakers", stock: 4 },
    { name: "Backpack", stock: 2 },
    { name: "Cap", stock: 3 },
  ],
  yearly: [
    { name: "iPhone Case", stock: 10 },
    { name: "Hoodie XL", stock: 3 },
    { name: "Sneakers", stock: 8 },
    { name: "Backpack", stock: 5 },
    { name: "Cap", stock: 6 },
  ],
};

const pieData = [
  { name: "Paid", value: 400 },
  { name: "Pending", value: 300 },
  { name: "Failed", value: 100 },
];

export default function AdminDashBoard() {
  const [view, setView] = useState("weekly");

  return (
    <div className="ml-50 my-5 flex justify-center dark:bg-gray-900 min-h-screen">
      <div className="w-full max-w-7xl p-6 space-y-6 text-gray-800 dark:text-gray-200">
        <h1 className="text-2xl font-bold text-center">Admin Dashboard</h1>

        {/* 🔘 RADIO */}
        <div className="flex justify-center gap-6">
          {["weekly", "monthly", "yearly"].map((type) => (
            <label key={type} className="flex items-center gap-2">
              <input
                type="radio"
                checked={view === type}
                onChange={() => setView(type)}
              />
              {type}
            </label>
          ))}
        </div>

        {/* 👇 NEW SECTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customers */}
          <Card>
            <CardContent className="p-4">
              <h2>Top Customers</h2>
              {topCustomers[view].map((c, i) => (
                <div key={i} className="flex justify-between">
                  <span>{c.name}</span>
                  <span className="text-green-500">₹{c.spent}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Products */}
          <Card>
            <CardContent className="p-4">
              <h2>Most Sold</h2>
              {topProducts[view].map((p, i) => (
                <div key={i} className="flex justify-between">
                  <span>{p.name}</span>
                  <span>{p.sold}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Restock */}
          <Card>
            <CardContent className="p-4">
              <h2>Restock Needed</h2>
              {restockProducts[view].map((p, i) => (
                <div key={i} className="flex justify-between">
                  <span>{p.name}</span>
                  <span className="text-red-500">{p.stock} left</span>
                </div>
              ))}
            </CardContent>
          </Card>
          {/* add new data*/}
        </div>

        {/* 🔹 Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {statsData[view].map((item, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <p>{item.title}</p>
                <h2 className="text-xl font-semibold">{item.value}</h2>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 📊 Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-4">
              <h2>{view.toUpperCase()} Sales</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData[view]}>
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="paid" fill="#22c55e" />
                  <Bar dataKey="pending" fill="#facc15" />
                  <Bar dataKey="failed" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h2>Order Status</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} dataKey="value">
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* 📈 Revenue */}
        <Card>
          <CardContent className="p-4">
            <h2>{view.toUpperCase()} Revenue</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData[view]}>
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
