const express = require("express");
const router = express.Router();

// Dummy data for testing
const posts = [
  {
    id: 1,
    title: "Første innlegg",
    content: "Dette er innholdet i det første innlegget.",
    date: new Date(),
  },
  {
    id: 2,
    title: "Andre innlegg",
    content: "Dette er innholdet i det andre innlegget.",
    date: new Date(),
  },
];

// GET - Hente alle blogginnlegg
router.get("/", (req, res) => {
  res.render("index", { posts: posts });
});

// GET - Vise et bestemt blogginnlegg basert på dets ID
router.get("/post/:id", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).send("Innlegget ble ikke funnet.");
  res.render("post", { post: post });
});
module.exports = router;
