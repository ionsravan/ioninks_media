const AWS = require("aws-sdk");
const Error = require("./utils/Error");

//upload file to s3
const upload = async (file) => {
  try {
    const accessKey = await process.env.AWS_ACCESS_KEY;
    const secretKey = await process.env.AWS_SECRET_KEY;

    const S3 = new AWS.S3({
      region: "ap-south-1",
      accessKeyId: `${accessKey}`,
      secretAccessKey: `${secretKey}`,
    });

    const response = await S3.upload(file).promise();
    return response;
  } catch (error) {
    throw new Error("Failed to upload file", 500);
  }
};

//delete file from s3Data
const remove = async (params) => {
  try {
    const accessKey = await process.env.AWS_ACCESS_KEY;
    const secretKey = await process.env.AWS_SECRET_KEY;

    const S3 = new AWS.S3({
      region: "ap-south-1",
      accessKeyId: `${accessKey}`,
      secretAccessKey: `${secretKey}`,
    });

    await S3.deleteObject(params).promise();
  } catch (error) {
    throw new Error("Failed to remove image", 500);
  }
};

//remove multiple files
const removeMultipleFiles = async (params) => {
  try {
    const accessKey = await process.env.AWS_ACCESS_KEY;
    const secretKey = await process.env.AWS_SECRET_KEY;
    const S3 = new AWS.S3({
      region: "ap-south-1",
      accessKeyId: `${accessKey}`,
      secretAccessKey: `${secretKey}`,
    });
    await S3.deleteObjects(params).promise();
  } catch (error) {
    throw new Error("Failed to remove files", 500);
  }
};

//return files in a folder that
const showFilesInFolder = async (params) => {
  try {
    const accessKey = await process.env.AWS_ACCESS_KEY;
    const secretKey = await process.env.AWS_SECRET_KEY;

    const S3 = new AWS.S3({
      region: "ap-south-1",
      accessKeyId: `${accessKey}`,
      secretAccessKey: `${secretKey}`,
    });
    const listedObjects = await S3.listObjectsV2(params).promise();
    if (listedObjects.Contents.length === 0) return;
    return listedObjects.Contents;
  } catch (error) {
    throw new Error("Failed to find files", 500);
  }
};

exports.upload = upload;
exports.remove = remove;
exports.showFilesInFolder = showFilesInFolder;
exports.removeMultipleFiles = removeMultipleFiles;
