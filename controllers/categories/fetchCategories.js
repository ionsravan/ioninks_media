const categoryModel = require("../../models/category.model");
const Error = require("../../utils/Error");

const fetchCategory = async (req, res, next) => {
  try {
    const categoryId = req.query.categoryId;

    if (categoryId) {
      //get category of particular _id
      const category = await categoryModel.findById(categoryId);
      if (!category)
        throw new Error("Category with this id does not exist", 404);
      return res.json({ message: "Success", result: category });
    }

    const categories = await categoryModel.find({});

    return res.json({ message: "Success", result: categories });
  } catch (error) {
    return next(error);
  }
};

module.exports = fetchCategory;
