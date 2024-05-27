import createTransporter from "./transporter.js";

const sendEmail = async (recipientEmail, subject, content) => {
  let emailTransporter = await createTransporter();
  emailTransporter.sendMail({
    from: process.env.EMAIL,
    to: recipientEmail,
    subject: subject,
    html: content,
    text: "A new item just posted on ZotnFound!",
  });
};

export default sendEmail;
