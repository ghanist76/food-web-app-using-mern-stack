const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{
    food: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 }
  }],
  address: { type: String, required: true, trim: true },
  paymentMethod: { type: String, enum: ["COD", "DEMO"], default: "COD" },
  total: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  finalTotal: { type: Number, default: 0, min: 0 },
  offerName: { type: String, default: "" },
  status: { type: String, enum: ["Placed", "Preparing", "Delivered", "Cancelled"], default: "Placed" }
}, { timestamps: true });
module.exports = mongoose.model("Order", orderSchema);
