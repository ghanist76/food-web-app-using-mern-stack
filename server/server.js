require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const Food = require("./models/Food");
const { defaultFoods } = require("./data/defaultFoods");
const authRoutes = require("./routes/auth");
const foodRoutes = require("./routes/foods");
const orderRoutes = require("./routes/orders");

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

async function ensureMenuSeeded() {
  const count = await Food.countDocuments();
  if (count === 0) {
    await Food.insertMany(defaultFoods);
    console.log(`Auto-seeded ${defaultFoods.length} menu items.`);
  }
}

app.get("/api/health", (_req, res) => res.json({ status: "ok", app: "FoodExpress API" }));
app.use("/api/auth", authRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/foodexpress")
  .then(async () => {
    await ensureMenuSeeded();
    app.listen(PORT, () => console.log(`FoodExpress API running on http://localhost:${PORT}`));
  })
  .catch((err) => { console.error("MongoDB connection failed:", err.message); process.exit(1); });
