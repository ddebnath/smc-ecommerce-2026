import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    description: { type: String, default: "" },

    date: { type: String, default: "" },
    location: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "India" },
    pinCode: { type: String, default: "" },

    geoLocation: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },

    coverImage: {
      url: String,
      public_id: String,
    },

    // video field
    videos: [
      {
        url: String,
        public_id: String,
        duration: Number,
        format: String,
        size: Number,
        thumbnail: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Event = mongoose.model("Event", eventSchema);
