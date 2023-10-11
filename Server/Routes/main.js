const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");

const postsDataPath = path.join(__dirname, "../Data/blogginnlegg.json");

// GET - Hente alle blogginnlegg
router.get("/posts", async (req, res) => {
  try {
    const data = await fs.readFile(postsDataPath, "utf-8");
    const posts = JSON.parse(data);

    posts.forEach((post) => {
      if (!post.comments) post.comments = [];
      if (post.date && !post.dateCreated) {
        post.dateCreated = post.date;
        delete post.date;
      }
    });
    await fs.writeFile(postsDataPath, JSON.stringify(posts, null, 2));
    res.json(posts);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.post("/like/:id", async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const data = await fs.readFile(postsDataPath, "utf-8");
    const posts = JSON.parse(data);
    const post = posts.find((p) => p.id === postId);
    if (!post) return res.status(404).send("Innlegget ble ikke funnet.");
    post.likes = Number(post.likes) + 1;
    await fs.writeFile(postsDataPath, JSON.stringify(posts, null, 2));
    res.json({ likes: post.likes });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// POST - Legge til en kommentar
router.post("/comment/:id", async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const { name, time, content } = req.body;
    const comment = { name, time, content };

    const data = await fs.readFile(postsDataPath, "utf-8");
    const posts = JSON.parse(data);
    const post = posts.find((p) => p.id === postId);
    if (!post) return res.status(404).send("Innlegget ble ikke funnet.");
    post.comments.push(comment);
    await fs.writeFile(postsDataPath, JSON.stringify(posts, null, 2));
    res.json({
      name: comment.name,
      time: comment.time,
      content: comment.content,
    });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// GET - Hovedsiden
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../Views/index.html"));
});
module.exports = router;
