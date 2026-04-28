import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_URL } from "@/config/api";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import store from "@/redux/store";

const AdminOrders = () => {
  const accessToken = localStorage.getItem("accessToken");
  const { user } = useSelector((store) => store.user);

  const userId = user?._id;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  // ================= FETCH =================
  const getOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/orders/get-all-order/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.data.success) {
        setOrders(res.data.orders);
        setCount(res.data.count);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    getOrders();
  }, [userId]);

  // ================= STATS (OPTIMIZED) =================
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce(
      (acc, o) => acc + (o.totalAmount || 0),
      0,
    );

    return {
      totalOrders: orders.length,
      totalRevenue,
      paid: orders.filter((o) => o.status === "Paid").length,
      pending: orders.filter((o) => o.status === "Pending").length,
      failed: orders.filter((o) => o.status === "Failed").length,
      avgOrder:
        orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : 0,
    };
  }, [orders]);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="text-center py-20 text-gray-400 animate-pulse">
        Loading orders...
      </div>
    );
  }

  // ================= EMPTY =================
  if (count === 0) {
    return (
      <div className="text-center py-20 text-gray-400">No orders found 🛒</div>
    );
  }

  return (
    <div className="ml-25 w-screen mb-10">
      <div className="max-w-7xl mx-auto mt-5 px-4 min-h-screen">
        {/* ================= HEADER ================= */}
        <h2 className="text-3xl font-semibold mb-6 text-center text-blue-800">
          Admin Orders Dashboard
        </h2>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-10">
          <div className="bg-white shadow rounded-xl p-4 text-center border">
            <p className="text-sm text-gray-500">Orders</p>
            <p className="text-xl font-bold">{stats.totalOrders}</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-sm text-green-600">Revenue</p>
            <p className="text-xl font-bold text-green-700">
              ₹{stats.totalRevenue}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <p className="text-sm text-blue-600">Paid</p>
            <p className="text-xl font-bold text-blue-700">{stats.paid}</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
            <p className="text-sm text-yellow-600">Pending</p>
            <p className="text-xl font-bold text-yellow-700">{stats.pending}</p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-sm text-red-600">Failed</p>
            <p className="text-xl font-bold text-red-700">{stats.failed}</p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
            <p className="text-sm text-purple-600">Avg Order</p>
            <p className="text-xl font-bold text-purple-700">
              ₹{stats.avgOrder}
            </p>
          </div>
        </div>

        {/* ================= ORDERS ================= */}
        <div className="space-y-6">
          {orders.map((order) => {
            const totalItems = order.items.reduce(
              (acc, item) => acc + item.quantity,
              0,
            );

            return (
              <div
                key={order._id}
                className="bg-green-100 border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
              >
                {/* HEADER */}
                <div className="flex flex-wrap justify-between gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 font-bold">Order ID</p>
                    <p className="text-xs font-medium">
                      #{order.razorPayOrderId?.slice(-6)?.toUpperCase()}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 font-bold">Status</p>
                    <p className="text-xs font-medium">{order.status}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 font-bold">Date</p>
                    <p className="text-xs font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 font-bold">Total</p>
                    <p className="text-xs font-bold">₹{order.totalAmount}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 font-bold">Items</p>
                    <p className="text-xs font-medium">{totalItems}</p>
                  </div>
                </div>

                {/* PRODUCTS */}
                <div className="border-t pt-3 space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <p className="text-gray-800 line-clamp-1 w-[70%]">
                        {index + 1}. {item.productId?.productName}
                      </p>

                      <p className="text-xs text-gray-600">
                        Qty: {item.quantity}
                      </p>

                      <p className="font-medium">
                        ₹{(item.productId?.productPrice || 0) * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
