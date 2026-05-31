import { Schema, model } from "mongoose";

const conditionalOrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    asset: { type: Schema.Types.ObjectId, ref: "asset", required: true },
    quantity: { type: Number, required: true, min: [1, "Quantity must be at least 1"] },
    triggerPrice: { type: Number, required: true },
    triggerType: { type: String, enum: ["STOP_LOSS", "TAKE_PROFIT"], required: true },
    status: { type: String, enum: ["PENDING", "EXECUTED", "CANCELLED", "FAILED"], default: "PENDING" },
    executed: { type: Boolean, default: false }
  },
  { timestamps: true, versionKey: false }
);

export const ConditionalOrderModel = model("conditional-order", conditionalOrderSchema);