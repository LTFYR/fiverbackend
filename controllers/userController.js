import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import customError from "../utils/error.js";

export const deleteUser = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.id);

    if (req.userId !== user._id.toString()) {
      return next(
        customError(403, "You're not accessed to delete other accounts")
      );
    }
    await userModel.findByIdAndDelete(req.params.id);
    res.status(200).send("account deleted");
  } catch (error) {
    next(error);
  }
};

export const singleUser = async (req, res, next) => {
  const user = await userModel.findById(req.params.id);

  res.status(200).send(user);
};
