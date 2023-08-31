import express from "express";
const router = express.Router();

router.use(express.json());

//Get saved search results
router.get("/", (req, res) => {
  res.send("resultRouter ok :)");
});

//Add saved search results
router.post("/new", (req, res) => {
  res.send("post request ok :)");
});

//Delete saved search results
router.delete("/", (req, res) => {
  res.send("delete request ok :)");
});

export default router;
