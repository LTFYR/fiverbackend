import jwt from "jsonwebtoken";
import customError from "../utils/error.js";

export const verify = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token)
    return next(
      customError(
        401,
        "Sahib olduğunuz user rolu bu əməliyyatı icra edə bilmir"
      )
    );

  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) return next(customError(403, "Token is invalid"));
    req.userId = payload.id;
    req.isSeller = payload.isSeller;
    next();
  });
};
