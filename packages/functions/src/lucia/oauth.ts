import { Google } from "arctic";

const google = new Google(
  process.env.clientId,
  process.env.clientSecret,
  process.env.NEXT_PUBLIC_BASE_URL + "/api/oauth/google/callback"
);
