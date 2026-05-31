import exp from "express";
import { connect } from "mongoose";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http"; // Required for Socket.io
import { Server } from "socket.io"; // Socket.io server
import { AssetModel } from "./models/AssetModel.js"; // Import your model
import { AlertModel } from "./models/AlertModel.js"; // IMPORT ALERTS MODEL
import { PortfolioModel } from "./models/PortfolioModel.js";
import { OrderModel } from "./models/OrderModel.js";
import { UserModel } from "./models/UserModel.js";
import { ConditionalOrderModel } from "./models/ConditionalOrderModel.js";

// Import Trading Platform APIs
import { authRoute } from "./APIs/AuthAPI.js";
import { marketRoute } from "./APIs/MarketAPI.js";
import { traderRoute } from "./APIs/TraderAPI.js";
import { adminRoute } from "./APIs/AdminAPI.js";
import { aiRoute } from "./APIs/AiAPI.js";

config();

const app = exp();
const PORT = process.env.PORT || 4000;

// 1. Create an HTTP server (Socket.io cannot attach directly to Express in some environments)
const server = http.createServer(app);

// 2. Initialize Socket.io
const allowedOrigins = ["http://localhost:5173", process.env.FRONTEND_URL].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

app.use(cors({ 
  origin: allowedOrigins, 
  credentials: true 
}));

app.use(exp.json());
app.use(cookieParser());

// Connect APIs
// Open your backend server.js and change these lines:
app.use("/api/auth", authRoute);     
app.use("/api/market", marketRoute); 
app.use("/api/trader", traderRoute); 
app.use("/api/admin", adminRoute);   
app.use("/api/ai", aiRoute); // Public AI assistant endpoints

// --- SOCKET CONNECTION ROOM HANDLERS ---
io.on("connection", (socket) => {
  // Listen for the trader to register their unique user ID to join a private notification room
  socket.on("join-user-room", (userId) => {
    if (userId) {
      socket.join(userId);
      console.log(`Trader joined authenticated alert room channel: ${userId}`);
    }
  });

  socket.on("disconnect", () => {
    console.log("A terminal client left the live market network feed.");
  });
});

// --- REAL-TIME PRICE ENGINE & PRICE ALERT INTERCEPTOR ---
// This function simulates market movement and checks pending user alerts every 5 seconds
const startPriceSimulation = () => {
  setInterval(async () => {
    try {
      const assets = await AssetModel.find({ isActive: true });
      
      const updates = assets.map(asset => {
        // Random fluctuation between -1% and +1%
        const percentage = (Math.random() * 0.02 - 0.01);
        const change = asset.currentPrice * percentage;
        const newPrice = Math.max(1, asset.currentPrice + change); // Price shouldn't go below 1
        
        return {
          _id: asset._id,
          symbol: asset.symbol,
          currentPrice: parseFloat(newPrice.toFixed(2)),
          isUp: change >= 0
        };
      });

      // Update Database and simultaneously evaluate custom alert trigger rule boundaries
      for (let update of updates) {
        // A. Standard update statement matching your performance parameters
        await AssetModel.updateOne({ _id: update._id }, { currentPrice: update.currentPrice });

        // B. Query the active untriggered rules belonging exclusively to this specific asset index
        const pendingRules = await AlertModel.find({ asset: update._id, isTriggered: false });
        
        for (let rule of pendingRules) {
          let shouldTrigger = false;

          if (rule.condition === "ABOVE" && update.currentPrice >= rule.targetPrice) {
            shouldTrigger = true;
          } else if (rule.condition === "BELOW" && update.currentPrice <= rule.targetPrice) {
            shouldTrigger = true;
          }

          if (shouldTrigger) {
            rule.isTriggered = true;
            await rule.save();

            io.to(rule.user.toString()).emit("price-alert-notification", {
              message: `ALERT: ${update.symbol} crossed your setup target of $${rule.targetPrice}!`,
              symbol: update.symbol,
              currentPrice: update.currentPrice
            });
          }
        }

      // C. Scan pending conditional stop-loss / take-profit orders and execute them automatically
      const pendingOrders = await ConditionalOrderModel.find({ asset: update._id, executed: false }).populate("user");
      for (const order of pendingOrders) {
        const price = update.currentPrice;
        const isTriggered =
          (order.triggerType === "TAKE_PROFIT" && price >= order.triggerPrice) ||
          (order.triggerType === "STOP_LOSS" && price <= order.triggerPrice);

        if (!isTriggered) continue;

        const portfolioItem = await PortfolioModel.findOne({ user: order.user._id, asset: update._id });
        if (!portfolioItem || portfolioItem.quantity < order.quantity) {
          order.status = "FAILED";
          order.executed = true;
          await order.save();
          continue;
        }

        const totalRevenue = parseFloat((price * order.quantity).toFixed(2));
        const trader = await UserModel.findById(order.user._id);
        trader.walletBalance += totalRevenue;
        await trader.save();

        portfolioItem.quantity -= order.quantity;
        if (portfolioItem.quantity <= 0) {
          await PortfolioModel.deleteOne({ _id: portfolioItem._id });
        } else {
          await portfolioItem.save();
        }

        await OrderModel.create({
          user: order.user._id,
          asset: update._id,
          orderType: "SELL",
          quantity: order.quantity,
          priceAtExecution: price,
          totalAmount: totalRevenue,
          status: "COMPLETED"
        });

        order.status = "EXECUTED";
        order.executed = true;
        await order.save();

        io.to(order.user._id.toString()).emit("conditional-order-triggered", {
          message: `${update.symbol} ${order.triggerType.replace("_", " ")} executed at $${price} for ${order.quantity} shares.`,
          asset: update.symbol,
          triggeredPrice: price,
          orderType: order.triggerType,
        });
      }
    }

      // 3. Broadcast new prices to all connected users
      io.emit("market-data-update", updates);
    } catch (err) {
      console.log("Price simulation error:", err);
    }
  }, 5000); // 5-second interval
};

// --- DATABASE & SERVER START ---
const connectDB = async () => {
  try {
    await connect(process.env.DB_URL);
    console.log("DB connection success");

    // Start simulation
    startPriceSimulation();

    // 4. Use server.listen instead of app.listen
    server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (err) {
    console.log("Err in DB connection", err);
  }
};

connectDB();

// (Rest of your error handling middleware remains the same...)