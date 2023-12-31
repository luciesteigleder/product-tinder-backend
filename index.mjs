import express from "express";
import mongoose from "mongoose";
import cors from "cors"
import catRouter from "./routes/catRouter.mjs";
import userRouter from "./routes/userRouter.mjs";
import shopRouter from "./routes/shopRouter.mjs";
import provRouter from "./routes/provRouter.mjs";
import convRouter from "./routes/convRouter.mjs";
import scoreRouter from "./routes/scoreRouter.mjs";
import testiRouter from "./routes/testiRouter.mjs";
import priceRouter from "./routes/priceRouter.mjs";
import favRouter from "./routes/favRouter.mjs";
import resultRouter from "./routes/resultRouter.mjs";
import tagRouter from "./routes/tagRouter.mjs";

import db from "./db.mjs";
const app = express();
const PORT = process.env.PORT || 3050;

app.use(cors())

app.use("/static", express.static("public"));
app.use("/api/categories", catRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/prov", provRouter);
app.use("/api/conv", convRouter);
app.use("/api/score", scoreRouter);
app.use("/api/testi", testiRouter);
app.use("/api/price", priceRouter);
app.use("/api/fav", favRouter);
app.use("/api/result", resultRouter);
app.use("/api/tag", tagRouter);

// TESTING DB push to collection
app.post("/test", (req, res) => {});

app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
