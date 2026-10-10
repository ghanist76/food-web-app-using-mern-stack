const User = require("../models/User");

module.exports = async function admin(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("role");
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required." });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Could not verify admin access." });
  }
};