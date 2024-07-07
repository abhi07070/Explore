const multer = require("multer");
const { Router } = require("express");
const {
  registerUser,
  loginUser,
  getUser,
  changeAvatar,
  editUser,
  getAuthors,
} = require("../controllers/userControllers");
const authMiddleware = require("../middleware/authMiddleware");

// Multer configuration
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:id", getUser);
router.post(
  "/change-avatar",
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  authMiddleware,
  changeAvatar
);
router.patch("/edit-user", authMiddleware, editUser);
router.get("/", getAuthors);

module.exports = router;
