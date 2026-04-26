import mongoose from "mongoose";

const deleveryAddressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    addressList: [
      {
        fullName: String,
        phone: String,
        email: String,
        address: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
      },
    ],

    selectedAddress: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const DeleveryAddress = mongoose.model(
  "DeleveryAddress",
  deleveryAddressSchema,
);
