const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");

const postsDataPath = path.join(__dirname, "../Data/blogginnlegg.json");

async function readPosts() {
  const data = await fs.readFile(postsDataPath, "utf-8");
  return JSON.parse(data);
}

async function writePosts(posts) {
  await fs.writeFile(postsDataPath, JSON.stringify(posts, null, 2));
}

// ---------------------
// Blog Posts Routes
// ---------------------

// GET all Posts
router.get("/", async (req, res) => {
  try {
    const posts = await readPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Like
router.post("/like/:id", async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const posts = await readPosts();
    const post = posts.find((p) => p.id === postId);
    if (!post) {
      return res.status(404).json({ error: "Innlegg ikke funnet" });
    }
    post.likes = (post.likes || 0) + 1;
    await writePosts(posts);
    res.json({ likes: post.likes });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Comment
router.post("/comment/:id", async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const { name, time, content } = req.body;
    const comment = { name, time, content };

    const posts = await readPosts();
    const post = posts.find((p) => p.id === postId);
    if (!post) {
      return res.status(404).json({ error: "Innlegg ikke funnet" });
    }
    post.comments = post.comments || [];
    post.comments.push(comment);
    await writePosts(posts);
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
