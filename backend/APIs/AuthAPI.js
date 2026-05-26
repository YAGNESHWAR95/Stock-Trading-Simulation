import exp from "express";
import { register, authenticate, forgotPassword, resetPassword, getGoogleAuthUrl, googleLoginOrRegister } from "../services/authService.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { UserModel } from "../models/UserModel.js";

export const authRoute = exp.Router();

authRoute.post("/register", async (req, res, next) => {
  try {
    const newUser = await register({ ...req.body, role: "TRADER" });
    res.status(201).json({ message: "Success", payload: newUser });
  } catch (err) { next(err); }
});

authRoute.post("/login", async (req, res, next) => {
  try {
    const { user, token } = await authenticate(req.body);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,      // Required for cross-domain
      sameSite: "none",  // Required for Vercel -> Render
      maxAge: 24 * 60 * 60 * 1000
    });
    res.status(200).json({ message: "Login successful", payload: user });
  } catch (err) { next(err); }
});

authRoute.get("/google", (req, res) => {
  try {
    const authUrl = getGoogleAuthUrl();
    res.redirect(authUrl);
  } catch (err) {
    res.status(500).json({ message: "Unable to start Google sign-in." });
  }
});

authRoute.get("/google/callback", async (req, res, next) => {
  try {
    const { token } = await googleLoginOrRegister(req.query.code);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/market`);
  } catch (err) {
    next(err);
  }
});

authRoute.post("/forgot-password", async (req, res, next) => {
  try {
    const token = await forgotPassword(req.body.email);
    res.status(200).json({
      message: "Password reset token generated.",
      payload: { token },
    });
  } catch (err) { next(err); }
});

authRoute.post("/reset-password", async (req, res, next) => {
  try {
    await resetPassword(req.body);
    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (err) { next(err); }
});

authRoute.get("/check-auth", verifyToken("TRADER", "ADMIN"), async (req, res) => {
  const user = await UserModel.findById(req.user._id).select("-password");
  res.status(200).json({ message: "Authenticated", payload: user });
});

authRoute.post("/logout", (req, res) => {
  res.clearCookie("token", { 
    httpOnly: true, 
    secure: true, 
    sameSite: "none",
    path: "/" // 👈 Explicit path boundary ensures browser flushes the cookie cleanly
  });
  res.status(200).json({ message: "Logged out" });
});