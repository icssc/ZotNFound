import admin from "../config/firebase-config.js";
class Middleware {
  async decodeToken(req, res, next) {
    let token;
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token || token == "Bearer")
      return res.json({ message: "Firebase ID string not set as JWT yet" });

    try {
      const decodeValue = await admin.auth().verifyIdToken(token);
      if (decodeValue) {
        return next();
      }
      return res.json({ message: "sussy baka hehe" });
    } catch (e) {
      console.log(e);
      return res.json({ message: "internal error" });
    }
  }
}

export default new Middleware();
