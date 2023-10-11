const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");

const postsDataPath = path.join(__dirname, "../Data/blogginnlegg.json");

// Middleware for å sjekke om admin er logget inn
function ensureAdmin(req, res, next) {
  if (req.session.isAdmin) {
    next();
  } else {
    res.status(403).send("Access denied");
  }
}

// POST - Admin Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    req.session.isAdmin = true;
    res.status(200).send("Admin logged in successfully");
  } else {
    res.status(401).send("Invalid credentials");
  }
});

// GET - Admin Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// GET - Hente alle innlegg for admin
router.get("/get-all-posts", ensureAdmin, async (req, res) => {
  try {
    const data = await fs.readFile(postsDataPath, "utf-8");
    const posts = JSON.parse(data);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// GET - Hente et spesifikt innlegg for redigering
router.get("/get-post/:id", ensureAdmin, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const data = await fs.readFile(postsDataPath, "utf-8");
    const posts = JSON.parse(data);
    const post = posts.find((p) => p.id === postId);
    if (!post) return res.status(404).send("Post not found.");
    res.status(200).json(post);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// POST - Opprett nytt blogginnlegg
router.post("/create-post", ensureAdmin, async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = {
      id: Date.now(),
      title,
      content,
      dateCreated: new Date().toISOString(),
      views: 0,
      likes: 0,
      comments: [],
    };

    const data = await fs.readFile(postsDataPath, "utf-8");
    const posts = JSON.parse(data);
    posts.unshift(newPost);
    await fs.writeFile(postsDataPath, JSON.stringify(posts, null, 2));
    res.status(201).send("Blog post created successfully");
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// PUT - Oppdater et blogginnlegg
router.put("/update-post/:id", ensureAdmin, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const { title, content } = req.body;

    const data = await fs.readFile(postsDataPath, "utf-8");
    const posts = JSON.parse(data);
    const post = posts.find((p) => p.id === postId);
    if (!post) return res.status(404).send("Post not found.");

    post.title = title;
    post.content = content;
    await fs.writeFile(postsDataPath, JSON.stringify(posts, null, 2));
    res.status(200).send("Blog post updated successfully");
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// DELETE - Slett et blogginnlegg/kommentar
router.delete("/delete-post/:id", ensureAdmin, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const data = await fs.readFile(postsDataPath, "utf-8");
    const posts = JSON.parse(data);
    const postIndex = posts.findIndex((p) => p.id === postId);
    if (postIndex === -1) return res.status(404).send("Post not found.");
    posts.splice(postIndex, 1);
    await fs.writeFile(postsDataPath, JSON.stringify(posts, null, 2));
    res.status(200).send("Blog post deleted successfully");
  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
