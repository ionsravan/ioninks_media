const mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.r7j6u.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ssl: true,
      }
    );
    console.log("db connected");
  } catch (error) {
    console.log("db not connected " + error);
  }
};
