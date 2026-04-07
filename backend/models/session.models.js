import mongoose, { Schema } from "mongoose";

const sessionSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

// export session model
export const Session = mongoose.model("Session", sessionSchema);
