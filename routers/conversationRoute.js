import express from "express";
import { verify } from "../middleware/token.js";
import {
  createConversation,
  conversation,
  conversations,
  updateConversation,
} from "../controllers/conversationController.js";

const router = express.Router();

router.get("/", verify, conversations);
router.post("/", verify, createConversation);
router.get("/conversation/:id", verify, conversation);
router.put("/:id", verify, updateConversation);

export default router;
