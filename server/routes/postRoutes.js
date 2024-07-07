const multer = require("multer");
const { Router } = require("express");
const {
  createPost,
  getPosts,
  getPost,
  getCategoryPosts,
  getUserPosts,
  editPost,
  deletePost,
} = require("../controllers/postControllers");
const authMiddleware = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = Router();

router.post(
  "/",
  upload.fields([{ name: "thumbnail", maxCount: 1 }]),
  authMiddleware,
  createPost
);
router.get("/", getPosts);
router.get("/:id", getPost);
router.get("/categories/:category", getCategoryPosts);
router.get("/users/:id", getUserPosts);
router.patch(
  "/:id",
  upload.fields([{ name: "thumbnail", maxCount: 1 }]),
  authMiddleware,
  editPost
);
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
