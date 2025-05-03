import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authentication = (req, res, next) => {
  console.log("body:", req.body, "header:", req.headers.authorization);
  const header = req.headers.authorization;
  if (!header)
    return res.status(400).json({ error: "no access token is included!" });
  const accessToken = header.split(" ")[1];
  jwt.verify(accessToken, process.env.JWT_SECRET, (err, res) => {
    if (err) return res.status(403).json({ error: "invalid token!" });
    req.user = res;
    next();
  });
};
