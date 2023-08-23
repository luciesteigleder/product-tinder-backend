import express from "express";
import mongoose from "mongoose";
import catRouter from "./routes/catRouter.mjs";
import db from "./db.mjs";
import {
  User,
  Shop,
  Prov,
  Category,
  Tag,
  Result,
  Conversation,
} from "./sample_data.mjs";
const app = express();
const PORT = 3050;

app.use("/static", express.static("public"));
app.use("/categories", catRouter);

// TESTING DB push to collection
app.post("/test", (req, res) => {});

app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
