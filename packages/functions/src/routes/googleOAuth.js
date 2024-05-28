import db from "../server/db.js";
import express from "express";
// import { oauthAccountTable, userTable } from "@/lib/database/schema";

// import { lucia } from "../lucia/index.js";
// import { google } from "../lucia/oauth.js";

// import { eq } from "drizzle-orm";
// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";
const googleOAuthRouter = express.Router();
import { createGoogleAuthorizationUrl } from "../server.js";

googleOAuthRouter.get("/", async (req, res) => {
  try {
    const response = await createGoogleAuthorizationUrl();
    const googleAuthorizationUrl = response.data.googleAuthorizationUrl;

    res.status(200).send({
      googleAuthorizationUrl: googleAuthorizationUrl,
      state: response.data.state,
      codeVerifier: response.data.codeVerifier,
    });
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

export default googleOAuthRouter;

// export const GET = async (req, res) => {
//   try {
//     const url = new URL(createGoogleAuthorizationURL());
//     console.log("Google Authorization URL: ", url);
//     return res.redirect(url, {
//       status: 302,
//     });
//     // const searchParams = url.searchParams;

//     // const code = searchParams.get("code");
//     // const state = searchParams.get("state");

//     // if (!code || !state) {
//     //   return Response.json(
//     //     { error: "Invalid request" },
//     //     {
//     //       status: 400,
//     //     }
//     //   );
//     // }

//     // const codeVerifier = cookies().get("codeVerifier")?.value;
//     // const savedState = cookies().get("state")?.value;

//     // console.log({ codeVerifier, savedState, state });

//     // if (!codeVerifier || !savedState) {
//     //   return Response.json(
//     //     { error: "Code verifier or saved state is not exists" },
//     //     {
//     //       status: 400,
//     //     }
//     //   );
//     // }

//     // if (savedState !== state) {
//     //   return Response.json(
//     //     {
//     //       error: "State does not match",
//     //     },
//     //     {
//     //       status: 400,
//     //     }
//     //   );
//     // }

//     // const { accessToken, idToken, accessTokenExpiresAt, refreshToken } =
//     //   await google.validateAuthorizationCode(code, codeVerifier);

//     // const googleRes = await fetch(
//     //   "https://www.googleapis.com/oauth2/v1/userinfo",
//     //   {
//     //     headers: {
//     //       Authorization: `Bearer ${accessToken}`,
//     //     },
//     //     method: "GET",
//     //   }
//     // );
//     // console.log({ accessToken, idToken, accessTokenExpiresAt, refreshToken });

//     // const googleData = await googleRes.json();

//     // console.log("google data", googleData);

//     // // await db.transaction(async (trx) => {
//     // //   const user = await trx.query.userTable.findFirst({
//     // //     where: eq(userTable.id, googleData.id),
//     // //   });
//     // //   console.debug("User", user);
//     // //   let session = null;
//     // //   if (!user) {
//     // //     console.log("Creating user", user);

//     // //     const createdUserRes = await trx
//     // //       .insert(userTable)
//     // //       .values({
//     // //         email: googleData.email,
//     // //         id: googleData.id,
//     // //         name: googleData.name,
//     // //         profilePictureUrl: googleData.picture,
//     // //       })
//     // //       .returning({
//     // //         id: userTable.id,
//     // //       });

//     // //     if (createdUserRes.length === 0) {
//     // //       trx.rollback();
//     // //       return Response.json(
//     // //         { error: "Failed to create user" },
//     // //         {
//     // //           status: 500,
//     // //         }
//     // //       );
//     // //     }

//     // //     const createdOAuthAccountRes = await trx
//     // //       .insert(oauthAccountTable)
//     // //       .values({
//     // //         accessToken,
//     // //         expiresAt: accessTokenExpiresAt,
//     // //         id: googleData.id,
//     // //         provider: "google",
//     // //         providerUserId: googleData.id,
//     // //         userId: googleData.id,
//     // //         refreshToken,
//     // //       });

//     // //     if (createdOAuthAccountRes.rowCount === 0) {
//     // //       trx.rollback();
//     // //       return Response.json(
//     // //         { error: "Failed to create OAuthAccountRes" },
//     // //         {
//     // //           status: 500,
//     // //         }
//     // //       );
//     // //     }
//     // //   } else {
//     // //     const updatedOAuthAccountRes = await trx
//     // //       .update(oauthAccountTable)
//     // //       .set({
//     // //         accessToken,
//     // //         expiresAt: accessTokenExpiresAt,
//     // //         refreshToken,
//     // //       })
//     // //       .where(eq(oauthAccountTable.id, googleData.id));

//     // //     if (updatedOAuthAccountRes.rowCount === 0) {
//     // //       trx.rollback();
//     // //       return Response.json(
//     // //         { error: "Failed to update OAuthAccountRes" },
//     // //         {
//     // //           status: 500,
//     // //         }
//     // //       );
//     // //     }
//     // //   }

//     // //   return res.redirect(
//     // //     new URL("/dashboard", process.env.PUBLIC_BASE_URL),
//     // //     {
//     // //       status: 302,
//     // //     }
//     // //   );
//     // // });

//     // const session = await lucia.createSession(googleData.id, {
//     //   expiresIn: 60 * 60 * 24 * 30,
//     // });
//     // const sessionCookie = lucia.createSessionCookie(session.id);

//     // cookies().set(
//     //   sessionCookie.name,
//     //   sessionCookie.value,
//     //   sessionCookie.attributes
//     // );

//     // cookies().set("state", "", {
//     //   expires: new Date(0),
//     // });
//     // cookies().set("codeVerifier", "", {
//     //   expires: new Date(0),
//     // });

//     // return res.redirect(new URL("/", process.env.PUBLIC_BASE_URL), {
//     //   status: 302,
//     // });
//     return res.redirect(new URL("/"), {
//       status: 302,
//     });
//   } catch (error) {
//     return Response.json(
//       { error: error.message },
//       {
//         status: 500,
//       }
//     );
//   }
// };
