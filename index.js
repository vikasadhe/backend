require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const { connectDB, pool } = require("./config/db");

const galleryRoutes = require("./routes/galleryRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const contactRoutes = require("./routes/contactRoutes");
const admissionRoutes = require("./routes/admissionRoutes");
const holidayRoutes = require("./routes/holidayRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// CORS: allow your frontend and requests without an Origin header.
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Static uploads. Persistent storage is needed for production uploads.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "School API is running",
  });
});

// API routes (existing paths preserved)
app.use("/api/auth", authRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/notice", noticeRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admission", admissionRoutes);
app.use("/api/holiday", holidayRoutes);

app.get("/", (req, res) => {
  res.send("School Project API is running...");
});

// Start only after MySQL connects
async function startServer() {
  try {
    await connectDB();

    const PORT = Number(process.env.PORT || 5000);

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server listening on port ${PORT}`);
    });

    async function shutdown() {
      console.log("Shutting down server...");

      server.close(async () => {
        try {
          await pool.end();
          process.exit(0);
        } catch (error) {
          console.error("Shutdown error:", error.message);
          process.exit(1);
        }
      });
    }

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    console.error("Backend startup failed:", error.message);
    await pool.end().catch(() => {});
    process.exit(1);
  }
}

startServer();
