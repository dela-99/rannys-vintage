import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { connectDB } from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import subscriberRoutes from "./routes/subscriberRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

// Import the TanStack SSR handler
import tanstackHandler from "../dist/server/index.js";

dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".env") });
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";
const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.set("trust proxy", 1);
app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        (!isProduction && allowedOrigins.length === 0)
      ) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "same-origin");
  next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/subscribers", subscriberRoutes);
app.use("/api/uploads", uploadRoutes);

// Serve client assets statically
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distClientPath = path.join(__dirname, "../dist/client");
app.use(express.static(distClientPath));

// All other routes: use TanStack SSR handler
app.use("*", async (req, res) => {
  try {
    const ssrHandler = tanstackHandler.default;
    const response = await ssrHandler.fetch(
      new Request(`http://${req.get("host")}${req.originalUrl}`, {
        method: req.method,
        headers: req.headers,
        body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
      })
    );

    // Set response headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    res.status(response.status);
    res.send(await response.text());
  } catch (error) {
    console.error("SSR Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.use(notFound);
app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Ranny's Vintage Clothing API running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error(`Database connection failed: ${error.message}`);
    process.exit(1);
  });
