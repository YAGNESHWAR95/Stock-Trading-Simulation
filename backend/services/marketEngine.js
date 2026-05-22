import { AssetModel } from "../models/AssetModel.js";
import { AlertModel } from "../models/AlertModel.js";

export function initializeMarketSimulation(io) {
  // Execute tickers every 5 seconds
  setInterval(async () => {
    try {
      const activeAssets = await AssetModel.find({ isActive: true });

      for (let asset of activeAssets) {
        // Mock a minor volatility swing movement between -1.5% and +1.5%
        const percentageShift = (Math.random() * 3 - 1.5) / 100;
        const netAdjustment = asset.currentPrice * percentageShift;
        
        asset.currentPrice = parseFloat((asset.currentPrice + netAdjustment).toFixed(2));
        await asset.save();

        // 1. Core WebSocket Broadcaster (Real-Time Stock Stream)
        if (io) {
          io.emit("realtime-ticker-feed", { assetId: asset._id, currentPrice: asset.currentPrice });
        }

        // 2. Alert Boundary Interception Verification Check Engine
        const rulesToTest = await AlertModel.find({ asset: asset._id, isTriggered: false });
        for (let rule of rulesToTest) {
          let triggered = false;

          if (rule.condition === "ABOVE" && asset.currentPrice >= rule.targetPrice) {
            triggered = true;
          } else if (rule.condition === "BELOW" && asset.currentPrice <= rule.targetPrice) {
            triggered = true;
          }

          if (triggered) {
            rule.isTriggered = true;
            await rule.save();

            // Notify specific room named after the User's ID string structure
            if (io) {
              io.to(rule.user.toString()).emit("price-alert-notification", {
                message: `ALERT: ${asset.symbol} crossed your setup target of $${rule.targetPrice}! (Current Market Price: $${asset.currentPrice})`,
                assetId: asset._id,
                symbol: asset.symbol,
                currentPrice: asset.currentPrice
              });
            }
          }
        }
      }
    } catch (err) {
      console.error("Critical execution issue within market loop engine:", err);
    }
  }, 5000);
}