import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    asset: {
      type: Schema.Types.ObjectId,
      ref: "asset",
      required: true,
    },
    orderType: {
      type: String,
      enum: ["BUY", "SELL"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [0.01, "Quantity must be greater than 0"],
    },
    priceAtExecution: {
      type: Number,
      required: true,
      description: "The price of 1 unit of the asset at the exact time of trade",
    },
    totalAmount: {
      type: Number,
      required: true,
      description: "Total fiat value of the transaction (quantity * price)",
    },
    status: {
      type: String,
      enum: ["COMPLETED", "FAILED", "PENDING"],
      default: "COMPLETED",
    }
  },
  {
    timestamps: true, // Automatically handles createdAt (timestamp of the trade)
    versionKey: false,
  }
);

orderSchema.index({ user: 1, createdAt: -1 });

export const OrderModel = model("order", orderSchema);