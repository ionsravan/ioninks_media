const { Router } = require("express");
const authenticate = require("./controllers/auth/authenticate");
const createNews = require("./controllers/news/createNews");
const deleteNews = require("./controllers/news/deleteNews");
const fetchNews = require("./controllers/news/fetchNews");
const authMiddleware = require("./middlewares/auth.md");
const adminAuthMiddleware = require("./middlewares/admin.auth.md");
const adminLogin = require("./controllers/adminAuth/login");
const adminRegister = require("./controllers/adminAuth/register");

const router = Router();

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
router.post("/news/createNews", adminAuthMiddleware, createNews);
router.post("/news/deleteNews", adminAuthMiddleware, deleteNews);

module.exports = router;
