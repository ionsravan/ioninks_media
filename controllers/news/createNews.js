const newsModel = require("../../models/news.model");
const categoryModel = require("../../models/category.model");
const Error = require("../../utils/Error");
const { startSession } = require("mongoose");
const { upload } = require("../../s3");
const uuid = require("uuid").v4;

const createNews = async (req, res, next) => {
  const session = await startSession();
  try {
    const { title, news, source, referenceUrl, category } = req.body;
    let imageUrl = null;

    if (!title || !news || !source || !category)
      throw new Error("Required fields missing", 400);

    if (req.file) {
      const filesNameSplit = req.file.originalname.split(".");
      const fileName = filesNameSplit[0];
      const extension = filesNameSplit[filesNameSplit.length - 1];

      const s3Data = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `news/${fileName}_${uuid()}.${extension}`,
        Body: req.file.buffer,
      };

      const response = await upload(s3Data);
      imageUrl = response?.Location;
    }

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
