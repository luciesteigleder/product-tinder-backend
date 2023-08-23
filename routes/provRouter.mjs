import express from "express";
const router = express.Router();

//get prov info
router.get("/", (req, res) => {
  res.send("provRouter ok !");
});

//Create a new prov profile
router.post("/", (req, res) => {
  res.send("provRouter post ok");
});

//Modify a new prov profile
router.put("/", (req, res) => {
  res.send("put route ok");
});

//get results from a search
router.get("/search", (req, res) => {
  res.send("search route ok");
});

export default router;
