// import serverless from "serverless-http";

import dotenv from "dotenv";
dotenv.config({ silent: process.env.NODE_ENV === "production" });
import express from "express";
import cors from "cors";

const app = express();
// const port = 8080;
import serverless from "serverless-http";
// ROUTES
import items from "./routes/items.js";
import nodemailer from "./routes/nodemailer.js";
import leaderboard from "./routes/leaderboard.js";
import upload from "./routes/upload.js";

app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", async (req, res) => {
  try {
    res.json("Hello");
  } catch (error) {
    console.error(error);
  }
});
app.use("/items", items);
app.use("/leaderboard", leaderboard);
app.use("/nodemailer", nodemailer);
app.use("/upload", upload);

export const handler = serverless(app);
