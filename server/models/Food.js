const mongoose = require("mongoose");
const foodSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, trim: true },
  restaurant: { type: String, default: "FoodExpress" },
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  deliveryTime: { type: String, default: "20-30 min" },
  badge: { type: String, default: "Popular" },
  offerTag: { type: String, default: "" },
  image: { type: String, default: "" },
  description: { type: String, default: "" },
  isVegetarian: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model("Food", foodSchema);
