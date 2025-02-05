import jwt from "jsonwebtoken"
import User from "../models/user.js"


export const authCheck = async(req, res, next) => {
const authHeader = req.headers.authorization;

if(!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Invalid token or No token provided"});
}
 const token = authHeader.split(" ")[1];

 //verify the token
 try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    return res
    .status(401)
    .json({ success: false, message: "Token is invalid"});
  }
};

export const globalMiddleware = (req, res, next) => {
  // return res.json({message: "General middleware activated"})
  console.log("Global middleware activated");
  next();
};
