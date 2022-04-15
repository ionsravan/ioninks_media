const { Schema, model } = require("mongoose");

const schema = new Schema({
  title: { type: String, required: true },
  news: { type: String, required: true },
  source: { type: String, required: true },
  likeCount: { type: Number, default: 0 },
  imageUrl: { type: String },
  timeStamp: { type: Date, default: Date.now },
  referenceUrl: { type: String },
  category: {
    type: String,
    required: true,
  },
});

module.exports = model("News", schema);
