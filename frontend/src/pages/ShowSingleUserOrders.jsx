import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/config/api";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";

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

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="text-center py-20 text-gray-400 animate-pulse">
        Loading your orders...
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
    <div className="w-screen mb-5 ">
      <div className="max-w-7xl mx-auto mt-5 px-4 min-h-screen">
        <h2 className="text-3xl  font-semibold mb-10 text-center text-blue-800">
          Orders
        </h2>

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
                {/* ===== HEADER ===== */}
                <div className="flex flex-wrap justify-between gap-4 mb-2">
                  <div>
                    <p className="text-sm font-bold text-gray-500">
                      Payment ID
                    </p>
                    <p className="font-medium text-gray-500 text-xs">
                      #{order.razorPayOrderId.slice(-6).toUpperCase()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-gray-500">
                      Payment Status
                    </p>
                    <p className="font-medium text-gray-500 text-xs">
                      {order.status}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-gray-500">Date</p>
                    <p className="font-medium text-gray-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-gray-500">Total</p>
                    <p className="font-bold text-gray-800 text-xs ">
                      ₹{order.totalAmount}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-gray-500">Items</p>
                    <p className="font-medium text-gray-500 text-xs">
                      {totalItems}
                    </p>
                  </div>
                </div>

                {/* ===== PRODUCTS ===== */}
                <div className="space-y-2 border-t pt-3">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm"
                    >
                      {/* truncated product name */}
                      <div className="flex">
                        <p className="text-gray-800 line-clamp-1 w-[85%] ">
                          {index + 1}. {item.productId?.productName}
                        </p>
                        <p className="font-semibold text-xs text-grey-700">
                          - {item.quantity} Qty
                        </p>
                      </div>
                      <p className="font-medium text-gray-800">
                        ₹{item.productId?.productPrice * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                {/* ===== ACTION ===== */}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ShowSingleUserOrders;
