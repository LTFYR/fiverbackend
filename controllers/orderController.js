import customError from "../utils/error.js";
import Order from "../models/orderModel.js";
import Gig from "../models/gigModel.js";
import Stripe from "stripe";

export const createPayment = async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPESECRET);

  const findGig = await Gig.findById(req.params.id);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: findGig.price * 100,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  const newOrder = new Order({
    gigId: findGig._id,
    image: findGig.coverImg,
    title: findGig.title,
    buyerId: req.userId,
    sellerId: findGig.userId,
    price: findGig.price,
    payment_intent: paymentIntent.id,
  });

  await newOrder.save();

  res.status(200).send({
    clientSecret: paymentIntent.client_secret,
  });
};

export const orders = async (req, res, next) => {
  try {
    const myOrders = await Order.find({
      ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
      isCompleted: true,
    });

    res.status(200).send(myOrders);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const orders = await Order.findOneAndUpdate(
      {
        payment_intent: req.body.payment_intent,
      },
      {
        $set: {
          isCompleted: true,
        },
      }
    );
    res.status(200).send("Order finished");
  } catch (error) {
    next(error);
  }
};
