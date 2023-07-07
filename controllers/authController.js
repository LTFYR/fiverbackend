import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import customError from "../utils/error.js";

export const register = async (req, res, next) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 5);
    const newuser = new User({
      ...req.body,
      password: hashedPassword,
    });
    await newuser.save();
    res.status(201).send("user created");
  } catch (err) {
    next(err);
  }
};
export const login = async (req, res, next) => {
  try {
    const exsistUser = await User.findOne({ username: req.body.username });

    if (!exsistUser) return next(customError(404, "User couldn't found"));

    const foundUser = bcrypt.compareSync(
      req.body.password,
      exsistUser.password
    );
    if (!foundUser) return next(customError(400, "Wrong password or username"));

    const token = jwt.sign(
      {
        id: exsistUser._id,
        isSeller: exsistUser.isSeller,
      },
      process.env.JWT_SECRET
    );

    const { password, ...info } = exsistUser._doc;
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .send(info);
  } catch (error) {
    next(error);
  }
};
export const logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .send("User logged out");
};
