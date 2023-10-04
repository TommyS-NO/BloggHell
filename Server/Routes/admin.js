const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const adminDataPath = path.join(__dirname, "../data/admin.json");
const postsDataPath = path.join(__dirname, "../data/blogginnlegg.json");

// GET Admin Login Page
router.get("/admin", (req, res) => {
  if (req.session.isAuthenticated) {
    return res.redirect("/admin.html");
  }
  res.render("admin/index", { error: req.session.error });
  req.session.error = null; // Clear the error after displaying it
});

// POST Admin Login
router.post("/admin", (req, res) => {
  const { username, password } = req.body;

  // Validering
  const validChars = /^[a-zA-Z0-9æøåÆØÅ]+$/;
  if (!username.match(validChars) || !password.match(validChars)) {
    req.session.error = "Ugyldige tegn i brukernavn eller passord.";
    return res.redirect("/admin");
  }

  const adminData = JSON.parse(fs.readFileSync(adminDataPath, "utf-8"));

  if (username === adminData.username && password === adminData.password) {
    req.session.isAuthenticated = true;
    res.redirect("/admin.html");
  } else {
    req.session.error = "Feil brukernavn eller passord.";
    res.redirect("/admin");
  }
});

// GET Admin Dashboard
router.get("/admin.html", (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.redirect("/admin");
  }
  const posts = JSON.parse(fs.readFileSync(postsDataPath, "utf-8"));
  res.render("admin/admin", { posts });
});

// GET Add New Post
router.get("/add-post", (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.redirect("/admin");
  }
  res.render("admin/add-post");
});

// POST Add New Post
router.post("/add-post", (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.redirect("/admin");
  }
  const newPost = {
    id: Date.now(),
    title: req.body.title,
    content: req.body.content,
    dateCreated: new Date().toISOString(),
  };
  const posts = JSON.parse(fs.readFileSync(postsDataPath, "utf-8"));
  posts.push(newPost);
  fs.writeFileSync(postsDataPath, JSON.stringify(posts, null, 4));
  res.redirect("/admin.html");
});

module.exports = router;
