import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import store from "@/redux/store";
import {
  addAddresses,
  setSelectedAddress,
  setDeleteAddress,
} from "@/redux/slices/productSlice";

const AddressForm = () => {
  const dispatch = useDispatch();

  const { cart, addresses, selectedAddress } = useSelector(
    (store) => store.product,
  );

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

  const [showForm, setShowForm] = useState(addresses?.length === 0);

  // auto show form if empty
  useEffect(() => {
    if (addresses.length === 0) {
      setShowForm(true);
    }
  }, [addresses]);

  useEffect(() => {
    if (addresses.length > 0 && selectedAddress === null) {
      dispatch(setSelectedAddress(0)); // ✅ select first address
    }
  }, [addresses, selectedAddress]);
  // handle input
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // add address
  const handleSubmit = (e) => {
    e.preventDefault();

    const newAddress = {
      ...formData,
      _id: Date.now().toString(),
    };

    dispatch(addAddresses(newAddress));
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
  };

  // delete
  const handleDelete = (index) => {
    if (window.confirm("Delete this address?")) {
      dispatch(setDeleteAddress(index));
    }
  };

  const selectedAddr =
    selectedAddress !== undefined ? addresses[selectedAddress] : null;

  const totalAmount = cart?.totalPrice || 0;
  const discount = totalAmount > 2000 ? 10 : 0;

  return (
    <div className="flex gap-3 mt-20 h-screen px-6">
      <div className="max-w-4xl mx-50">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Delivery Address
        </h2>

        {/* ================= ADDRESS LIST ================= */}
        {addresses.length > 0 && !showForm && (
          <div className="space-y-4 ml mb-6">
            <h3 className="text-lg font-semibold">Saved Addresses</h3>

            {addresses.map((addr, index) => {
              const isSelected = selectedAddress === index;

              return (
                <div
                  key={index}
                  className={`border p-4 rounded-lg relative transition ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* 🔘 Radio button (ONLY selection trigger) */}
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddress === index}
                      onChange={() => dispatch(setSelectedAddress(index))}
                      className="mt-1 cursor-pointer accent-blue-500"
                    />

                    {/* Address Info */}
                    <div className="w-full">
                      <p className=" font-semibold">{addr.fullName}</p>
                      <p>{addr.address}</p>
                      <p>
                        {addr.city}, {addr.state} - {addr.zipcode}
                      </p>
                      <p>{addr.phone}</p>
                    </div>
                  </div>

                  {/* Delete */}
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

        {/* ================= FORM ================= */}
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
              className="p-3 border rounded-lg"
              required
            />

            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="p-3 border rounded-lg"
              required
            />

            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="p-3 border rounded-lg"
            />

            <input
              name="zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              placeholder="Zip Code"
              className="p-3 border rounded-lg"
              required
            />

            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              className="p-3 border rounded-lg"
              required
            />

            <input
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
              className="p-3 border rounded-lg"
              required
            />

            <input
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
              className="p-3 border rounded-lg"
              required
            />

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Full Address"
              className="p-3 border rounded-lg md:col-span-2"
              required
            />

            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white py-3 rounded-lg"
              >
                Save Address & Continue
              </button>

              {addresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 py-3 rounded-lg"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      {/* proceed to checkout */}
      <div className="mt-10 h-[60%] bg-white p-6 rounded-xl shadow border">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        {/* Selected Address */}
        {selectedAddr ? (
          <div className="mb-4 p-4 border rounded-lg bg-gray-50">
            <p className="font-semibold">{selectedAddr.fullName}</p>
            <p>{selectedAddr.address}</p>
            <p>
              {selectedAddr.city}, {selectedAddr.state} - {selectedAddr.zipcode}
            </p>
            <p>{selectedAddr.phone}</p>
          </div>
        ) : (
          <p className="text-red-500 mb-4">
            Please select an address to continue
          </p>
        )}

        {/* Total */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium">Total Number of Items</span>
          <span className="text-lg font-bold">₹ {cart.items.length}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium">Total Price</span>
          <span className="text-lg font-bold">₹ {totalAmount}</span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium">Apply Discount (if any)</span>
          <span className="text-lg font-bold"> {discount}%</span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium">Discount Amount</span>
          <span className="text-lg font-bold">
            ₹ {(totalAmount * discount) / 100}
          </span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium">Total Amount Payable</span>
          <span className="text-lg font-bold">
            ₹ {totalAmount - (totalAmount * discount) / 100}
          </span>
        </div>

        {/* Button */}
        <button
          disabled={!selectedAddr}
          className={`w-full py-3 mt-10 rounded-lg text-white font-semibold ${
            selectedAddr
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default AddressForm;
