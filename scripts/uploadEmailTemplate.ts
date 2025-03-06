import * as AWS from "aws-sdk";
import * as fs from "fs";
import * as path from "path";
import { Config } from "sst/node/config";

const s3 = new AWS.S3();
const bucketName = Config.EMAIL_BUCKET_NAME; // Fetch from SST env

async function uploadTemplate() {
  const filePath = path.join(
    __dirname,
    "../packages/functions/src/emailTemplate/index.html"
  );

  if (!fs.existsSync(filePath)) {
    console.error("File not found:", filePath);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(filePath);

  try {
    await s3
      .putObject({
        Bucket: bucketName,
        Key: "emailTemplate/index.html",
        Body: fileContent,
        ContentType: "text/html",
      })
      .promise();

    console.log(
      `File uploaded successfully to s3://${bucketName}/emailTemplate/index.html`
    );
  } catch (err) {
    console.error("Upload failed:", err);
  }
}

uploadTemplate();
