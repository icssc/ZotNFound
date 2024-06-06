import db from "../server/db.js";
import express from "express";
// import { oauthAccountTable, userTable } from "@/lib/database/schema";

import { lucia } from "../lucia/index.js";
import google from "../lucia/oauth.js";

// import { eq } from "drizzle-orm";
// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";
const googleOAuthRouter = express.Router();
import { createGoogleAuthorizationUrl } from "../server.js";

googleOAuthRouter.get("/", async (req, res) => {
  try {
    const response = await createGoogleAuthorizationUrl();
    const googleAuthorizationUrl = response.data.googleAuthorizationUrl;
    const state = response.data.state;
    const codeVerifier = response.data.codeVerifier;

    res.status(200).send({
      googleAuthorizationUrl: googleAuthorizationUrl,
      state: state,
      codeVerifier: codeVerifier,
    });
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

googleOAuthRouter.get("/validate", async (req, res) => {
  try {
    const { code, codeVerifier, authuser } = req.query;

    if (!code || !codeVerifier || !authuser) {
      return res.status(400).send("Missing required parameters");
    }

    console.log(
      "code",
      code,
      "codeVerifier",
      codeVerifier,
      "authuser",
      authuser
    );

    const { accessToken, idToken, accessTokenExpiresAt, refreshToken } =
      await google.validateAuthorizationCode(codeVerifier);
    console.log(accessToken, idToken, accessTokenExpiresAt, refreshToken);

    const res = await fetch("https://www.googleapis.com/oauth2/v1/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: "GET",
    });

    const session = await lucia.createSession(authuser, {
      expiresIn: 60 * 60 * 24 * 30,
    });
    const sessionCookie = lucia.createSessionCookie(session.id);

    res.status(200).json({
      session: session,
      sessionCookie: sessionCookie,
      redirectUrl: process.env.PUBLIC_BASE_URL,
    });
  } catch (error) {
    console.error("Error validating authorization code:", error);
    res.status(500).send("Server Error");
  }
});

export default googleOAuthRouter;
