const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");

const postsDataPath = path.join(__dirname, "../data/blogginnlegg.json");

// GET - Hente alle blogginnlegg
router.get("/api/posts", async (req, res) => {
  try {
    const data = await fs.readFile(postsDataPath, "utf-8");
    const posts = JSON.parse(data);
    res.json(posts);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// POST - "Like" et innlegg
router.post("/api/like/:id", async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const data = await fs.readFile(postsDataPath, "utf-8");
    const posts = JSON.parse(data);
    const post = posts.find((p) => p.id === postId);
    if (!post) return res.status(404).send("Innlegget ble ikke funnet.");
    post.likes += 1;
    await fs.writeFile(postsDataPath, JSON.stringify(posts, null, 2));
    res.json({ likes: post.likes });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// POST - Legge til en kommentar
router.post("/api/comment/:id", async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const comment = req.body.comment;
    const data = await fs.readFile(postsDataPath, "utf-8");
    const posts = JSON.parse(data);
    const post = posts.find((p) => p.id === postId);
    if (!post) return res.status(404).send("Innlegget ble ikke funnet.");
    post.comments.push(comment);
    await fs.writeFile(postsDataPath, JSON.stringify(posts, null, 2));
    res.json({ comment: comment });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// GET - Hovedsiden
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../views/index.html"));
});

module.exports = router;
