import exp from "express";
import { AssetModel } from "../models/AssetModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";

export const marketRoute = exp.Router();

// Get all active assets (Public or protected depending on your platform rules)
marketRoute.get("/assets", async (req, res, next) => {
  try {
    const assets = await AssetModel.find({ isActive: true });
    res.status(200).json({ message: "Live Market Data", payload: assets });
  } catch (err) {
    next(err);
  }
});

// Get detailed view of a single asset by ID (e.g., for showing a chart)
marketRoute.get("/asset/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const asset = await AssetModel.findById(id);

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    res.status(200).json({ message: "Asset details", payload: asset });
  } catch (err) {
    next(err);
  }
});

// Get Top Gainers (Example of a custom market query)
marketRoute.get("/top-gainers", async (req, res, next) => {
  try {
    // In a real app, you'd calculate % change. Here we just sort by price or marketCap.
    const topAssets = await AssetModel.find({ isActive: true })
      .sort({ currentPrice: -1 })
      .limit(5);
      
    res.status(200).json({ message: "Top assets by price", payload: topAssets });
  } catch (err) {
    next(err);
  }
});