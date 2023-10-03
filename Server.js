const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const session = require("express-session");

const app = express();
const PORT = 3234; //postnummer for MORROskyld

// Set up session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Set up HTML as the view engine using EJS's renderFile function
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("views", path.join(__dirname, "views"));

// Routes
const mainRoutes = require("./server/routes/main");
app.use("/", mainRoutes);
app.use("/", require("./server/routes/admin"));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
