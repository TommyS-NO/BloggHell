const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");
const adminUsername = process.env.ADMIN_USERNAME;
const adminPassword = process.env.ADMIN_PASSWORD;

const postsDataPath = path.join(__dirname, "../Data/blogginnlegg.json");

async function ensureAuthenticated(req, res, next) {
  if (req.session.isAuthenticated) {
    return next();
  } else {
    res.redirect("/");
  }
}

router.get("/", ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../../views/admin.html"));
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
  console.log("Attempting to add a new post...");
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
router.put("/api/edit-post/:id", ensureAuthenticated, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const { title, content } = req.body;
    const posts = JSON.parse(await fs.readFile(postsDataPath, "utf-8"));
    const post = posts.find((p) => p.id === postId);
    if (!post) {
      return res.status(404).send("Innlegget ble ikke funnet.");
    }
    post.title = title;
    post.content = content;
    await fs.writeFile(postsDataPath, JSON.stringify(posts, null, 4));
    res.json(post);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

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
