import { Schema, model } from "mongoose";

const alertSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    asset: { type: Schema.Types.ObjectId, ref: "asset", required: true },
    targetPrice: { type: Number, required: true },
    condition: { type: String, enum: ["ABOVE", "BELOW"], required: true },
    isTriggered: { type: Boolean, default: false }
  },
  { timestamps: true, versionKey: false }
);

export const AlertModel = model("alert", alertSchema);