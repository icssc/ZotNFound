import { NodePostgresAdapter } from "@lucia-auth/adapter-postgresql";
import client from "../server/db.js";

export const adapter = new NodePostgresAdapter(client, {
  user: "tyleryu",
  session: "session",
});
