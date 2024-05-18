import express from "express";
import sendEmail from "../utils.js";

const emailRouter = express();
emailRouter.use(express.json());

emailRouter.post("/", (req, res) => {
  sendEmail(req.body.userEmail)
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

export default emailRouter;
