import express from "express";
const router = express.Router();

//get shop info
router.get("/", (req, res) => {
  res.send("shopRouter ok !");
});

//Create a new shop profile
router.post("/", (req, res) => {
  res.send("shopRouter post ok");
});

//Modify a new shop profile
router.put("/", (req, res) => {
  res.send("put route ok");
});

export default router;
