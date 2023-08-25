import mongoose from "mongoose";
import { envs } from "./config.mjs";
import aws from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new aws.S3({
  region: process.env.AWS_REGION,
  connectKey: process.env.DB_CONNECT,
});

// Access the connectKey value
const connectKey = s3.config.connectKey;

const client = mongoose
  .connect(`${connectKey}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Atlas connected!");
  })
  .catch((err) => {
    console.log(err);
  });

export default client;
