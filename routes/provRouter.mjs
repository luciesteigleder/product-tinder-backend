import express from "express";
import bodyParser from "body-parser";

import { Prov } from "../models/Prov.mjs";

const router = express.Router();

router.use(bodyParser.json());

//get prov info
router.get("/", async (req, res) => {
  try {
    const provider = await Prov.findById(req.query.id); // the id in the request has to be the prov_id
    if (!provider) {
      return res.status(404).send("Provider not found");
    }
    res.send(provider);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(500).send("Server Error");
  }
});

//Create a new prov profile
router.post("/", async (req, res) => {
  try {
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
  } catch (err) {
    console.error(err.message);
    res.send(400).send("Server Error");
  }
});

//Modify a new prov profile
router.put("/", async (req, res) => {
  // we need the id in the url
  const modificationPossible = [
    "prov_name",
    "prov_location",
    "prov_contact",
    "description",
    "picture",
    "language",
  ];
  console.log(req.body);
  try {
    const provider = await Prov.findById(req.query.id);
    console.log(provider);
    modificationPossible.forEach((field) => {
      if (req.body[field]) {
        provider[field] = req.body[field];
      }
    });

    await provider.save();

    res.send("data modified successfully!");
  } catch (err) {
    console.error(err.message);
    res.status(400).send("Server Error");
  }
});

//get results from a search
router.get("/search", (req, res) => {
  res.send("search route ok");
});

export default router;
