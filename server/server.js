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
    origin: [
      "http://localhost:5173",
      process.env.FRONTED_URL,
    ],
    credentials: true,
  })
);

app.use("/api", router);
app.use("/api/notifications", notification);

const startServer = async () => {
  try {
    await dbConnection();
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

  } catch (error) {
    console.log("Server failed:", error.message);
  }
};

startServer();
