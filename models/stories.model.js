const { Schema, model } = require("mongoose");

const schema = new Schema({
  thumbnailUrl: {
    type: String,
    required: true,
  },
  mediaUrl: [
    {
      url: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ["Image", "Video", "Other"],
        required: true,
        default: "Image",
      },
    },
  ],
});

module.exports = model("Story", schema);
