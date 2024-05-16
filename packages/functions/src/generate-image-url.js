import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Bucket } from "sst/node/bucket";

/* const s3Client = new S3Client({ region: process.env.AWS_REGION }); */
const s3Client = new S3Client({});

export const handler = async (event) => {
  console.log('HERERERERERERE')
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

  const key = `uploads/${name}-${Date.now()}.${contentType.split('/')[1]}`;
  const command = new PutObjectCommand({
    Bucket: Bucket.myFiles.bucketName,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour expiration

  return {
    statusCode: 200,
    body: JSON.stringify({ url, key }),
    headers: {
      "Content-Type": "application/json",
    },
  };
};
