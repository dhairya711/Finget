require("dotenv").config();
const path = require("path");

// Load backend environment if local/fallback
require("dotenv").config({ path: path.join(__dirname, "../finget-backend/.env") });

const connectDB = require("../finget-backend/config/db");
const { createApp } = require("../finget-backend/app");

let app = null;

module.exports = async (req, res) => {
  try {
    await connectDB();
    if (!app) {
      app = createApp();
    }
    return app(req, res);
  } catch (err) {
    console.error("Vercel Serverless Function DB error:", err.message);
    return res.status(500).json({ error: "Database connection failed", details: err.message });
  }
};
