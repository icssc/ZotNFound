import express from "express";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Bucket } from "sst/node/bucket";
import { randomUUID } from "crypto";

const uploadRouter = express.Router();
uploadRouter.get("/", (req, res) => {
  res.status(200).send("Here");
});
uploadRouter.post("/image", async (req, res) => {
  const s3Client = new S3Client({});
  const image = req.body;

  const type = req.headers["content-type"];
  if (!image || !type) {
    res.status(400).send("Missing 'image' or 'contentType' in request body");
  }

  const key = `uploads/${Date.now()}-${randomUUID()}.${type.split("/")[1]}`;
  const base64Data = new Buffer.from(image, "base64");

  const uploadParams = {
    ACL: "public-read", // This will make the file public "public-read
    Bucket: Bucket.bucket.bucketName,
    Key: key,
    Body: base64Data,
    ContentType: type,
  };

  const uploadCommand = new PutObjectCommand(uploadParams);

  s3Client.send(uploadCommand);

  const getCommand = new GetObjectCommand({
    Bucket: Bucket.bucket.bucketName,
    Key: key,
    ContentType: type,
  });

  // const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });
  const url = `https://${Bucket.bucket.bucketName}.s3.amazonaws.com/${key}`;

  res.setHeader("Content-Type", type);
  res.setHeader("Access-Control-Allow-Origin", "*");
  // 'headers': {
  //             'access-control-allow-headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  //             'access-control-allow-methods': 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT',
  //             'access-control-allow-origin': '*'
  //           }
  res.status(200).send({ url });
});

export default uploadRouter;
