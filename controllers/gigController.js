import Gig from "../models/gigModel.js";
import customError from "../utils/error.js";

export const createGig = async (req, res, next) => {
  if (!req.isSeller)
    return next(
      customError(403, "Sorry, you are not seller. You can not create gigs")
    );

  const newgig = new Gig({
    userId: req.userId,
    ...req.body,
  });

  try {
    const updatedGig = await newgig.save();
    res.status(201).json(updatedGig);
  } catch (error) {
    next(error);
  }
};
export const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (gig.userId !== req.userId)
      return next(customError(403, "You can not delete other users gigs"));

    await Gig.findByIdAndDelete(req.params.id);
    res.status(200).send("Deleted");
  } catch (error) {
    next(error);
  }
};
export const singleGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return next(customError(404, "Gig could not found"));
    res.status(200).send(gig);
  } catch (error) {
    next(error);
  }
};
export const allGigs = async (req, res, next) => {
  const filterQuery = req.query;
  const filterGigs = {
    ...(filterQuery.userId && { userId: filterQuery.userId }),
    ...(filterQuery.category && { category: filterQuery.category }),
    ...((filterQuery.min || filterQuery.max) && {
      price: {
        ...(filterQuery.min && { $gt: filterQuery.min }),
        ...(filterQuery.max && { $lt: filterQuery.max }),
      },
    }),
    ...(filterQuery.search && {
      title: { $regex: filterQuery.search, $options: "i" },
    }),
  };
  try {
    const allGigs = await Gig.find(filterGigs).sort({ [filterQuery.sort]: -1 });
    res.status(200).send(allGigs);
  } catch (error) {
    next(error);
  }
};
