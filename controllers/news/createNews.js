const newsModel = require("../../models/news.model");
const categoryModel = require("../../models/category.model");
const Error = require("../../utils/Error");
const { startSession } = require("mongoose");

const createNews = async (req, res, next) => {
  const session = await startSession();
  try {
    const { title, news, source, imageUrl, referenceUrl, category } = req.body;

    if (!title || !news || !source || !category)
      throw new Error("Required fields missing", 400);

    const exestingCategory = await categoryModel.findOne({
      name: category.toLowerCase(),
    });
    //starting transaction
    session.startTransaction();
    const newsArticle = new newsModel({
      title,
      news,
      source,
      imageUrl,
      referenceUrl,
      category: category.toLowerCase(),
    });

    await newsArticle.save({ session });

    if (!exestingCategory) {
      const newCategory = await categoryModel({
        name: category.toLowerCase(),
        newsList: [],
      });
      newCategory.newsList.push(newsArticle);
      await newCategory.save({ session });
    } else {
      exestingCategory.newsList.push(newsArticle);
      await exestingCategory.save({ session });
    }
    await session.commitTransaction();
    //end transaction
    session.endSession();
    return res.json({ message: "Success", result: newsArticle });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(error);
  }
};

module.exports = createNews;
