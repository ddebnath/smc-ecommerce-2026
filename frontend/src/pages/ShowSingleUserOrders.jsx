import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_URL } from "@/config/api";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

const ShowSingleUserOrders = () => {
  const accessToken = localStorage.getItem("accessToken");
  const { userId } = useParams();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  const getOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/orders/get-order/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.data.success) {
        setOrders(res.data.orders);
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

  // ================= STATS =================
  const stats = useMemo(() => {
    const totalSpent = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);

    return {
      totalOrders: orders.length,
      totalSpent,
      avgOrder: orders.length > 0 ? (totalSpent / orders.length).toFixed(2) : 0,
      paid: orders.filter((o) => o.status === "Paid").length,
      pending: orders.filter((o) => o.status === "Pending").length,
      failed: orders.filter((o) => o.status === "Failed").length,
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
  if (orders.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">No orders found 🛒</div>
    );
  }

  return (
    <div className="w-screen mb-10">
      <div className="max-w-7xl mx-auto mt-5 px-4 min-h-screen">
        {/* ================= HEADER ================= */}
        <h2 className="text-3xl font-semibold mb-6 text-center text-blue-800">
          My Orders
        </h2>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <div className="bg-white border rounded-xl p-4 text-center shadow">
            <p className="text-sm text-gray-500">Orders</p>
            <p className="text-xl font-bold">{stats.totalOrders}</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-sm text-green-600">Spent</p>
            <p className="text-xl font-bold text-green-700">
              ₹{stats.totalSpent}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <p className="text-sm text-blue-600">Avg</p>
            <p className="text-xl font-bold text-blue-700">₹{stats.avgOrder}</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
            <p className="text-sm text-yellow-600">Pending</p>
            <p className="text-xl font-bold text-yellow-700">{stats.pending}</p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-sm text-red-600">Failed</p>
            <p className="text-xl font-bold text-red-700">{stats.failed}</p>
          </div>
        </div>

        {/* ================= ORDERS ================= */}
        <div className="space-y-6">
          {orders.map((order) => {
            const totalItems = order.items.reduce(
              (acc, item) => acc + (item.quantity || 0),
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
                    <p className="text-xs font-bold text-gray-500">
                      Payment ID
                    </p>
                    <p className="text-xs">
                      #{order.razorPayOrderId?.slice(-6)?.toUpperCase()}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-500">Status</p>
                    <p className="text-xs">{order.status}</p>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-500">Date</p>
                    <p className="text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-500">Total</p>
                    <p className="text-xs font-bold">₹{order.totalAmount}</p>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-500">Items</p>
                    <p className="text-xs">{totalItems}</p>
                  </div>
                </div>

                {/* PRODUCTS */}
                <div className="border-t pt-3 space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <p className="line-clamp-1 w-[70%]">
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

export default ShowSingleUserOrders;
