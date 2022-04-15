const { Schema, model } = require("mongoose");

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  newsList: [
    {
      type: Schema.Types.ObjectId,
      ref: "News",
      required: true,
    },
  ],
});

module.exports = model("Category", schema);
