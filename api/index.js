import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (!process.env.MONGO_URI) {
  try {
    require("dotenv").config({ path: path.resolve(__dirname, "../finget-backend/.env") });
  } catch (e) {}
}

const connectDB = require("../finget-backend/config/db");
const { createApp } = require("../finget-backend/app");

let app = null;

export default async function handler(req, res) {
  try {
    await connectDB();
    if (!app) {
      app = createApp();
    }
    return app(req, res);
  } catch (err) {
    console.error("Vercel Serverless Function error:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Serverless function error", details: err.message }));
  }
}
