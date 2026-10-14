const path = require("path");

// Ensure modules in finget-backend/node_modules are resolvable
const backendNodeModules = path.resolve(__dirname, "../finget-backend/node_modules");
if (!module.paths.includes(backendNodeModules)) {
  module.paths.push(backendNodeModules);
}

try {
  require("dotenv").config({ path: path.join(__dirname, "../finget-backend/.env") });
} catch (e) {
  // Ignore in production where environment variables are injected directly
}

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
