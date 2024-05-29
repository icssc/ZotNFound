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

    // const session = await lucia.createSession(userId, {});

    // try {
    //   const tokens = await google.validateAuthorizationCode(
    //     codeVerifier,
    //     codeVerifier
    //   );
    //   console.log(tokens);
    // } catch (error) {
    //   console.log(error);
    // }

    // console.log(tokens.accessToken, tokens.idToken, tokens.accessTokenExpiresAt, tokens.refreshToken });

    // const googleRes = await fetch(
    //   "https://www.googleapis.com/oauth2/v1/userinfo",
    //   {
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //     method: "GET",
    //   }
    // );

    // const googleResJson = await googleRes.json();

    // console.log(googleResJson);

    res.status(200).send({
      googleAuthorizationUrl: googleAuthorizationUrl,
      state: state,
      codeVerifier: codeVerifier,
    });
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

export default googleOAuthRouter;
