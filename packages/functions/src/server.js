// import serverless from "serverless-http";

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { lucia, validateRequest } from "@/lib/lucia";
import serverless from "serverless-http";
import { NodePostgresAdapter } from "@lucia-auth/adapter-postgresql";
import client from "./server/db.js";
dotenv.config();
const app = express();
// const port = 8080;
// ROUTES
const items = require("./routes/items");
const nodemailer = require("./routes/nodeMailer");
const leaderboard = require("./routes/leaderboard");

export const createGoogleAuthorizationURL = async () => {
  try {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    cookies().set("codeVerifier", codeVerifier, {
      httpOnly: true,
    });

    cookies().set("state", state, {
      httpOnly: true,
    });

    const authorizationURL = await google.createAuthorizationURL(
      state,
      codeVerifier,
      {
        scopes: ["email", "profile"],
      }
    );

    return {
      success: true,
      data: authorizationURL,
    };
  } catch (error) {
    return {
      error: error?.message,
    };
  }
};

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

if (process.env.NODE_ENV === "development") {
  app.listen(3001, () => {
    console.log("Server is running on port 3001");
  });
}

export default serverless(app);
