import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    firstName: { type: String, required: [true, "First name is required"] },
    lastName: { type: String },
    username: { 
      type: String, 
      required: [true, "Username is required"], 
      unique: true,
      trim: true 
    },
    email: { 
        type: String, 
        required: [true, "Email is required"], 
        unique: true,
        lowercase: true,
        trim: true 
    },
    password: { type: String, required: [true, "Password is required"] },
    role: {
      type: String,
      enum: ["TRADER", "ADMIN"],
      default: "TRADER",
      required: [true, "Role is required"],
    },
    walletBalance: {
      type: Number,
      default: 10000,
      min: [0, "Insufficient funds"],
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, strict: "throw", versionKey: false }
);

export const UserModel = model("user", userSchema);