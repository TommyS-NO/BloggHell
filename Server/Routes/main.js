const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const postsDataPath = path.join(__dirname, "../data/blogginnlegg.json");

// GET - Hente alle blogginnlegg
router.get("/", (req, res) => {
  const posts = JSON.parse(fs.readFileSync(postsDataPath, "utf-8"));
  res.render("index", { posts: posts });
});

// GET - Vise et bestemt blogginnlegg basert på dets ID
router.get("/post/:id", (req, res) => {
  const posts = JSON.parse(fs.readFileSync(postsDataPath, "utf-8"));
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).send("Innlegget ble ikke funnet.");
  res.render("post", { post: post });
});

// Rute for å hente alle blogginnlegg som JSON
router.get("/api/posts", (req, res) => {
  const posts = JSON.parse(fs.readFileSync(postsDataPath, "utf-8"));
  res.json(posts);
});

module.exports = router;
