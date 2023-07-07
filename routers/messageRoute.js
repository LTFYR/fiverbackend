import express from "express";
import {
  createMessage,
  allMessages,
} from "../controllers/messageController.js";
import { verify } from "../middleware/token.js";

const router = express.Router();

router.post("/", verify, createMessage);
router.get("/:id", verify, allMessages);

export default router;
