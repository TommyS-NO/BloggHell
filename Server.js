require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const session = require("express-session");

const app = express();
const PORT = 3234;

// Set up session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 3000,
    },
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes
const mainRoutes = require("./server/routes/main");
const adminRoutes = require("./server/routes/admin");

app.use("/", mainRoutes);
app.use("/admin", adminRoutes);

// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
