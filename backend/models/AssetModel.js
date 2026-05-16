import { Schema, model } from "mongoose";

const assetSchema = new Schema(
  {
    symbol: { type: String, required: true, unique: true }, // e.g., AAPL, BTC
    name: { type: String, required: true },
    currentPrice: { type: Number, required: true },
    marketCap: { type: Number },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, strict: "throw", versionKey: false }
);

export const AssetModel = model("asset", assetSchema);