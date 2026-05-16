import exp from "express";
import { UserModel } from "../models/UserModel.js";
import { register, authenticate } from "../services/authService.js";
import { verifyToken } from "../middlewares/verifyToken.js";

export const authRoute = exp.Router();

// Register a new Trader
authRoute.post("/register", async (req, res, next) => {
  try {
    const userObj = req.body;
    
    // Using the authService logic from your previous architecture
    const newUserObj = await register({
      ...userObj,
      role: "TRADER", // Defaulting new sign-ups to Traders
      walletBalance: 10000, // Give users $10k practice money to start
    });

    res.status(201).json({ message: "Trader account created successfully", payload: newUserObj });
  } catch (err) {
    next(err);
  }
});

// Login User/Admin
authRoute.post("/login", async (req, res, next) => {
  try {
    const userCreds = req.body;
    // authenticate should verify bcrypt password and generate a JWT token
    const { user, token } = await authenticate(userCreds);

    // Set JWT in HTTP-Only cookie for security (standard in MERN)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    res.status(200).json({ message: "Login successful", payload: user });
  } catch (err) {
    next(err);
  }
});

// Check Auth Status (Used by Zustand on frontend refresh)
authRoute.get("/check-auth", verifyToken("TRADER", "ADMIN"), async (req, res) => {
  // If token is valid, req.user is populated by verifyToken middleware
  res.status(200).json({ message: "Authenticated", payload: req.user });
});

// Logout
authRoute.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});