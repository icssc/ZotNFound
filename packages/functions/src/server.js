// import serverless from "serverless-http";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
// const port = 8080;
const serverless = require("serverless-http");
// ROUTES
const items = require("./routes/items");
const nodemailer = require("./routes/nodeMailer");
const leaderboard = require("./routes/leaderboard");
// const upload = require("./routes/upload");
//
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
// app.use("/upload", upload);
//
module.exports = serverless(app);
