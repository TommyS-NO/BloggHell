const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const session = require("express-session");

const app = express();
const PORT = 8080;

// ---------------------
// Middleware Setup
// ---------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: "hemmelig",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 10 * 60 * 1000 },
  })
);

app.use(express.static(path.join(__dirname, "../blogghell/Public")));
// ---------------------
// Routes Setup
// ---------------------

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../blogghell/Views/index.html"));
});

const mainRoutes = require("./Server/Routes/mainRoute");
const adminRoutes = require("./Server/Routes/adminRoute");

app.use("/api/blogginnlegg", mainRoutes);
app.use("/api/admin", adminRoutes);

// ---------------------
// Error Handlers
// ---------------------

app.use((req, res, next) => {
  res.status(404).json({ error: "Page not found" });
});

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
