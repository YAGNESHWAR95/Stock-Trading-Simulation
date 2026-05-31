import exp from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { UserModel } from "../models/UserModel.js";
import { AssetModel } from "../models/AssetModel.js";
import { PortfolioModel } from "../models/PortfolioModel.js";
import { OrderModel } from "../models/OrderModel.js";
import { AlertModel } from "../models/AlertModel.js";
import { ConditionalOrderModel } from "../models/ConditionalOrderModel.js";

export const traderRoute = exp.Router();

// 1. Get Market Data (All Assets)
traderRoute.get("/market", verifyToken("TRADER", "ADMIN"), async (req, res) => {
  try {
    const assets = await AssetModel.find({ isActive: true });
    res.status(200).json({ message: "Market data", payload: assets });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch market data", error: err.message });
  }
});

// 2. Get User's Portfolio
traderRoute.get("/portfolio", verifyToken("TRADER"), async (req, res) => {
  try {
    const portfolio = await PortfolioModel.find({ user: req.user._id }).populate("asset");
    res.status(200).json({ message: "Your portfolio", payload: portfolio });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch portfolio", error: err.message });
  }
});

// 3. Execute a BUY Trade (Records to Order History for Dashboard/Analysis)
traderRoute.post("/buy", verifyToken("TRADER"), async (req, res) => {
  const { assetId, quantity } = req.body;
  const userId = req.user._id;

  try {
    const asset = await AssetModel.findById(assetId);
    if (!asset) return res.status(404).json({ message: "Asset not found" });

    const totalCost = asset.currentPrice * quantity;

    // Deduct from User Wallet
    const user = await UserModel.findById(userId);
    if (user.walletBalance < totalCost) {
      return res.status(400).json({ message: "Trade failed: Insufficient wallet balance" });
    }
    
    user.walletBalance -= totalCost;
    await user.save();

    // Add to Portfolio
    let portfolioItem = await PortfolioModel.findOne({ user: userId, asset: assetId });
    
    if (portfolioItem) {
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

    // Log transaction to Order Model for historical analysis tracking
    await OrderModel.create({
      user: userId,
      asset: assetId,
      orderType: "BUY",
      quantity,
      priceAtExecution: asset.currentPrice,
      totalAmount: totalCost,
      status: "COMPLETED"
    });

    res.status(200).json({ message: "Trade executed successfully", walletBalance: user.walletBalance });
  } catch (err) {
    console.error("Buy Error:", err);
    res.status(400).json({ message: "Trade failed", error: err.message });
  }
});

// 4. Execute a SELL Trade (Records to Order History for Dashboard/Analysis)
traderRoute.post("/sell", verifyToken("TRADER"), async (req, res) => {
  const { assetId, quantity } = req.body;
  const userId = req.user._id;

  try {
    const asset = await AssetModel.findById(assetId);
    if (!asset) return res.status(404).json({ message: "Asset not found" });

    // Check Portfolio
    let portfolioItem = await PortfolioModel.findOne({ user: userId, asset: assetId });
    if (!portfolioItem || portfolioItem.quantity < quantity) {
      return res.status(400).json({ message: "Trade failed: Insufficient asset quantity in portfolio" });
    }

    const totalRevenue = asset.currentPrice * quantity;

    // Add to User Wallet
    const user = await UserModel.findById(userId);
    user.walletBalance += totalRevenue;
    await user.save();

    // Deduct from Portfolio
    portfolioItem.quantity -= quantity;
    if (portfolioItem.quantity <= 0) {
      await PortfolioModel.deleteOne({ _id: portfolioItem._id });
    } else {
      await portfolioItem.save();
    }

    // Log transaction to Order Model for historical analysis tracking
    await OrderModel.create({
      user: userId,
      asset: assetId,
      orderType: "SELL",
      quantity,
      priceAtExecution: asset.currentPrice,
      totalAmount: totalRevenue,
      status: "COMPLETED"
    });

    res.status(200).json({ message: "Sell executed successfully", walletBalance: user.walletBalance });
  } catch (err) {
    console.error("Sell Error:", err);
    res.status(400).json({ message: "Trade failed", error: err.message });
  }
});

// 5. Deposit Demo Cash
traderRoute.post("/deposit", verifyToken("TRADER"), async (req, res) => {
  try {
    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      { $inc: { walletBalance: 5000 } },
      { new: true }
    );
    res.status(200).json({ message: "$5,000 added to wallet!", walletBalance: user.walletBalance });
  } catch (err) {
    res.status(500).json({ message: "Deposit failed" });
  }
});

// 6. Portfolio Dashboard Summary & Real-time Profit/Loss Tracker
traderRoute.get("/dashboard-summary", verifyToken("TRADER"), async (req, res) => {
  try {
    const portfolioItems = await PortfolioModel.find({ user: req.user._id }).populate("asset");
    const user = await UserModel.findById(req.user._id);

    let totalInvestedValue = 0;
    let totalCurrentValue = 0;

    const breakdown = portfolioItems.map(item => {
      const invested = item.quantity * item.averageBuyPrice;
      const current = item.quantity * item.asset.currentPrice;
      const pnl = current - invested;
      const pnlPercentage = invested > 0 ? (pnl / invested) * 100 : 0;

      totalInvestedValue += invested;
      totalCurrentValue += current;

      return {
        assetId: item.asset._id,
        assetName: item.asset.name,
        symbol: item.asset.symbol,
        quantity: item.quantity,
        avgBuyPrice: item.averageBuyPrice,
        currentPrice: item.asset.currentPrice,
        investedValue: parseFloat(invested.toFixed(2)),
        currentValue: parseFloat(current.toFixed(2)),
        pnl: parseFloat(pnl.toFixed(2)),
        pnlPercentage: parseFloat(pnlPercentage.toFixed(2))
      };
    });

    const totalPnL = totalCurrentValue - totalInvestedValue;
    const totalPnLPercentage = totalInvestedValue > 0 ? (totalPnL / totalInvestedValue) * 100 : 0;

    const sortedByPnl = breakdown.slice().sort((a, b) => b.pnlPercentage - a.pnlPercentage);
    const allocation = breakdown.map((item) => ({
      assetId: item.assetId,
      symbol: item.symbol,
      allocationPercentage: totalCurrentValue > 0 ? parseFloat(((item.currentValue / totalCurrentValue) * 100).toFixed(1)) : 0,
    }));

    res.status(200).json({
      message: "Dashboard summary details compiled",
      payload: {
        walletBalance: user.walletBalance,
        totalInvestedValue: parseFloat(totalInvestedValue.toFixed(2)),
        totalCurrentValue: parseFloat(totalCurrentValue.toFixed(2)),
        totalPnL: parseFloat(totalPnL.toFixed(2)),
        totalPnLPercentage: parseFloat(totalPnLPercentage.toFixed(2)),
        totalPositions: breakdown.length,
        topPerformers: sortedByPnl.slice(0, 3),
        topLosers: sortedByPnl.slice(-3).reverse(),
        allocation,
        portfolioBreakdown: breakdown
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Dashboard calculations failed", error: err.message });
  }
});

// 7. Historical Analysis (Chronological Logs)
traderRoute.get("/history", verifyToken("TRADER"), async (req, res) => {
  try {
    const historicalOrders = await OrderModel.find({ user: req.user._id })
      .populate("asset")
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Historical trade metrics", payload: historicalOrders });
  } catch (err) {
    res.status(500).json({ message: "Failed to extract database logs", error: err.message });
  }
});

// 8. Trading Leaderboard (Ranked by Total Equity: Wallet + Portfolio Value)
traderRoute.get("/leaderboard", verifyToken("TRADER", "ADMIN"), async (req, res) => {
  try {
    // Modified from username to pull firstName and lastName based on your strict schema
    const users = await UserModel.find({ role: "TRADER" }).select("firstName lastName walletBalance");
    const portfolios = await PortfolioModel.find().populate("asset");

    const leaderboard = users.map(user => {
      const explicitPortfolio = portfolios.filter(p => p.user.toString() === user._id.toString());
      const holdingValue = explicitPortfolio.reduce((sum, item) => sum + (item.quantity * item.asset.currentPrice), 0);
      
      // Concatenate the name fields cleanly to map seamlessly onto frontend display components
      const computedDisplayIdentity = `${user.firstName} ${user.lastName || ""}`.trim();

      return {
        username: computedDisplayIdentity,
        walletBalance: user.walletBalance,
        portfolioValue: parseFloat(holdingValue.toFixed(2)),
        totalNetWorth: parseFloat((user.walletBalance + holdingValue).toFixed(2))
      };
    });

    // Sort descending by highest Net Worth
    leaderboard.sort((a, b) => b.totalNetWorth - a.totalNetWorth);

    res.status(200).json({ message: "Top Active Traders Leaderboard", payload: leaderboard.slice(0, 15) });
  } catch (err) {
    res.status(500).json({ message: "Leaderboard assembly failed", error: err.message });
  }
});

// 9. Create a Custom Price Alert Rule Condition
traderRoute.post("/alerts", verifyToken("TRADER"), async (req, res) => {
  const { assetId, targetPrice, condition } = req.body; // condition: "ABOVE" or "BELOW"
  try {
    const alertRule = await AlertModel.create({
      user: req.user._id,
      asset: assetId,
      targetPrice,
      condition
    });
    res.status(201).json({ message: "Price change trigger rules saved", payload: alertRule });
  } catch (err) {
    res.status(400).json({ message: "Trigger creation failed", error: err.message });
  }
});

// 10. Fetch User's Active (Untriggered) Price Alerts
traderRoute.get("/alerts", verifyToken("TRADER"), async (req, res) => {
  try {
    const activeAlerts = await AlertModel.find({ user: req.user._id, isTriggered: false }).populate("asset");
    res.status(200).json({ message: "Active Price Watch Triggers", payload: activeAlerts });
  } catch (err) {
    res.status(500).json({ message: "Failed to locate active rule conditions", error: err.message });
  }
});

// Watchlist endpoints
traderRoute.get("/watchlist", verifyToken("TRADER"), async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).populate({ path: "watchlist", match: { isActive: true } });
    res.status(200).json({ message: "Watchlist loaded", payload: user.watchlist || [] });
  } catch (err) {
    res.status(500).json({ message: "Unable to fetch watchlist", error: err.message });
  }
});

traderRoute.post("/watchlist", verifyToken("TRADER"), async (req, res) => {
  const { assetId } = req.body;
  try {
    const asset = await AssetModel.findById(assetId);
    if (!asset) return res.status(404).json({ message: "Asset not found" });

    const user = await UserModel.findById(req.user._id);
    if (!user.watchlist.some((item) => item.toString() === assetId)) {
      user.watchlist.push(assetId);
      await user.save();
    }

    res.status(200).json({ message: `${asset.symbol} added to watchlist.`, payload: user.watchlist });
  } catch (err) {
    res.status(500).json({ message: "Failed to update watchlist", error: err.message });
  }
});

traderRoute.delete("/watchlist/:assetId", verifyToken("TRADER"), async (req, res) => {
  try {
    const { assetId } = req.params;
    const user = await UserModel.findById(req.user._id);

    user.watchlist = user.watchlist.filter((item) => item.toString() !== assetId);
    await user.save();

    res.status(200).json({ message: "Watchlist item removed", payload: user.watchlist });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove watchlist item", error: err.message });
  }
});

// AI doubt assistant endpoint
traderRoute.post("/ask-ai", verifyToken("TRADER", "ADMIN"), async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return res.status(400).json({ message: "Please ask a valid trading question." });
    }

    const apiName = process.env.AI_API_NAME || "Stock-Trading-Platform";
    const apiKey = process.env.AI_API_SECRET_KEY;

    if (!apiKey) {
      return res.status(500).json({ message: "AI service is not configured. Please contact admin." });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a helpful and highly knowledgeable virtual trading AI assistant. Provide concise, clear, and accurate answers to user questions about trading, stocks, crypto, markets, and investment strategies."
          },
          {
            role: "user",
            content: question
          }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Groq API error:", errorData);
      throw new Error(errorData.error?.message || `Groq API responded with status ${response.status}`);
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "No response received from AI.";

    return res.status(200).json({ message: "AI response ready", payload: { apiName, answer } });
  } catch (err) {
    console.error("AI doubt endpoint error:", err);
    res.status(500).json({ message: "Failed to generate an AI response.", error: err.message });
  }
});

// Conditional stop-loss / take-profit order endpoints
traderRoute.post("/conditional-orders", verifyToken("TRADER"), async (req, res) => {
  const { assetId, triggerPrice, quantity, triggerType } = req.body;

  if (!assetId || !triggerPrice || !quantity || !triggerType) {
    return res.status(400).json({ message: "Please provide assetId, quantity, triggerPrice, and triggerType." });
  }

  try {
    const asset = await AssetModel.findById(assetId);
    if (!asset) return res.status(404).json({ message: "Asset not found" });

    const portfolio = await PortfolioModel.findOne({ user: req.user._id, asset: assetId });
    if (!portfolio || portfolio.quantity < quantity) {
      return res.status(400).json({ message: "You do not hold enough of this asset to create a conditional sell order." });
    }

    const order = await ConditionalOrderModel.create({
      user: req.user._id,
      asset: assetId,
      quantity,
      triggerPrice,
      triggerType,
      status: "PENDING"
    });

    res.status(201).json({ message: "Conditional order created", payload: order });
  } catch (err) {
    res.status(500).json({ message: "Failed to save conditional order", error: err.message });
  }
});

traderRoute.get("/conditional-orders", verifyToken("TRADER"), async (req, res) => {
  try {
    const orders = await ConditionalOrderModel.find({ user: req.user._id, status: "PENDING" }).populate("asset");
    res.status(200).json({ message: "Active conditional orders", payload: orders });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch conditional orders", error: err.message });
  }
});

traderRoute.delete("/conditional-orders/:id", verifyToken("TRADER"), async (req, res) => {
  try {
    const order = await ConditionalOrderModel.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id, status: "PENDING" },
      { status: "CANCELLED", executed: true },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Condition not found or already executed." });
    res.status(200).json({ message: "Conditional order cancelled", payload: order });
  } catch (err) {
    res.status(500).json({ message: "Unable to cancel conditional order", error: err.message });
  }
});