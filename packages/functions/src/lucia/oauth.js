import { Google } from "arctic";

const google = new Google(
  process.env.CLENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

export default google;
