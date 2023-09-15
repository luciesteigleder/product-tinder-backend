import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connectKey = process.env.DB_CONNECT;

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
