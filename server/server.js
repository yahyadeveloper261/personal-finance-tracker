import "dotenv/config";
import dbConnection from "./src/config/db.js";
import express from "express";
import router from "./src/routes/authRoutes.js";
import notification from "./src/routes/notificationRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTED_URL,
    credentials: true,
  }),
);

app.use("/api", router);
app.use("/api/notifications", notification);

const startServer = async () => {
  try {
    await dbConnection();

    const PORT = process.env.PORT || 300;
    const HOST = process.env.HOST || "127.0.0.1";

    app.listen(PORT, () => {
      console.log(`http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.log("Server failed:", error.message);
  }
};

startServer();
