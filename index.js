const express = require("express");
const cors = require("cors");
const db = require("./db");
const router = require("./router");
const Error = require("./utils/Error");

require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 8080;

app.use(cors({ origin: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", router);

app.use((req, res, next) => {
  const error = new Error("Could not find the route ", 404);
  return next(error);
});

//error handling..........
app.use((error, req, res, next) => {
  res
    .status(error.code || "500")
    .json({ message: error.message, status: error.code });
});

app.listen(PORT, async () => {
  console.log(`server up on port ${PORT}`);
  await db();
});
