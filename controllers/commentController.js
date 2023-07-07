import customError from "../utils/error.js";
import Comments from "../models/commentsModel.js";
import Gig from "../models/gigModel.js";

export const createComment = async (req, res, next) => {
  if (req.isSeller)
    return next(customError(403, "Seller accounts can't comment"));

  const newComment = new Comments({
    userId: req.userId,
    gigId: req.body.gigId,
    desc: req.body.desc,
    stars: req.body.stars,
  });
  try {
    const comment = await Comments.findOne({
      gigId: req.body.gigId,
      userId: req.userId,
    });
    if (comment)
      return next(customError(403, "You already commented to that gig"));
    const saveNewComment = await newComment.save();

    await Gig.findByIdAndUpdate(req.body.gigId, {
      $inc: {
        totalRating: req.body.stars,
        startNum: 1,
      },
    });
    res.status(200).send(saveNewComment);
  } catch (error) {
    next(error);
  }
};
export const getComments = async (req, res, next) => {
  try {
    const comments = await Comments.find({ gigId: req.params.id });
    res.status(201).send(comments);
  } catch (error) {
    next(error);
  }
};
export const deleteComment = (req, res) => {};
