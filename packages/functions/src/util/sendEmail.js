import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (email, subject, message) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      html: message,
    });

    if (error) {
      console.log("Error sending email", error);
      return;
    }

    console.log(`Email sent to ${email}`, { data });
  } catch (error) {
    console.log("Error sending email", error);
  }
};

export default sendEmail;
