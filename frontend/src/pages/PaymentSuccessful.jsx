import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle } from "lucide-react";
import { API_URL } from "@/config/api";

const PaymentSuccessful = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchOrderAndProducts = async () => {
      try {
        // 1️⃣ Fetch order
        const orderRes = await axios.get(`${API_URL}/orders/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const orderData = orderRes.data.order;
        setOrder(orderData);

        for (const item of orderData.items) {
          try {
            let productId = item.productId._id;
            const res = await axios.get(`${API_URL}/product/${productId}`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });

            setProducts((prev) => [
              ...prev,
              {
                _id: item.productId._id,
                productName: res.data.product.productName,
                productPrice: res.data.product.productPrice,
                productImg: res.data.product.productImg[0],
                quantity: item.quantity,
              },
            ]);
          } catch (err) {
            console.error("Product fetch failed:", err);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderAndProducts();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center mt-20">
        Order not found
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 px-4 py-10 flex justify-center">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-3xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <CheckCircle className="mx-auto text-green-500 w-16 h-16" />
          <h1 className="text-2xl font-bold mt-2">Payment Successful 🎉</h1>
          <p className="text-gray-500">
            Your order has been placed successfully
          </p>
        </div>

        {/* Order Info */}
        <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
          <div className="flex justify-between">
            <span>Order ID</span>
            <span className="font-medium">{order._id}</span>
          </div>

          <div className="flex justify-between">
            <span>Status</span>
            <span className="text-green-600 font-medium">{order.status}</span>
          </div>

          <div className="flex justify-between">
            <span>Date</span>
            <span>{new Date(order.createdAt).toLocaleString()}</span>
          </div>
        </div>

        {/* Products */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Items Ordered</h2>

          <div className="space-y-4">
            {products.map((product, index) => (
              <div key={index} className="flex gap-2 border-b pb-3">
                <div className="flex flex-col">
                  <img
                    src={product.productImg.url}
                    alt=""
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <p className="truncate w-20">{product.productName}</p>
                </div>

                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-500">
                    ₹{product.productPrice} × {product.quantity}
                  </p>
                </div>

                <div className="font-medium">
                  ₹{product.productPrice * product.quantity}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{order.subtotal || order.totalAmount}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span>₹{order.tax || 0}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>₹{order.shipping || 0}</span>
          </div>

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-green-600">₹{order.totalAmount}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/orders")}
            className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
          >
            View Orders
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex-1 border py-2 rounded-lg hover:bg-gray-100"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessful;
