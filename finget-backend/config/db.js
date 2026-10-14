const mongoose = require("mongoose");

let cached = global._mongooseConn;
if (!cached) {
  cached = global._mongooseConn = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState >= 1) {
    return cached.conn;
  }

  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/finget";

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, { serverSelectionTimeoutMS: 7000 })
      .then((m) => {
        console.log("MongoDB Connected");
        return m;
      })
      .catch(async (err) => {
        cached.promise = null;
        if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
          console.error("MongoDB connection failed in production:", err.message);
          throw err;
        }
        console.log("Local MongoDB not detected. Attempting in-memory fallback...");
        try {
          const { MongoMemoryServer } = require("mongodb-memory-server");
          const mongoServer = await MongoMemoryServer.create();
          const mongoUri = mongoServer.getUri();
          console.log(`In-memory MongoDB started at: ${mongoUri}`);
          return await mongoose.connect(mongoUri);
        } catch (fallbackErr) {
          console.error("Failed to start in-memory MongoDB:", fallbackErr.message);
          throw err;
        }
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = connectDB;


