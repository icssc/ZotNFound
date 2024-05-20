import { Lucia } from "lucia";
import { adapter } from "./adapter";
// import { cookies } from "cookie-parser";
import { cache } from "react";

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
});

export const validateRequest = cache(async () => {
  //   const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  console.log("req cookies: ", req.cookies);
  const sessionId = req.cookies[lucia.sessionCookieName] ?? null;

  if (!sessionId)
    return {
      user: null,
      session: null,
    };

  const { user, session } = await lucia.validateSession(sessionId);
  try {
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      setCookie(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      setCookie(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch {}
  return {
    user,
    session,
  };
});
