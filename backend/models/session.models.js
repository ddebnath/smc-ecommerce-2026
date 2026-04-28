import mongoose, { Schema } from "mongoose";

const sessionSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

sessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

// export session model
export const Session = mongoose.model("Session", sessionSchema);
