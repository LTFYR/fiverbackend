import express from "express";
import { deleteUser, singleUser } from "../controllers/userController.js";
import { verify } from "jsonwebtoken";

const router = express.Router();

router.delete("/:id", verify, deleteUser);
router.get("/:id", singleUser);

export default router;
