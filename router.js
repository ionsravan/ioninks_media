const { Router } = require("express");
const multer = require("multer");
const authenticate = require("./controllers/auth/authenticate");
const createNews = require("./controllers/news/createNews");
const deleteNews = require("./controllers/news/deleteNews");
const fetchNews = require("./controllers/news/fetchNews");
const authMiddleware = require("./middlewares/auth.md");
const adminAuthMiddleware = require("./middlewares/admin.auth.md");
const adminLogin = require("./controllers/adminAuth/login");
const adminRegister = require("./controllers/adminAuth/register");
const fetchCategory = require("./controllers/categories/fetchCategories");
const { likeNews, dislikeNews } = require("./controllers/news/likeNews");

const router = Router();
const formData = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // keep images size < 10 MB
  },
});

//initial route
router.get("/", (req, res) => {
  res.send("welcome to Ioninks!");
});

//user auth routes
router.post("/authenticate", authenticate);

//admin auth routes
router.post("/admin/login", adminLogin);
router.post("/admin/register", adminRegister);
//news
router.get("/news", authMiddleware, fetchNews);
router.post("/news/likeNews", authMiddleware, likeNews);
router.post("/news/dislikeNews", authMiddleware, dislikeNews);

router.post(
  "/news/createNews",
  adminAuthMiddleware,
  formData.single("image"),
  createNews
);
router.post("/news/deleteNews", adminAuthMiddleware, deleteNews);

//categories routes
router.get("/category", authMiddleware, fetchCategory);

module.exports = router;
