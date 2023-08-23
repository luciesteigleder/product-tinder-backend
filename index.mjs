import express from "express";
import mongoose from "mongoose";
import catRouter from "./routes/catRouter.mjs"
import db from "./db.mjs";
import { categorySchema } from "./sample_data.mjs" 
const app = express();
const PORT = 3050;

app.use("/static", express.static("public"))
app.use("/categories", catRouter)


// TESTING DB push to collection
const Category = mongoose.model('test',categorySchema)
app.post("/test", (req,res) => {
  const test = new Category({ category_name: 'test category'})
   test.save()
   res.status(200).send('database entry succesful')
})


app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
