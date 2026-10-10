const router = require("express").Router();
const Food = require("../models/Food");
const { defaultFoods, restaurants, offerCombos } = require("../data/defaultFoods");

async function ensureMenuSeeded() {
  const count = await Food.countDocuments();
  if (count === 0) {
    await Food.insertMany(defaultFoods);
  }
}

router.get("/", async (req, res) => {
  try {
    await ensureMenuSeeded();
    const filter = {};
    if (req.query.category && req.query.category !== "All") filter.category = req.query.category;
    if (req.query.restaurant && req.query.restaurant !== "All") filter.restaurant = req.query.restaurant;
    if (req.query.search) {
      filter.name = {
        $regex: String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        $options: "i"
      };
    }
    res.json(await Food.find(filter).sort({ category: 1, restaurant: 1, name: 1 }));
  } catch (error) {
    console.error("Could not load menu:", error.message);
    res.status(500).json({ message: "Could not load menu." });
  }
});

router.get("/restaurants", async (_req, res) => {
  try {
    res.json({ restaurants });
  } catch (error) {
    console.error("Could not load restaurants:", error.message);
    res.status(500).json({ message: "Could not load restaurants." });
  }
});

router.get("/offers", async (_req, res) => {
  try {
    res.json({ offers: offerCombos });
  } catch (error) {
    console.error("Could not load offers:", error.message);
    res.status(500).json({ message: "Could not load offers." });
  }
});
module.exports = router;
