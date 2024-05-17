import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Bucket } from "sst/node/bucket";
import { randomUUID } from "crypto";


/* const s3Client = new S3Client({ region: process.env.AWS_REGION }); */
const s3Client = new S3Client({});

export const handler = async (event) => {
  const image = event.body;
  const name = event.headers['content-disposition'].split('=')[1].slice(1, -1).split('.')[0].replace(/\s+/g, '-');

  const type = event.headers['content-type']
  if (!image || !name || !type) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing 'image', 'name', or 'contentType' in request body" }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  const key = `uploads/${name}-${Date.now()}.${type.split('/')[1]}`;
  const base64Data = new Buffer.from(image, 'base64');

  const uploadCommand = new PutObjectCommand({
    ACL: "public-read",
    Bucket: Bucket.bucket.bucketName,
    Key: key,
    Body: base64Data,
    ContentEncoding: 'base64',
    ContentType: type,
  });
  s3Client.send(uploadCommand);

  const getCommand = new GetObjectCommand({
    Bucket: Bucket.bucket.bucketName,
    Key: key,
    ContentType: type,
  });

  const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });

  return {
    statusCode: 200,
    body: JSON.stringify({ url, key }),
    headers: {
      "Content-Type": "application/json",
    },
  };
};
