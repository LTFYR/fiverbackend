import customError from "../utils/error.js";
import Conversation from "../models/conversationModel.js";

export const createConversation = async (req, res, next) => {
  const newConversation = new Conversation({
    id: req.isSeller ? req.userId + req.body.to : req.body.to + req.userId,
    sellerId: req.isSeller ? req.userId : req.body.to,
    buyerId: req.isSeller ? req.body.to : req.userId,
    readBySeller: req.isSeller,
    readByBuyer: !req.isSeller,
  });
  try {
    const save = await newConversation.save();
    res.status(200).send(save);
  } catch (error) {
    next(error);
  }
};

export const updateConversation = async (req, res, next) => {
  try {
    const newConversation = await Conversation.findOneAndUpdate(
      {
        id: req.params.id,
      },
      {
        $set: {
          readBySeller: true,
          readByBuyer: true,
        },
      },
      { new: true }
    );

    res.status(200).send(newConversation);
  } catch (error) {
    next(error);
  }
};
export const conversation = async (req, res, next) => {
  try {
    const myConversation = await Conversation.findOne({
      id: req.params.id,
    });
    if (!myConversation) return next(customError(404, "No conversation"));

    res.status(200).send(myConversation);
  } catch (error) {
    next(error);
  }
};
export const conversations = async (req, res, next) => {
  try {
    const allConversations = await Conversation.find(
      req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }
    ).sort({ updatedAt: -1 });

    res.status(200).send(allConversations);
  } catch (error) {
    next(error);
  }
};
