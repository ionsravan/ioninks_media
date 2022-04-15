const adminModel = require("../../models/admin.model");
const jwt = require("jsonwebtoken");
const Error = require("../../utils/Error");
const bcrypt = require("bcrypt");

const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password)
      throw new Error("Required parameters missing", 400);

    const exestingUser = await adminModel.exists({ email: email });
    if (exestingUser) throw new Error("This email is already registered", 400);

    const hashPass = await bcrypt.hash(password, 10);

    const newAdmin = new adminModel({
      fullName,
      email,
      password: hashPass,
    });
    await newAdmin.save();

    const token = jwt.sign(
      {
        id: newAdmin._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    return res.status(200).json({
      message: "Registration successful",
      token,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = register;
