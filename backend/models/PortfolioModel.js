import { Schema, model } from "mongoose";

const portfolioSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    asset: { type: Schema.Types.ObjectId, ref: "asset", required: true },
    quantity: { type: Number, required: true, min: 0 },
    averageBuyPrice: { type: Number, required: true },
  },
  { timestamps: true, versionKey: false }
);

// Ensure a user only has one portfolio entry per asset
portfolioSchema.index({ user: 1, asset: 1 }, { unique: true });

export const PortfolioModel = model("portfolio", portfolioSchema);