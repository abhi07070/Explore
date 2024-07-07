const { Router } = require("express");
const {
  createrPost,
  getPosts,
  getPost,
  getCategoryPosts,
  getUserPosts,
  editPost,
  deletePost,
} = require("../controllers/postControllers");
const authMiddleware = require("../middleware/authMiddleware");

const router = Router();

router.post("/", authMiddleware, createrPost);
router.get("/", getPosts);
router.get("/:id", getPost);
router.get("/categories/:category", getCategoryPosts);
router.get("/users/:id", authMiddleware, getUserPosts);
router.patch("/:id", authMiddleware, editPost);
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
