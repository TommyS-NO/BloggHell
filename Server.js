const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();
const PORT = 3234; //postnummer for MORROskyld

const mainRoutes = require("./server/routes/main");
app.use("/", mainRoutes);

//Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//Sette EJS som visningsmotor istedet for HTML filer.!
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes inProgress

// app.use('/', require('./server/routes/main'));
// app.use('/', require('./server/routes/admin'));

app.get("/", (req, res) => {
  res.send("Hello from BloggHell!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
