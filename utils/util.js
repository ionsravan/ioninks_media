const IMAGE_FORMAT = ["jpg", "jpeg", "png", "svg"];
const VIDEO_FORMAT = ["mp4", "gif", "mpg", "mov", "wmv", "avi"];

const fileType = (fileExtension) => {
  if (IMAGE_FORMAT.includes(fileExtension)) return "Image";
  else if (VIDEO_FORMAT.includes(fileExtension)) return "Video";
  else return "Other";
};

module.exports.fileType = fileType;
