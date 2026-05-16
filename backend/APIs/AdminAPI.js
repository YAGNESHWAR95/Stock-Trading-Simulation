import exp from "express";
import { AssetModel } from "../models/AssetModel.js";
import { UserModel } from "../models/UserModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";

export const adminRoute = exp.Router();

// List a new tradable asset on the platform
adminRoute.post("/asset", verifyToken("ADMIN"), async (req, res, next) => {
  try {
    const { symbol, name, currentPrice, marketCap } = req.body;
    
    const newAsset = await AssetModel.create({
      symbol: symbol.toUpperCase(),
      name,
      currentPrice,
      marketCap,
      isActive: true
    });

    res.status(201).json({ message: "Asset listed successfully", payload: newAsset });
  } catch (err) {
    next(err);
  }
});

// Update an asset's price manually (In a real app, this would be updated via a Webhook/Cron job from a live API like Binance/Alpaca)
adminRoute.put("/asset/:id", verifyToken("ADMIN"), async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body; // e.g., { currentPrice: 45000, isActive: false }

    const updatedAsset = await AssetModel.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedAsset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    res.status(200).json({ message: "Asset updated", payload: updatedAsset });
  } catch (err) {
    next(err);
  }
});

// Halt trading on a specific asset
adminRoute.put("/asset/halt/:id", verifyToken("ADMIN"), async (req, res, next) => {
  try {
    const { id } = req.params;
    const asset = await AssetModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
    res.status(200).json({ message: "Trading halted for asset", payload: asset });
  } catch (err) {
    next(err);
  }
});

// View all users on the platform
adminRoute.get("/users", verifyToken("ADMIN"), async (req, res, next) => {
  try {
    // Don't return passwords
    const users = await UserModel.find({ role: "TRADER" }).select("-password");
    res.status(200).json({ message: "All traders", payload: users });
  } catch (err) {
    next(err);
  }
});