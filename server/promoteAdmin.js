require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

async function promoteAdmin() {
  const email = String(process.argv[2] || "").trim().toLowerCase();
  if (!email) {
    console.error("Usage: npm run make-admin -- customer@example.com");
    process.exitCode = 1;
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/foodexpress");
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { role: "admin" } },
      { new: true }
    );
    if (!user) {
      console.error(`No account found for ${email}. Register that user first, then retry.`);
      process.exitCode = 1;
      return;
    }
    console.log(`${user.email} now has admin access. Log out and back in to refresh the session.`);
  } catch (error) {
    console.error("Could not promote account:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

promoteAdmin();