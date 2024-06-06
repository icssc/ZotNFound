import { Google } from "arctic";

const google = new Google(
  process.env.VITE_CLIENT_ID,
  process.env.VITE_CLIENT_SECRET,
  process.env.REDIRECT_URI_OAUTH,
  {
    accessType: "offline",
  }
);

export default google;
