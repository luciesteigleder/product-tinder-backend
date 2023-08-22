import express from "express";
import db from "./db";
const app = express();
const PORT = 3050;

app.use("/static", express.static("public"))
app.use()

app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
