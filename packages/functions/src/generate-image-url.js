import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });

export const handler = async (event) => {
  console.log("Entered event handler!")

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid request body" }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  const { name, contentType } = body;

  if (!name || !contentType) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing 'name' or 'contentType' in request body" }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
  console.log("BUCKET NAME", process.env.AWS_S3_BUCKET); // check if bucket name exists rq

  const key = `uploads/${randomUUID()}-${Date.now()}.${contentType.split('/')[1]}`;
  const command = new PutObjectCommand({
    ACL: "public-read",
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    console.log("Generated presigned URL:", url); // Add logging
    return {
      statusCode: 200,
      body: JSON.stringify({ url, key }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error("Error generating presigned URL:", error); // Add logging
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Could not generate presigned URL", error: error.message }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};
