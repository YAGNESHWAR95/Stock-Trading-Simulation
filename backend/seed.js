import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { UserModel } from "./models/UserModel.js";
import { AssetModel } from "./models/AssetModel.js";

config(); // Load variables from .env

const seedDatabase = async () => {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected successfully.");

    // 1. Clear existing data and drop old corrupted collections
    console.log("Clearing old data...");
    await UserModel.deleteMany({});
    await AssetModel.deleteMany({});
    
    // THIS LINE completely destroys the old portfolios collection and its broken indexes
    try {
      await mongoose.connection.db.dropCollection('portfolios');
      console.log("Dropped old portfolios collection.");
    } catch (err) {
      console.log("No old portfolios collection to drop.");
    }

    // 2. Create Sample Users
    console.log("Generating Users...");
    const hashedAdminPassword = await bcrypt.hash("admin123", 10);
    const hashedTraderPassword = await bcrypt.hash("trader123", 10);

    await UserModel.create([
      {
        firstName: "System",
        lastName: "Admin",
        email: "admin@tradepro.com",
        password: hashedAdminPassword,
        role: "ADMIN",
        walletBalance: 0,
      },
      {
        firstName: "John",
        lastName: "Doe",
        email: "john@test.com",
        password: hashedTraderPassword,
        role: "TRADER",
        walletBalance: 10000, // Starts with $10,000
      }
    ]);

    // 3. Create Sample Assets
    console.log("Generating Market Assets...");
    await AssetModel.create([
      {
        symbol: "AAPL",
        name: "Apple Inc.",
        currentPrice: 175.50,
        marketCap: 2800000000000,
        isActive: true
      },
      {
        symbol: "TSLA",
        name: "Tesla, Inc.",
        currentPrice: 240.20,
        marketCap: 750000000000,
        isActive: true
      },
      {
        symbol: "BTC",
        name: "Bitcoin",
        currentPrice: 42000.00,
        marketCap: 820000000000,
        isActive: true
      },
      {
        symbol: "ETH",
        name: "Ethereum",
        currentPrice: 2250.75,
        marketCap: 270000000000,
        isActive: true
      },
      {
        symbol: "AMZN",
        name: "Amazon.com, Inc.",
        currentPrice: 145.80,
        marketCap: 1500000000000,
        isActive: true
      }
    ]);

    console.log("✅ Database seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding Error:", err);
    process.exit(1);
  }
};

seedDatabase();