import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    profilePic: { type: String, default: "" }, // cloudinary image url
    profilePicPublicId: { type: String, default: "" }, //cloudinary public_id for deletion
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin", "productOwner"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    token: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    isLoggedIn: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    address: { type: String },
    city: { type: String },
    country: { type: String, default: "India" }, // country field
    state: { type: String }, // state field
    zipcode: { type: String },
    phoneNo: { type: String },
  },
  { timestamps: true },
);

// middleware to encrypt password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// method - to compare hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// export user model
export const User = mongoose.model("User", userSchema);
