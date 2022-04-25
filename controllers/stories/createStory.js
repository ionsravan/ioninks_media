const storyModel = require("../../models/stories.model");
const Error = require("../../utils/Error");
const util = require("../../utils/util");
const { startSession } = require("mongoose");
const { upload } = require("../../s3");
const uuid = require("uuid").v4;

const createStory = async (req, res, next) => {
  try {
    const file = req.files;
    if (!file) throw new Error("Please provide a file", 400);

    const mediaFiles = file?.mediaFiles;
    const thumbnail = file?.thumbnail;

    if (!thumbnail || !mediaFiles)
      throw new Error("Please provide required files", 400);

    if (thumbnail.length === 0 || thumbnail.length > 1)
      throw new Error("Thumbnail needs to have a single file", 403);

    // console.log(mediaFiles);
    // console.log(thumbnail);

    let thumbnailUrl = null;
    const mediaUrl = [];

    const storyFolderName = await uuid();
    //for thumbnail file...
    if (thumbnail) {
      const filesNameSplit = thumbnail[0].originalname.split(".");
      const fileName = filesNameSplit[0];
      const extension = filesNameSplit[filesNameSplit.length - 1];
      const s3Data = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `stories/${storyFolderName}/${fileName}_${uuid()}.${extension}`,
        Body: thumbnail[0].buffer,
      };

      const response = await upload(s3Data);
      thumbnailUrl = response?.Location;
    }
    //for media files
    if (mediaFiles) {
      for (let mediaFile of mediaFiles) {
        const filesNameSplit = mediaFile.originalname.split(".");
        const fileName = filesNameSplit[0];
        const extension = filesNameSplit[filesNameSplit.length - 1];
        const fileType = await util.fileType(extension);
        const s3Data = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `stories/${storyFolderName}/${fileName}_${uuid()}.${extension}`,
          Body: mediaFile.buffer,
        };

        const response = await upload(s3Data);
        mediaUrl.push({ url: response?.Location, type: fileType });
      }
    }

    const newStory = new storyModel({
      thumbnailUrl,
      mediaUrl,
    });
    await newStory.save();
    return res.json({ message: "success", result: newStory });
  } catch (error) {
    return next(error);
  }
};

module.exports = createStory;
