import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import { generateCodeVerifier, generateState } from "arctic";
dotenv.config();
const app = express();
// const port = 8080;
// ROUTES
import cookieParser from "cookie-parser";
import items from "./routes/items.js";
import nodemailer from "./routes/nodeMailer.js";
import leaderboard from "./routes/leaderboard.js";
import googleOAuth from "./routes/googleOAuth.js";
// import oauth2CallbackRouter from "./routes/oauth2Callback.js";
import google from "./lucia/oauth.js";

app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );
  next();
});
app.use(cookieParser());

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
app.use("/googleOAuth", googleOAuth);

if (process.env.NODE_ENV === "development") {
  app.listen(3001, () => {
    console.log("Server is running on port 3001");
  });
}

export const createGoogleAuthorizationUrl = async () => {
  try {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    const googleAuthorizationUrl = await google.createAuthorizationURL(
      state,
      codeVerifier,
      {
        scopes: ["email", "profile"],
      }
    );

    return {
      success: true,
      data: {
        state: state,
        codeVerifier: codeVerifier,
        googleAuthorizationUrl: googleAuthorizationUrl,
      },
    };
  } catch (error) {
    return {
      error: error?.message,
    };
  }
};

export default serverless(app);
