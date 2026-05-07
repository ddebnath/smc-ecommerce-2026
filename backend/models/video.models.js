import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    videos: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
        },
        thumbnail: {
          type: String, // auto-generated or from Cloudinary
        },
        duration: {
          type: Number, // in seconds
        },
        format: {
          type: String, // mp4, webm, etc.
        },
        size: {
          type: Number, // in bytes
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);
