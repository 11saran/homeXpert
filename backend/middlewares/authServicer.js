import jwt from "jsonwebtoken";
import servicerModel from "../models/servicerModel.js";

const authServicer = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "Token Required" });
    }

    const token_string = token.split(" ")[1];

    const decoded = jwt.verify(token_string, process.env.JWT_SECRET);

    const servicer = await servicerModel.findById(decoded.id);

    if (!servicer) {
      return res.status(400).json({ success: false, message: "Invalid Token" });
    }

    if (servicer.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Servicer account not approved",
      });
    }

    req.user = {
      id: servicer._id,
      role: "servicer",
    };

    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "Invalid Token" });
  }
};

export default authServicer;
