const storyModel = require("../../models/stories.model");
const Error = require("../../utils/Error");
const { showFilesInFolder, removeMultipleFiles } = require("../../s3");

const deleteStory = async (req, res, next) => {
  try {
    const storyId = req.body.storyId;
    if (!storyId) throw new Error("Please provide an id", 400);

    const requiredStory = await storyModel
      .findByIdAndDelete(storyId)
      .select("thumbnailUrl")
      .exec();

    if (!requiredStory) throw new Error("The story does not exist", 404);

    if (requiredStory.thumbnailUrl) {
      const tempArray = requiredStory.thumbnailUrl.split("/");
      //   console.log(tempArray[3] + "/" + tempArray[4]);

      const listParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Prefix: `${tempArray[3]}/${tempArray[4]}`,
      };

      const listedObjects = await showFilesInFolder(listParams);

      if (listedObjects) {
        const deleteParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Delete: { Objects: [] },
        };
        listedObjects.forEach(({ Key }) => {
          deleteParams.Delete.Objects.push({ Key });
        });

        await removeMultipleFiles(deleteParams);
      }
    }

    return res.json({ message: "Story deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

module.exports = deleteStory;
