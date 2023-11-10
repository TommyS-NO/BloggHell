const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const session = require("express-session");

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
    secret: "hemmelig",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 10 * 60 * 1000, // 10 min
    },
  })
);

app.use(express.static(path.join(__dirname, "../blogghell/Public/")));

// ---------------------
// Routes Setup
// ---------------------

const mainRoutes = require("./Server/Routes/mainRoute");
const adminRoutes = require("./Server/Routes/adminRoute");

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
