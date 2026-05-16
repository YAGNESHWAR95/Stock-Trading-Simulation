import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    firstName: { type: String, required: [true, "First name is required"] },
    lastName: { type: String },
    email: { type: String, required: [true, "Email is required"], unique: true },
    password: { type: String, required: [true, "Password is required"] },
    role: {
      type: String,
      enum: ["TRADER", "ADMIN"],
      required: [true, "{Value} is an invalid role"],
    },
    walletBalance: {
      type: Number,
      default: 10000, // Giving new users $10,000 demo cash
      min: [0, "Insufficient funds"],
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, strict: "throw", versionKey: false }
);

export const UserModel = model("user", userSchema);