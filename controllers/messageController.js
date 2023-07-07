import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";
import customError from "../utils/error.js";

export const createMessage = async (req, res, next) => {
  const message = new Message({
    conversartionId: req.body.conversartionId,
    userId: req.userId,
    text: req.body.text,
  });

  try {
    const sendMessage = await message.save();
    await Conversation.findOneAndUpdate(
      {
        id: req.body.conversartionId,
      },
      {
        $set: {
          readBySeller: req.isSeller,
          readByBuyer: !req.isSeller,
          exsistMessage: req.body.text,
        },
      },
      { new: true }
    );
    res.status(201).send(sendMessage);
  } catch (error) {
    next(error);
  }
};

export const allMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({
      conversartionId: req.params.id,
    });

    res.status(200).send(messages);
  } catch (error) {
    next(error);
  }
};
