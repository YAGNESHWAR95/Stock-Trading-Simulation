import mongoose from "mongoose"; // 👈 FIX 1: Add this missing import!

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { 
    type: String, 
    required: true,
    minlength: [8, "Password must be at least 8 characters long!"]
  },
  firstName: { type: String, required: true },
  lastName: { type: String, default: "" },
  username: { type: String, required: true }, // Keeping it if used elsewhere
  role: { type: String, enum: ["TRADER", "ADMIN"], default: "TRADER" },
  walletBalance: { type: Number, default: 100000.00 },
  watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "asset" }],
  isActive: { type: Boolean, default: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
}, { timestamps: true });

// 👈 FIX 2: Ensure this matches the exact named export your service is importing
export const UserModel = mongoose.model("user", userSchema);