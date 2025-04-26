// const express = require("express");
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import userRoutes from "./routes/user.routes.js";
import promptroutes from "./routes/prompt.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();
const app = express();
const port = process.env.PORT || 4001;

const MONGO_URL = process.env.MONGO_URI;

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoD connection error:", err));

app.get("/", (req, res) => {
  res.send("Hello knlnWorld!");
});

// routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/deepseekai", promptroutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
// QTg5UE2B6d1kBoXq
