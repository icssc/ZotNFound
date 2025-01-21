import express from "express";
import sendEmail from "../util/sendEmail";


const emailRouter = express.Router();

emailRouter.get("/", async (req, res) => {
  sendEmail("zotnfound@gmail.com", "test email", "email test");
  res.json("email sent");
});

export default emailRouter;
