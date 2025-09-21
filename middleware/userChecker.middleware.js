import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const useCheckerMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.json({ success: false, msg: "No Token Provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user || !req.user.isVerified === true) {
      res.json({
        success: false,
        msg: "User Does Not Exist Or I'snt Verified",
      });
    }
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Some Suss Stuff be happening here right now",
    });
  }
};
