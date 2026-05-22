import { connect, disconnect } from "mongoose";
import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { UserModel } from "./models/UserModel.js";
import { AssetModel } from "./models/AssetModel.js";
import { PortfolioModel } from "./models/PortfolioModel.js";
import { OrderModel } from "./models/OrderModel.js";
import { AlertModel } from "./models/AlertModel.js";

config();

// Fallback to local default if the environment coordinate string is empty
const MONGO_URI = process.env.DB_URL || "mongodb://127.0.0.1:27017/stock_simulation";

const seedDatabase = async () => {
  try {
    await connect(MONGO_URI);
    console.log("Connected to MongoDB for data seeding...");

    // 1. Wipe out any stale, non-conforming testing data records
    await UserModel.deleteMany({});
    await AssetModel.deleteMany({});
    await PortfolioModel.deleteMany({});
    await OrderModel.deleteMany({});
    await AlertModel.deleteMany({});
    console.log("Cleared existing collections.");

    // 2. Seed Mock Active Market Asset Classes
    const assetData = [
      { name: "Apple Inc.", symbol: "AAPL", currentPrice: 175.50, isActive: true },
      { name: "Tesla Inc.", symbol: "TSLA", currentPrice: 180.25, isActive: true },
      { name: "NVIDIA Corp.", symbol: "NVDA", currentPrice: 850.00, isActive: true },
      { name: "Microsoft Corp.", symbol: "MSFT", currentPrice: 420.10, isActive: true },
      { name: "Amazon.com Inc.", symbol: "AMZN", currentPrice: 178.40, isActive: true },
      { name: "Bitcoin", symbol: "BTC", currentPrice: 65000.00, isActive: true },
      { name: "Ethereum", symbol: "ETH", currentPrice: 3500.00, isActive: true }
    ];
    const seededAssets = await AssetModel.insertMany(assetData);
    console.log(`Successfully seeded ${seededAssets.length} active market assets.`);

    // Map index identifiers by their core symbols for safe reference lookup matching
    const assetMap = {};
    seededAssets.forEach(a => { assetMap[a.symbol] = a._id; });

    // 3. Encrypt common login credentials via bcrypt to clear authentication checks
    const commonSecurePassword = await bcrypt.hash("password123", 10);

    // Seed Trader Profiles fulfilling all structural validation layout properties
    const userData = [
      { firstName: "Warren", lastName: "Buffett", username: "WarrenBuffett", email: "warren@test.com", password: commonSecurePassword, walletBalance: 25000, role: "TRADER" },
      { firstName: "Crypto", lastName: "Whale", username: "CryptoWhale", email: "whale@test.com", password: commonSecurePassword, walletBalance: 1200, role: "TRADER" },
      { firstName: "Paper", lastName: "Trader99", username: "PaperTrader99", email: "trader99@test.com", password: commonSecurePassword, walletBalance: 8500, role: "TRADER" },
      { firstName: "Market", lastName: "Maker", username: "MarketMaker", email: "maker@test.com", password: commonSecurePassword, walletBalance: 50000, role: "TRADER" }
    ];
    const seededUsers = await UserModel.insertMany(userData);
    console.log(`Successfully seeded ${seededUsers.length} trader profiles.`);

    // Create a precise relational map indexed directly by unique username handle strings
    const userMap = {};
    seededUsers.forEach(u => { userMap[u.username] = u._id; });

    // 4. Seed Active Portfolio Assets Allocations (Useful to calculate real-time PnL)
    const portfolioData = [
      { user: userMap["WarrenBuffett"], asset: assetMap["AAPL"], quantity: 50, averageBuyPrice: 165.00 },
      { user: userMap["WarrenBuffett"], asset: assetMap["MSFT"], quantity: 20, averageBuyPrice: 430.00 },
      { user: userMap["CryptoWhale"], asset: assetMap["BTC"], quantity: 1.5, averageBuyPrice: 61000.00 },
      { user: userMap["CryptoWhale"], asset: assetMap["ETH"], quantity: 5, averageBuyPrice: 3600.00 },
      { user: userMap["PaperTrader99"], asset: assetMap["TSLA"], quantity: 15, averageBuyPrice: 180.25 },
      { user: userMap["PaperTrader99"], asset: assetMap["NVDA"], quantity: 5, averageBuyPrice: 800.00 }
    ];
    await PortfolioModel.insertMany(portfolioData);
    console.log("Portfolio positions injected successfully.");

    // 5. Seed 15 Granular Chronological Transaction Entries (Historical Audit Analysis logs)
    // Structured back step-by-step using separate calendar timestamps to mock accurate histories
    const historyData = [
      {
        user: userMap["WarrenBuffett"],
        asset: assetMap["AAPL"],
        orderType: "BUY",
        quantity: 30,
        priceAtExecution: 160.00,
        totalAmount: 4800.00,
        status: "COMPLETED",
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 14 Days Ago
      },
      {
        user: userMap["WarrenBuffett"],
        asset: assetMap["AAPL"],
        orderType: "BUY",
        quantity: 20,
        priceAtExecution: 172.50,
        totalAmount: 3450.00,
        status: "COMPLETED",
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
      },
      {
        user: userMap["WarrenBuffett"],
        asset: assetMap["MSFT"],
        orderType: "BUY",
        quantity: 20,
        priceAtExecution: 430.00,
        totalAmount: 8600.00,
        status: "COMPLETED",
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      },
      {
        user: userMap["WarrenBuffett"],
        asset: assetMap["AMZN"],
        orderType: "BUY",
        quantity: 15,
        priceAtExecution: 175.00,
        totalAmount: 2625.00,
        status: "COMPLETED",
        createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000)
      },
      {
        user: userMap["WarrenBuffett"],
        asset: assetMap["AMZN"],
        orderType: "SELL",
        quantity: 15,
        priceAtExecution: 182.30,
        totalAmount: 2734.50,
        status: "COMPLETED",
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
      },
      {
        user: userMap["CryptoWhale"],
        asset: assetMap["BTC"],
        orderType: "BUY",
        quantity: 2.0,
        priceAtExecution: 61000.00,
        totalAmount: 122000.00,
        status: "COMPLETED",
        createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000)
      },
      {
        user: userMap["CryptoWhale"],
        asset: assetMap["BTC"],
        orderType: "SELL",
        quantity: 0.5,
        priceAtExecution: 64500.00,
        totalAmount: 32250.00,
        status: "COMPLETED",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        user: userMap["CryptoWhale"],
        asset: assetMap["ETH"],
        orderType: "BUY",
        quantity: 5,
        priceAtExecution: 3600.00,
        totalAmount: 18000.00,
        status: "COMPLETED",
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      },
      {
        user: userMap["PaperTrader99"],
        asset: assetMap["TSLA"],
        orderType: "BUY",
        quantity: 25,
        priceAtExecution: 195.00,
        totalAmount: 4875.00,
        status: "COMPLETED",
        createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000)
      },
      {
        user: userMap["PaperTrader99"],
        asset: assetMap["TSLA"],
        orderType: "SELL",
        quantity: 10,
        priceAtExecution: 185.00,
        totalAmount: 1850.00,
        status: "COMPLETED",
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
      },
      {
        user: userMap["PaperTrader99"],
        asset: assetMap["NVDA"],
        orderType: "BUY",
        quantity: 5,
        priceAtExecution: 800.00,
        totalAmount: 4000.00,
        status: "COMPLETED",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        user: userMap["MarketMaker"],
        asset: assetMap["AMZN"],
        orderType: "BUY",
        quantity: 100,
        priceAtExecution: 170.00,
        totalAmount: 17000.00,
        status: "COMPLETED",
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        user: userMap["MarketMaker"],
        asset: assetMap["AMZN"],
        orderType: "SELL",
        quantity: 100,
        priceAtExecution: 178.00,
        totalAmount: 17800.00,
        status: "COMPLETED",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        user: userMap["MarketMaker"],
        asset: assetMap["TSLA"],
        orderType: "BUY",
        quantity: 50,
        priceAtExecution: 177.00,
        totalAmount: 8850.00,
        status: "FAILED", // Populates simulated failed orders metrics
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        user: userMap["PaperTrader99"],
        asset: assetMap["MSFT"],
        orderType: "BUY",
        quantity: 10,
        priceAtExecution: 415.00,
        totalAmount: 4150.00,
        status: "PENDING", // Populates dynamic pending orders parameters
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 Hours Ago
      }
    ];

    const seededOrders = await OrderModel.insertMany(historyData);
    console.log(`Successfully seeded ${seededOrders.length} historical trading logs.`);

    // 6. Seed Default Active Target Watch Alerts
    const alertData = [
      { user: userMap["WarrenBuffett"], asset: assetMap["AAPL"], targetPrice: 190.00, condition: "ABOVE", isTriggered: false },
      { user: userMap["WarrenBuffett"], asset: assetMap["MSFT"], targetPrice: 400.00, condition: "BELOW", isTriggered: false },
      { user: userMap["CryptoWhale"], asset: assetMap["BTC"], targetPrice: 70000.00, condition: "ABOVE", isTriggered: false }
    ];
    await AlertModel.insertMany(alertData);
    console.log("Successfully seeded basic pending target watch alerts.");

    console.log("Database populated successfully with valid cryptographic records!");
    await disconnect();
  } catch (err) {
    console.error("Critical database seeding failure encountered:", err);
    await disconnect();
  }
};

seedDatabase();