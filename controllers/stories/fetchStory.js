const storyModel = require("../../models/stories.model");
const Error = require("../../utils/Error");

const fetchStory = async (req, res, next) => {
  try {
    const storyId = req.query.storyId;

    if (storyId) {
      const story = await storyModel.findById(storyId);
      if (!story) throw new Error("Story with this id does not exist", 404);
      return res.json({ message: "Success", result: story });
    }

    const storyList = await storyModel.find({});

    return res.json({ message: "Success", result: storyList });
  } catch (error) {
    return next(error);
  }
};

module.exports = fetchStory;
