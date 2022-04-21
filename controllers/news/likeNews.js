const newsModel = require("../../models/news.model");
const categoryModel = require("../../models/category.model");
const Error = require("../../utils/Error");

const likeNews = async (req, res, next) => {
  try {
    const newsId = req.body.newsId;

    if (!newsId) throw new Error("Provide a news Id", 400);

    const news = await newsModel.findById(newsId);

    if (!news) throw new Error("The news does not exist", 404);

    news.likeCount = news.likeCount + 1;
    await news.save();
    return res.json({ message: "Success", result: news });
  } catch (error) {
    return next(error);
  }
};

const dislikeNews = async (req, res, next) => {
  try {
    const newsId = req.body.newsId;

    if (!newsId) throw new Error("Provide a news Id", 400);

    const news = await newsModel.findById(newsId);

    if (!news) throw new Error("The news does not exist", 404);

    if (news.likeCount > 0) news.likeCount = news.likeCount - 1;
    await news.save();
    return res.json({ message: "Success", result: news });
  } catch (error) {
    return next(error);
  }
};

module.exports = { likeNews, dislikeNews };
