const router = require("express").Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const Food = require("../models/Food");
const Order = require("../models/Order");

function calculateOrderOffer(items, subtotal) {
  const hasBurger = items.some((item) => /burger|pizza/i.test(item.name));
  const hasDrink = items.some((item) => /cola|drink|lassi|lemonade|coffee|juice/i.test(item.name));
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (subtotal >= 999) {
    return { discount: Number((subtotal * 0.15).toFixed(2)), offerName: "Mega Feast 15% off" };
  }
  if (hasBurger && hasDrink) {
    return { discount: Number(Math.min(subtotal * 0.2, 220).toFixed(2)), offerName: "Combo Saver: Burger + Drink" };
  }
  if (itemCount >= 4) {
    return { discount: Number(Math.min(subtotal * 0.12, 180).toFixed(2)), offerName: "Family Bundle 12% off" };
  }
  if (subtotal >= 499) {
    return { discount: Number(Math.min(subtotal * 0.08, 120).toFixed(2)), offerName: "Free delivery + savings" };
  }
  return { discount: 0, offerName: "" };
}

router.post("/", auth, async (req, res) => {
  try {
    const address = String(req.body.address || "").trim();
    const paymentMethod = req.body.paymentMethod === "DEMO" ? "DEMO" : "COD";
    const requested = Array.isArray(req.body.items) ? req.body.items : [];
    if (address.length < 8) return res.status(400).json({ message: "Enter a complete delivery address." });
    if (!requested.length) return res.status(400).json({ message: "Your cart is empty." });

    const items = [];
    for (const row of requested) {
      const food = await Food.findById(row.foodId);
      const quantity = Math.floor(Number(row.quantity));
      if (!food || !Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
        return res.status(400).json({ message: "One or more cart items are invalid." });
      }
      items.push({ food: food._id, name: food.name, price: food.price, quantity });
    }
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const { discount, offerName } = calculateOrderOffer(items, total);
    const finalTotal = Math.max(0, total - discount);

    const order = await Order.create({
      user: req.user.id,
      items,
      address,
      paymentMethod,
      total,
      discount,
      finalTotal,
      offerName
    });

    res.status(201).json({ message: "Order placed successfully.", order });
  } catch (error) {
    console.error("Order failed:", error.message);
    res.status(500).json({ message: "Could not place order." });
  }
});

router.get("/my", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch { res.status(500).json({ message: "Could not load your orders." }); }
});

router.get("/admin", auth, admin, async (_req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .lean();
    res.json({ orders });
  } catch (error) {
    console.error("Admin orders failed:", error.message);
    res.status(500).json({ message: "Could not load all orders." });
  }
});

router.patch("/admin/:id/status", auth, admin, async (req, res) => {
  try {
    const allowedStatuses = ["Placed", "Preparing", "Delivered", "Cancelled"];
    const status = String(req.body.status || "");
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Choose a valid order status." });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.json({ order });
  } catch (error) {
    console.error("Order status update failed:", error.message);
    res.status(500).json({ message: "Could not update order status." });
  }
});

module.exports = router;
