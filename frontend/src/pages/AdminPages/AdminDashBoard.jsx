import React from "react";
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

// 🎨 Colors
const COLORS = ["#22c55e", "#facc15", "#ef4444"];

// 📊 Dummy data
const salesData = [
  { month: "Jan", paid: 4000, pending: 2400, failed: 400 },
  { month: "Feb", paid: 3000, pending: 1398, failed: 300 },
  { month: "Mar", paid: 2000, pending: 9800, failed: 200 },
  { month: "Apr", paid: 2780, pending: 3908, failed: 500 },
  { month: "May", paid: 1890, pending: 4800, failed: 100 },
];

const lineData = [
  { day: "Mon", revenue: 1200 },
  { day: "Tue", revenue: 2100 },
  { day: "Wed", revenue: 800 },
  { day: "Thu", revenue: 1600 },
  { day: "Fri", revenue: 2400 },
];

const pieData = [
  { name: "Paid", value: 400 },
  { name: "Pending", value: 300 },
  { name: "Failed", value: 100 },
];

const stats = [
  { title: "Users", value: 1200 },
  { title: "Orders", value: 320 },
  { title: "Products", value: 85 },
  { title: "Revenue", value: "₹12,400" },
];

const topProducts = [
  { name: "Shoes", sold: 120 },
  { name: "T-shirt", sold: 95 },
  { name: "Bag", sold: 80 },
];

const lowStock = [
  { name: "iPhone Case", stock: 3 },
  { name: "Hoodie XL", stock: 0 },
];

export default function AdminDashBoard() {
  return (
    <div className="ml-50 my-5 flex justify-center dark:bg-gray-900 min-h-screen">
      <div className="w-full max-w-7xl p-6 space-y-6 text-gray-800 dark:text-gray-200">
        <h1 className="text-2xl font-bold text-center">Admin Dashboard</h1>

        {/* 🔹 Stats */}
        <div className="my-10 grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((item, index) => (
            <Card key={index} className="shadow rounded-2xl dark:bg-gray-800">
              <CardContent className="p-4">
                <p className="text-gray-500 dark:text-gray-400">{item.title}</p>
                <h2 className="text-xl font-semibold">{item.value}</h2>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 📊 Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow rounded-2xl dark:bg-gray-800">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Monthly Sales</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="paid" fill="#22c55e" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="pending" fill="#facc15" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="failed" fill="#ef4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow rounded-2xl dark:bg-gray-800">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Order Status</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* 📈 Line Chart with gradient */}
        <Card className="shadow rounded-2xl dark:bg-gray-800">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Weekly Revenue</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 📦 Bottom */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow rounded-2xl dark:bg-gray-800">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Top Products</h2>
              <ul className="space-y-2">
                {topProducts.map((p, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{p.name}</span>
                    <span className="font-medium text-green-500">
                      {p.sold} sold
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow rounded-2xl dark:bg-gray-800">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Stock Alerts</h2>
              <ul className="space-y-2">
                {lowStock.map((item, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{item.name}</span>
                    <span
                      className={
                        item.stock === 0
                          ? "text-red-500 font-semibold"
                          : "text-yellow-500"
                      }
                    >
                      {item.stock === 0 ? "Out of stock" : `${item.stock} left`}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
