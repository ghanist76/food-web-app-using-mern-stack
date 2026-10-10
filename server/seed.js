require("dotenv").config();
const mongoose = require("mongoose");
const Food = require("./models/Food");
const { defaultFoods } = require("./data/defaultFoods");

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/foodexpress");
    for (const food of defaultFoods) {
      await Food.updateOne({ name: food.name }, { $set: food }, { upsert: true });
    }
    console.log(`Seed complete: ${defaultFoods.length} food items added/updated.`);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}
seedDatabase();
