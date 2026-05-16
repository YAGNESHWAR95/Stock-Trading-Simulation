import exp from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { UserModel } from "../models/UserModel.js";
import { AssetModel } from "../models/AssetModel.js";
import { PortfolioModel } from "../models/PortfolioModel.js";

export const traderRoute = exp.Router();

// Get Market Data (All Assets)
traderRoute.get("/market", verifyToken("TRADER", "ADMIN"), async (req, res) => {
  const assets = await AssetModel.find({ isActive: true });
  res.status(200).json({ message: "Market data", payload: assets });
});

// Get User's Portfolio
traderRoute.get("/portfolio", verifyToken("TRADER"), async (req, res) => {
  const portfolio = await PortfolioModel.find({ user: req.user._id }).populate("asset");
  res.status(200).json({ message: "Your portfolio", payload: portfolio });
});

// Execute a BUY Trade (No Transactions - Safe for Local MongoDB)
traderRoute.post("/buy", verifyToken("TRADER"), async (req, res) => {
  const { assetId, quantity } = req.body;
  const userId = req.user._id;

  try {
    const asset = await AssetModel.findById(assetId);
    if (!asset) return res.status(404).json({ message: "Asset not found" });

    const totalCost = asset.currentPrice * quantity;

    // 1. Deduct from User Wallet
    const user = await UserModel.findById(userId);
    if (user.walletBalance < totalCost) {
        return res.status(400).json({ message: "Trade failed: Insufficient wallet balance" });
    }
    
    user.walletBalance -= totalCost;
    await user.save();

    // 2. Add to Portfolio
    let portfolioItem = await PortfolioModel.findOne({ user: userId, asset: assetId });
    
    if (portfolioItem) {
      // Calculate new average buy price
      const totalValueOld = portfolioItem.quantity * portfolioItem.averageBuyPrice;
      portfolioItem.quantity += quantity;
      portfolioItem.averageBuyPrice = (totalValueOld + totalCost) / portfolioItem.quantity;
      await portfolioItem.save();
    } else {
      await PortfolioModel.create({ 
          user: userId, 
          asset: assetId, 
          quantity, 
          averageBuyPrice: asset.currentPrice 
      });
    }

    res.status(200).json({ message: "Trade executed successfully", walletBalance: user.walletBalance });
  } catch (err) {
    console.error("Buy Error:", err);
    res.status(400).json({ message: "Trade failed", error: err.message });
  }
});

// Execute a SELL Trade (No Transactions - Safe for Local MongoDB)
traderRoute.post("/sell", verifyToken("TRADER"), async (req, res) => {
  const { assetId, quantity } = req.body;
  const userId = req.user._id;

  try {
    const asset = await AssetModel.findById(assetId);
    if (!asset) return res.status(404).json({ message: "Asset not found" });

    // 1. Check Portfolio
    let portfolioItem = await PortfolioModel.findOne({ user: userId, asset: assetId });
    if (!portfolioItem || portfolioItem.quantity < quantity) {
      return res.status(400).json({ message: "Trade failed: Insufficient asset quantity in portfolio" });
    }

    const totalRevenue = asset.currentPrice * quantity;

    // 2. Add to User Wallet
    const user = await UserModel.findById(userId);
    user.walletBalance += totalRevenue;
    await user.save();

    // 3. Deduct from Portfolio
    portfolioItem.quantity -= quantity;
    if (portfolioItem.quantity <= 0) {
      // If they sold everything, remove the portfolio document
      await PortfolioModel.deleteOne({ _id: portfolioItem._id });
    } else {
      await portfolioItem.save();
    }

    res.status(200).json({ message: "Sell executed successfully", walletBalance: user.walletBalance });
  } catch (err) {
    console.error("Sell Error:", err);
    res.status(400).json({ message: "Trade failed", error: err.message });
  }
});

// Deposit Demo Cash
traderRoute.post("/deposit", verifyToken("TRADER"), async (req, res) => {
  try {
    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      { $inc: { walletBalance: 5000 } }, // Adds $5000 demo cash per click
      { new: true }
    );
    res.status(200).json({ message: "$5,000 added to wallet!", walletBalance: user.walletBalance });
  } catch (err) {
    res.status(500).json({ message: "Deposit failed" });
  }
});