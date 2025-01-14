import AWS from 'aws-sdk';

const SES_CONFIG = {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
    region: process.env.AWS_SES_REGION,
    };

const AWS_SES = new AWS.SES(SES_CONFIG);

const sendEmail = async (email, subject, message) => {
  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: message,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: email,
  };

  try {
    await AWS_SES.sendEmail(params).promise();
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.log("Error sending email", error);
  }
}

export default sendEmail;