import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./routes/auth.route.js";
import businessRoute from "./routes/business.route.js";
import trendRoutes from "./routes/trend.route.js";
import trendNotifierRoutes from "./routes/trendNotifier.route.js";
import instagramRoutes from "./routes/instagram.route.js";
import tiktokRoutes from "./routes/tiktok.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/api/tiktok", tiktokRoutes);
app.use(express.json());
app.use("/auth", authRoute);
app.use("/business", businessRoute);
app.use("/trends", trendRoutes);
app.use("/api", trendNotifierRoutes);
app.use("/api/instagram", instagramRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
