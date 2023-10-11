// ---------------------
// Module Imports
// ---------------------
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const session = require("express-session");

// ---------------------
// App Initialization
// ---------------------
const app = express();
const PORT = 3234;

// ---------------------
// Middleware Setup
// ---------------------
// JSON and Form Data Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie and Session Handling
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 30 * 60 * 1000, // 30 minutes
    },
  })
);

// Static Files Serving
app.use(express.static(path.join(__dirname, "../BLOGG/public")));

// ---------------------
// Routes Setup
// ---------------------
const mainRoutes = require("./Server/Routes/main");
const adminRoutes = require("./Server/Routes/admin");
app.use("/", mainRoutes);
app.use("/admin", adminRoutes);

// ---------------------
// Error Handlers
// ---------------------
// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Page not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Server error", details: err.message });
});

// ---------------------
// Start Server
// ---------------------
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
