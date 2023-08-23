import express from "express";
import bodyParser from "body-parser";

import { Prov } from "../sample_data.mjs";

const router = express.Router();

router.use(bodyParser.json());

//get prov info
router.get("/", (req, res) => {
  console.log(req.body);
  res.send("provRouter ok !");
});

//Create a new prov profile
router.post("/", async (req, res) => {
  const {
    user_id,
    prov_location: { coordinates },
    prov_name,
    prov_contact: { address, phone },
    description,
    picture,
    language,
  } = req.body;
  const newProv = new Prov(req.body);
  await newProv.save();
  res.send("data saved in the db");
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
