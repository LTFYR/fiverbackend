import express from "express";
import {
  orders,
  createPayment,
  updateStatus,
} from "../controllers/orderController.js";
import { verify } from "../middleware/token.js";

const router = express.Router();

router.post("/create-payment-intent/:id", verify, createPayment);
router.get("/", verify, orders);
router.put("/", verify, updateStatus);

export default router;
