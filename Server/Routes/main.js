const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const postsDataPath = path.join(__dirname, "../data/blogginnlegg.json");

// GET - Hente alle blogginnlegg
router.get("/api/posts", (req, res) => {
  const posts = JSON.parse(fs.readFileSync(postsDataPath, "utf-8"));
  res.json(posts);
});

// POST - "Like" et innlegg
router.post("/api/like/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const posts = JSON.parse(fs.readFileSync(postsDataPath, "utf-8"));
  const post = posts.find((p) => p.id === postId);
  if (!post) return res.status(404).send("Innlegget ble ikke funnet.");
  post.likes += 1;
  fs.writeFileSync(postsDataPath, JSON.stringify(posts, null, 2));
  res.json({ likes: post.likes });
});

// POST - Legge til en kommentar
router.post("/api/comment/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const comment = req.body.comment;
  const posts = JSON.parse(fs.readFileSync(postsDataPath, "utf-8"));
  const post = posts.find((p) => p.id === postId);
  if (!post) return res.status(404).send("Innlegget ble ikke funnet.");
  post.comments.push(comment);
  fs.writeFileSync(postsDataPath, JSON.stringify(posts, null, 2));
  res.json({ comment: comment });
});

// GET - Hovedsiden
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../views/index.html"));
});

module.exports = router;
