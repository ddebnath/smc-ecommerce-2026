import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/config/api.js";
import { useSelector } from "react-redux";
import store from "@/redux/store";

const DeliveryAddress = () => {
  const accessToken = localStorage.getItem("accessToken");
  const { cart } = useSelector((store) => store.product);
  const [addresses, setAddresses] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(undefined);
  const [showForm, setShowForm] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
  });

  // ================= FETCH =================
  const getAddresses = async () => {
    try {
      const res = await axios.get(`${API_URL}/address/get-address`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.data.success) {
        setAddresses(res.data.addresses);
        setSelectedIndex(res.data.selectedAddress);
        setShowForm(res.data.addresses.length === 0);
      }
    } catch (err) {
      console.log("fetch error:", err);
    }
  };

  useEffect(() => {
    getAddresses();
  }, []);

  // ================= INPUT =================
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= ADD =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_URL}/address/add`, formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.data.success) {
        await getAddresses();
        setShowForm(false);

        setFormData({
          fullName: "",
          phone: "",
          email: "",
          address: "",
          city: "",
          state: "",
          zipcode: "",
          country: "",
        });
      }
    } catch (err) {
      console.log("add error:", err);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (index) => {
    if (!window.confirm("Delete this address?")) return;

    try {
      const res = await axios.delete(`${API_URL}/address/delete/${index}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.data.success) {
        await getAddresses();
      }
    } catch (err) {
      console.log("delete error:", err);
    }
  };

  // ================= SELECT =================
  const handleSelect = async (index) => {
    try {
      await axios.put(
        `${API_URL}/address/select`,
        { index },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      setSelectedIndex(index);
    } catch (err) {
      console.log("select error:", err);
    }
  };

  // ================= PROCEED =================
  const handleProceed = () => {
    if (selectedIndex === undefined) {
      alert("Please select an address");
      return;
    }

    console.log("Proceeding with:", {
      address: addresses[selectedIndex],
      paymentMethod,
    });

    // 👉 navigate("/payment") OR call order API
  };

  const noOfItems = cart?.items?.length;
  const totalPrice = cart?.totalPrice;
  const deleveryCharge = totalPrice >= 500 ? 0 : 50;
  const totalPayable = totalPrice + deleveryCharge;
  return (
    <div className="mt-20 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* ================= LEFT: ADDRESS ================= */}
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Delivery Address
        </h2>

        {/* ADDRESS LIST */}
        {addresses.length > 0 && !showForm && (
          <div className="space-y-4 mb-6">
            {addresses.map((addr, index) => {
              const isSelected = selectedIndex === index;

              return (
                <div
                  key={index}
                  className={`border p-4 rounded-lg relative ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 shadow"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex gap-3">
                    <input
                      type="radio"
                      name="address"
                      checked={isSelected}
                      onChange={() => handleSelect(index)}
                      className="mt-1 accent-blue-500"
                    />

                    <div>
                      <p className="font-semibold">{addr.fullName}</p>
                      <p>{addr.address}</p>
                      <p>
                        {addr.city}, {addr.state} - {addr.zipcode}
                      </p>
                      <p>{addr.phone}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(index)}
                    className="absolute top-2 right-2 text-red-500 text-sm"
                  >
                    Delete
                  </button>
                </div>
              );
            })}

            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              + Add New Address
            </button>
          </div>
        )}

        {/* FORM */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow"
          >
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="p-3 border rounded"
              required
            />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="p-3 border rounded"
              required
            />
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="p-3 border rounded"
            />
            <input
              name="zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              placeholder="Zip Code"
              className="p-3 border rounded"
              required
            />
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              className="p-3 border rounded"
              required
            />
            <input
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
              className="p-3 border rounded"
              required
            />
            <input
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
              className="p-3 border rounded"
              required
            />

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Full Address"
              className="p-3 border rounded md:col-span-2"
              required
            />

            <div className="md:col-span-2 flex gap-4">
              <button className="flex-1 bg-blue-500 text-white py-3 rounded">
                Save Address
              </button>

              {addresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 py-3 rounded"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      {/* ================= RIGHT: SUMMARY ================= */}
      <div className="bg-white p-6 rounded-xl shadow h-fit">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

        {/* Selected Address */}
        {addresses[selectedIndex] && (
          <div className="mb-4 text-sm border-b pb-3">
            <p className="font-semibold">Deliver To:</p>
            <p>{addresses[selectedIndex].fullName}</p>
            <p>{addresses[selectedIndex].address}</p>
            <p>
              {addresses[selectedIndex].city}, {addresses[selectedIndex].state}
            </p>
            <p>{addresses[selectedIndex].phone}</p>
          </div>
        )}

        {/* Dummy Pricing */}
        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span>No of Items</span>
            <span>{noOfItems}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Price</span>
            <span>{totalPrice}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery (free above 500) </span>
            <span>{deleveryCharge}</span>
          </div>
          <div className="flex justify-between font-semibold border-t pt-2">
            <span>Amount Payable</span>
            <span>{totalPayable}</span>
          </div>
        </div>

        {/* Payment Options */}
        <div className="mb-4">
          <p className="font-semibold mb-2">Payment Method</p>

          <label className="flex gap-2 text-sm">
            <input
              type="radio"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            />
            Cash on Delivery
          </label>

          <label className="flex gap-2 text-sm">
            <input
              type="radio"
              checked={paymentMethod === "UPI"}
              onChange={() => setPaymentMethod("UPI")}
            />
            UPI / Wallet
          </label>

          <label className="flex gap-2 text-sm">
            <input
              type="radio"
              checked={paymentMethod === "CARD"}
              onChange={() => setPaymentMethod("CARD")}
            />
            Credit / Debit Card
          </label>
        </div>

        <button
          onClick={handleProceed}
          disabled={selectedIndex === undefined}
          className={`w-full py-3 rounded text-white ${
            selectedIndex === undefined
              ? "bg-gray-400"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default DeliveryAddress;
