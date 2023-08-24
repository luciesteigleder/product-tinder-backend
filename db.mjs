import mongoose from "mongoose";
import { envs } from "./config.mjs";

const client = mongoose
  .connect(envs.DB_CONNECT, {
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
