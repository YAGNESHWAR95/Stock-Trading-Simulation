import exp from "express";
import { AssetModel } from "../models/AssetModel.js";
import { UserModel } from "../models/UserModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { getMarketNewsFeed } from "../services/newsService.js";

export const marketRoute = exp.Router();

/**
 * @route   GET /api/market/assets
 * @desc    Get all active assets for the main live market grid storefront
 * @access  Public
 */
marketRoute.get("/assets", async (req, res, next) => {
  try {
    const assets = await AssetModel.find({ isActive: true });
    res.status(200).json({ message: "Live Market Data", payload: assets });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   GET /api/market/asset/:id
 * @desc    Get detailed workspace info for a single token item
 * @access  Public
 */
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

/**
 * @route   GET /api/market/top-gainers
 * @desc    Get top assets sorted by current market value (Highest price ceiling)
 * @access  Public
 */
marketRoute.get("/top-gainers", async (req, res, next) => {
  try {
    const topAssets = await AssetModel.find({ isActive: true })
      .sort({ currentPrice: -1 })
      .limit(5);
      
    res.status(200).json({ message: "Top assets by price", payload: topAssets });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/market/trade
 * @desc    Execute an atomic Buy or Sell transaction for an authenticated user
 * @access  Protected (Requires explicit TRADER or ADMIN session verification tokens)
 */
marketRoute.post("/trade", verifyToken("TRADER", "ADMIN"), async (req, res, next) => {
  try {
    const { assetId, action, quantity } = req.body;
    
    // Safety Check: Verify that verifyToken middleware successfully parsed the payload
    if (!req.user) {
      return res.status(401).json({ message: "Access denied. User session context missing." });
    }
    
    // Fallback: Supports both payload extraction shapes safely (_id or id)
    const userId = req.user._id || req.user.id; 

    // 1. Validate inbound quantitative thresholds
    const targetOrderQty = Number(quantity);
    if (!assetId || !action || targetOrderQty <= 0 || isNaN(targetOrderQty)) {
      return res.status(400).json({ message: "Invalid order parameters." });
    }

    // 2. Extract deep model snapshots from MongoDB Atlas
    const asset = await AssetModel.findById(assetId);
    const user = await UserModel.findById(userId);

    if (!asset) return res.status(404).json({ message: "Asset records not found." });
    if (!user) return res.status(404).json({ message: "User profile context not found." });

    // Defensive Check: Ensure the user portfolio property is explicitly initialized as an array
    if (!user.portfolio) {
      user.portfolio = [];
    }

    const transactionValue = asset.currentPrice * targetOrderQty;

    // 3. Process Buy Order Logic
    if (action.toUpperCase() === "BUY") {
      if (user.walletBalance < transactionValue) {
        return res.status(400).json({ message: "Insufficient wallet funds to complete trade." });
      }

      // Decrement fiat cash holdings balance cleanly
      user.walletBalance -= transactionValue;

      // Update or create asset block node within user portfolio array map
      const portfolioItem = user.portfolio.find(item => item.asset && item.asset.toString() === assetId);
      if (portfolioItem) {
        portfolioItem.shares += targetOrderQty;
      } else {
        user.portfolio.push({ asset: assetId, shares: targetOrderQty });
      }
    } 
    
    // 4. Process Sell Order Logic
    else if (action.toUpperCase() === "SELL") {
      const portfolioItem = user.portfolio.find(item => item.asset && item.asset.toString() === assetId);
      
      if (!portfolioItem || portfolioItem.shares < targetOrderQty) {
        return res.status(400).json({ message: "Insufficient asset equity to execute sell order." });
      }

      // Add liquidation returns back to main cash balance context
      user.walletBalance += transactionValue;
      portfolioItem.shares -= targetOrderQty;

      // Drop asset ledger node from array map if zero remaining shares persist
      if (portfolioItem.shares === 0) {
        user.portfolio = user.portfolio.filter(item => item.asset && item.asset.toString() !== assetId);
      }
    } else {
      return res.status(400).json({ message: "Unsupported execution order type." });
    }

    // 5. Instruct Mongoose to trace array mutations explicitly before committing
    user.markModified("portfolio");
    await user.save();

    // 6. Return altered user state metrics back to client app layout context
    return res.status(200).json({
      message: `${action.toUpperCase()} order executed successfully!`,
      payload: {
        walletBalance: user.walletBalance,
        portfolio: user.portfolio
      }
    });

  } catch (err) {
    // Print explicit debug parameters straight into your server logs if a crash occurs
    console.error("====== CRITICAL TRANSACTION SYSTEM FAULT ======");
    console.error(err);
    console.error("===============================================");
    next(err);
  }
});
/**
 * @route   GET /api/market/news
 * @desc    Get the latest market sentiment news feed and aggregate score
 * @access  Public
 */
marketRoute.get("/news", async (req, res, next) => {
  try {
    const payload = await getMarketNewsFeed();
    res.status(200).json({ message: "Market news feed", payload });
  } catch (err) {
    next(err);
  }
});
// Default export ties into your backend server.js mount smoothly
export default marketRoute;