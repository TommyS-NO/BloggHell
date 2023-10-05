const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");
const adminUsername = process.env.ADMIN_USERNAME;
const adminPassword = process.env.ADMIN_PASSWORD;

const postsDataPath = path.join(__dirname, "../data/blogginnlegg.json");

async function ensureAuthenticated(req, res, next) {
  if (req.session.isAuthenticated) {
    return next();
  } else {
    res.redirect("/");
  }
}

router.get("/admin", (req, res) => {
  if (req.session.isAuthenticated) {
    return res.redirect("/admin-dashboard");
  }
  res.redirect("/");
});

router.post("/admin", async (req, res) => {
  const { username, password } = req.body;

  const validChars = /^[a-zA-Z0-9æøåÆØÅ]+$/;
  if (!username.match(validChars) || !password.match(validChars)) {
    return res.send(
      '<script>alert("Ugyldige tegn i brukernavn eller passord."); window.location.href = "/";</script>'
    );
  }

  if (username === adminUsername && password === adminPassword) {
    req.session.isAuthenticated = true;
    res.redirect("/admin-dashboard");
  } else {
    res.send(
      '<script>alert("Feil brukernavn eller passord."); window.location.href = "/";</script>'
    );
  }
});

router.get("/admin-dashboard", ensureAuthenticated, async (req, res) => {
  try {
    const posts = JSON.parse(await fs.readFile(postsDataPath, "utf-8"));
    res.render("admin/admin", { posts });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.get("/add-post", ensureAuthenticated, (req, res) => {
  res.render("admin/add-post");
});

router.post("/add-post", ensureAuthenticated, async (req, res) => {
  try {
    const newPost = {
      id: Date.now(),
      title: req.body.title,
      content: req.body.content,
      dateCreated: new Date().toISOString(),
    };
    const posts = JSON.parse(await fs.readFile(postsDataPath, "utf-8"));
    posts.push(newPost);
    await fs.writeFile(postsDataPath, JSON.stringify(posts, null, 4));
    res.redirect("/admin.html");
  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
