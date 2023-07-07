import express from "express";
import { verify } from "../middleware/token.js";
import {
  allGigs,
  createGig,
  deleteGig,
  singleGig,
} from "../controllers/gigController.js";

const router = express.Router();

router.post("/", verify, createGig);
// router.patch("/:id", verify, updateGig);
router.delete("/:id", verify, deleteGig);
router.get("/gig/:id", singleGig);
router.get("/", allGigs);

export default router;
