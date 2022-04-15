const adminModel = require("../../models/admin.model");
const jwt = require("jsonwebtoken");
const Error = require("../../utils/Error");
const bcrypt = require("bcrypt");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      throw new Error("Required parameters missing", 400);

    const exestingUser = await adminModel.findOne({ email: email });
    if (!exestingUser) throw new Error("Email not registered", 400);

    if (await bcrypt.compare(password, exestingUser.password)) {
      const token = jwt.sign(
        {
          id: exestingUser._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      return res.json({
        message: "Successfully logged in.",
        token,
      });
    } else {
      throw new Error("Invalid credentails", 400);
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = login;
