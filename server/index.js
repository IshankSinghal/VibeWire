import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/Authroutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8747;
const databaseURL = process.env.DATABASE_URL;

//MIDDLEWARES-
app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use("/uploads/profiles",express.static("/uploads/profiles"))

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);

const server = app.listen(port, () => {
  console.log(`Server Started at http://localhost:${port}`);
});

mongoose
  .connect(databaseURL)
  .then(() => console.log("DB Connection Succesfull."))
  .catch((err) => console.log(err.message));
