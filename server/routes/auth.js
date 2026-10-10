const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function makeToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || "development_only_change_me", { expiresIn: "7d" });
}
function safeUser(user) { return { id: user._id, name: user.name, email: user.email, role: user.role || "customer" }; }

router.post("/register", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!name || !email || password.length < 8) {
      return res.status(400).json({ message: "Enter a name, valid email, and password with at least 8 characters." });
    }
    if (await User.findOne({ email })) return res.status(409).json({ message: "An account with this email already exists." });
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });
    res.status(201).json({ token: makeToken(user), user: safeUser(user) });
  } catch (err) { res.status(500).json({ message: "Could not register account." }); }
});

router.post("/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    res.json({ token: makeToken(user), user: safeUser(user) });
  } catch { res.status(500).json({ message: "Could not log in." }); }
});
module.exports = router;
