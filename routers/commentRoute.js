import express from "express";
import {
  createComment,
  getComments,
  deleteComment,
} from "../controllers/commentController.js";
import { verify } from "../middleware/token.js";

const router = express.Router();

router.post("/", verify, createComment);
router.get("/:id", getComments);
router.delete("/:id", deleteComment);

export default router;
