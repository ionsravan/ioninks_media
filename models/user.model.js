const { Schema, model } = require("mongoose");

const schema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  authId: {
    type: String,
    unique: true,
    require: true,
  },
});

module.exports = model("User", schema);
