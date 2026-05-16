import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    firstName: { type: String, required: [true, "First name is required"] },
    lastName: { type: String },
    email: { 
        type: String, 
        required: [true, "Email is required"], 
        unique: true,
        lowercase: true, // Prevents "User@Email.com" vs "user@email.com" issues
        trim: true 
    },
    password: { type: String, required: [true, "Password is required"] },
    role: {
      type: String,
      enum: ["TRADER", "ADMIN"],
      default: "TRADER", // Added default to ensure every user has a role
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