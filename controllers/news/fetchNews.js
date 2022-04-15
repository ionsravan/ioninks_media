const newsModel = require("../../models/news.model");
const Error = require("../../utils/Error");

const fetchNews = async (req, res, next) => {
  try {
    const newsId = req.query.newsId;
    const category = req.query.category;

    if (newsId) {
      //get news of particular _id
      const news = await newsModel.findById(newsId);
      if (!news) throw new Error("News with this id does not exist", 404);
      return res.json({ message: "Success", result: news });
    } else if (category) {
      //get all news with particular category
      const allNews = await newsModel.find({ category: category }).exec();

      if (!allNews) throw new Error("An error occured in finding content", 404);
      return res.json({ message: "Success", result: allNews });
    }

    const news = await newsModel.find({});

    return res.json({ message: "Success", result: news });
  } catch (error) {
    return next(error);
  }
};

module.exports = fetchNews;
