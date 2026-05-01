import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    coverImage: {
      url: String,
      public_id: String,
    },

    date: {
      type: Date,
      required: true,
    },

    location: {
      address: {
        type: String,
        default: "",
      },

      city: {
        type: String,
        default: "",
      },

      state: {
        type: String,
        default: "",
      },

      country: {
        type: String,
        default: "India",
      },

      pinCode: {
        type: String,
        default: "",
      },

      geoLocation: {
        lat: { type: Number, default: 0 },
        lng: { type: Number, default: 0 },
      },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const Event = mongoose.model("Event", eventSchema);
