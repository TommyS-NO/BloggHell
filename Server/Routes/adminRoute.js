const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");

const postsDataPath = path.join(__dirname, "../Data/blogginnlegg.json");

// ---------------------
// Middleware Functions
// ---------------------

function ensureAdmin(req, res, next) {
  if (req.session.isAdmin) {
    next();
  } else {
    res.status(403).json({ error: "Access denied" });
  }
}

// ---------------------
// Admin Authentication Routes
// ---------------------

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Hardkodede admin-legitimasjonsopplysninger for enkelhetens skyld

  if (username === "admin" && password === "Gokstad2023") {
    req.session.isAdmin = true;
    res.status(200).json({ message: "Admin Logget Inn😊" });
  } else {
    res.status(401).json({ error: "Feil Brukernavn eller Passord 🫵" });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// ---------------------
// Post CRUD Routes
// ---------------------

router.get("/get-all-posts", async (req, res) => {
  try {
    const data = await fs.readFile(postsDataPath, "utf-8");
    const posts = JSON.parse(data);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/get-post/:id", async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const data = await fs.readFile(postsDataPath, "utf-8");
    const posts = JSON.parse(data);
    const post = posts.find((p) => p.id === postId);
    if (!post) return res.status(404).json({ error: "Innlegg ikke funnet💩" });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/create-post", ensureAdmin, async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = {
      id: Date.now(),
      title,
      content,
      dateCreated: new Date().toISOString(),
      lastEdited: null,
      views: 0,
      likes: 0,
      comments: [],
    };

    const data = await fs.readFile(postsDataPath, "utf-8");
    const posts = JSON.parse(data);
    posts.unshift(newPost);
    await fs.writeFile(postsDataPath, JSON.stringify(posts, null, 2));
    res.status(201).send("Nytt Blogginnlegg Opprettet 😃💵");
  } catch (error) {
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

router.put("/update-post/:id", ensureAdmin, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const { title, content } = req.body;

    const data = await fs.readFile(postsDataPath, "utf-8");
    const posts = JSON.parse(data);
    const post = posts.find((p) => p.id === postId);
    if (!post) return res.status(404).send("Ikke Funnet 😒");

    post.title = title;
    post.content = content;
    post.lastEdited = new Date().toISOString();
    await fs.writeFile(postsDataPath, JSON.stringify(posts, null, 2));
    res.status(200).json({ message: "Blogg Oppdatert 😊" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/delete-post/:id", ensureAdmin, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const data = await fs.readFile(postsDataPath, "utf-8");
    const posts = JSON.parse(data);
    const postIndex = posts.findIndex((p) => p.id === postId);
    if (postIndex === -1) return res.status(404).send("Ikke funnet😒");
    posts.splice(postIndex, 1);
    await fs.writeFile(postsDataPath, JSON.stringify(posts, null, 2));
    res.status(200).json({ message: "Blogg innlegg Slettet 🤷‍♂️" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------------
// Comment CRUD Routes
// ---------------------

router.delete("/delete-comment/:id", async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const commentTime = req.query.time;

    const data = await fs.readFile(postsDataPath, "utf-8");
    const posts = JSON.parse(data);
    const post = posts.find((p) => p.id === postId);
    if (!post) return res.status(404).send("Innlegget ble ikke funnet 😒");

    const commentIndex = post.comments.findIndex(
      (comment) => comment.time === commentTime
    );
    if (commentIndex !== -1) {
      post.comments.splice(commentIndex, 1);
      await fs.writeFile(postsDataPath, JSON.stringify(posts, null, 2));
      res.json({ success: true });
    } else {
      res.status(404).send("Kommentar ikke funnet 😒");
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
