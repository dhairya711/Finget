import connectDB from "../finget-backend/config/db.js";
import backendApp from "../finget-backend/app.js";
import dotenv from "dotenv";

if (!process.env.MONGO_URI) {
  try {
    dotenv.config({ path: "./finget-backend/.env" });
  } catch (e) {}
}

const { createApp } = backendApp;
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
