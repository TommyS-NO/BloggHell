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

router.get("/", (req, res) => {
  if (req.session.isAuthenticated) {
    return res.sendFile(path.join(__dirname, "../../views/admin.html"));
  }
  res.redirect("/");
});

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  const validChars = /^[a-zA-Z0-9æøåÆØÅ]+$/;
  if (!username.match(validChars) || !password.match(validChars)) {
    return res.send(
      '<script>alert("Ugyldige tegn i brukernavn eller passord."); window.location.href = "/";</script>'
    );
  }
  if (username === adminUsername && password === adminPassword) {
    req.session.isAuthenticated = true;
    res.redirect("/admin");
  } else {
    res.send(
      '<script>alert("Ugyldig innlogging."); window.location.href = "/";</script>'
    );
  }
});

router.get("/admin.html", ensureAuthenticated, async (req, res) => {
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

router.post("/api/new-post", ensureAuthenticated, async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = {
      id: Date.now(),
      title: title,
      content: content,
      dateCreated: new Date().toISOString(),
      views: 0,
      likes: 0,
    };
    const posts = JSON.parse(await fs.readFile(postsDataPath, "utf-8"));
    posts.unshift(newPost);
    await fs.writeFile(postsDataPath, JSON.stringify(posts, null, 4));
    res.json(newPost);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// Ny rute for å slette et innlegg
router.delete("/api/delete-post/:id", ensureAuthenticated, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const posts = JSON.parse(await fs.readFile(postsDataPath, "utf-8"));
    const postIndex = posts.findIndex((post) => post.id === postId);
    if (postIndex === -1) {
      return res.status(404).send("Innlegget ble ikke funnet.");
    }
    posts.splice(postIndex, 1);
    await fs.writeFile(postsDataPath, JSON.stringify(posts, null, 4));
    res.json({ success: true });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
