const newsModel = require("../../models/news.model");
const categoryModel = require("../../models/category.model");
const Error = require("../../utils/Error");
const { remove } = require("../../s3");

const { startSession } = require("mongoose");

const deleteNews = async (req, res, next) => {
  const session = await startSession();

  try {
    const { newsId } = req.body;

    if (!newsId) throw new Error("Please provide a newsId", 400);

    //starting transaction
    session.startTransaction();
    const newsArticle = await newsModel
      .findByIdAndDelete(newsId)
      .session(session)
      .select("category imageUrl")
      .exec();

    if (!newsArticle) throw new Error("The article does not exist", 404);

    if (newsArticle.imageUrl) {
      const tempArray = newsArticle.imageUrl.split("/");
      const s3Data = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${tempArray[3]}/${tempArray[4]}`,
      };
      await remove(s3Data);
    }

    const newsCategory = await categoryModel
      .findOne({ name: newsArticle.category })
      .exec();

    if (!newsCategory) throw new Error("The category does not exist", 404);

    newsCategory.newsList.pull(newsArticle);
    await newsCategory.save({ session });

    if (newsCategory.newsList.length <= 0) {
      await categoryModel.findByIdAndDelete(newsCategory._id).session(session);
    }

    await session.commitTransaction();
    //end transaction
    session.endSession();

    return res.json({ message: "News deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(error);
  }
};

module.exports = deleteNews;
