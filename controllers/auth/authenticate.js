const userModel = require("../../models/user.model");
const jwt = require("jsonwebtoken");
const Error = require("../../utils/Error");

const authenticate = async (req, res, next) => {
  try {
    const { fullName, email, authId } = req.body;

    if (!fullName || !email || !authId)
      throw new Error("Required parameters missing", 400);

    const exestingUser = await userModel.exists({ authId: authId });

    if (exestingUser) {
      const token = jwt.sign(
        {
          id: exestingUser._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
      return res.status(200).json({
        message: "Authentication successful",
        token,
      });
    } else {
      const user = new userModel({
        fullName: fullName,
        email: email,
        authId: authId,
      });
      await user.save();
      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      res.status(200).json({
        message: "Authentication successful",
        token,
      });
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = authenticate;
