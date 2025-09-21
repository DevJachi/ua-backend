import express from "express";
import "dotenv/config";
import authRoutes from "./routes/auth.route.js";
import createCode from "./routes/createcode.route.js";
import examRoute from "./routes/exam.route.js";
import questionRoute from "./routes/question.route.js";
import totalPoints from "./routes/totalpoint.route.js";
import { connectDB } from "./db/connectDB.js";

const app = express();
const PORT = process.env.PORT || 3001;

//Endpoint Prefixes
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/createCode", createCode);
app.use("/api/exam", examRoute);
app.use("/api/question", questionRoute);
app.use("/api/points", totalPoints);

//Default Route
app.get("/", (req, res) => {
  res.send("Ugwu Academy Backend Route Is Live");
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is live on Port ${PORT}`);
});
