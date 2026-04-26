import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const PaymentSuccessful = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const order = state?.order;

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-semibold text-gray-700">
          No order data found
        </h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-2xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <CheckCircle className="mx-auto text-green-500 w-16 h-16" />
          <h1 className="text-2xl font-bold text-gray-800">
            Payment Successful 🎉
          </h1>
          <p className="text-gray-500">
            Thank you for your purchase! Your order has been confirmed.
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-xl p-5 space-y-2 text-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Order Details
          </h2>

          <div className="flex justify-between">
            <span className="text-gray-500">Order ID</span>
            <span className="font-medium">{order._id}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Amount Paid</span>
            <span className="font-medium text-green-600">
              ₹{order.totalAmount}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Payment Status</span>
            <span className="font-medium">{order.status}</span>
          </div>

          {order.razorPayPaymentId && (
            <div className="flex justify-between">
              <span className="text-gray-500">Payment ID</span>
              <span className="font-medium">{order.razorPayPaymentId}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-500">Date</span>
            <span className="font-medium">
              {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Items (if available)
        {order.items && order.items.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-700">Items</h2>

            <div className="divide-y">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between py-2 text-sm">
                  <span className="text-gray-600">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )} */}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={() => navigate("/orders")}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
          >
            View Orders
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex-1 border border-gray-300 hover:bg-gray-100 py-2 rounded-lg transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessful;
