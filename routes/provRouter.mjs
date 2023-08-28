import express from "express";
import { Prov } from "../models/Prov.mjs";
import authChecker from "../middleware/authChecker.mjs";

const router = express.Router();

router.use(express.json());

//get prov info
router.get("/", async (req, res) => {
  try {
    console.log(req.query);
    const provider = await Prov.findById(req.query.prov_id);
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
router.post("/", authChecker, async (req, res) => {
  const authId = res.locals.payload.id; //check with coach
  let {
    user_id,
    prov_location: { coordinates },
    prov_name,
    prov_contact: { address, phone },
    description,
    picture,
    language,
  } = req.body;
  req.body.user_id = authId;
  try {
    await Prov.create(req.body);
    res.send("data saved in the db");
  } catch (err) {
    console.error(err.message);
    res.send(400).send("Server Error");
  }
});

//Modify a new prov profile
router.put("/", authChecker, async (req, res) => {
  const authId = String(res.locals.payload.id); //Stringifying the user ID in the token payload
  const modificationPossible = [
    "prov_name",
    "prov_location",
    "prov_contact",
    "description",
    "picture",
    "language",
  ];
  try {
    //checking db for prov ID
    const provider = await Prov.findById(req.query.prov_id);
    const providerUserId = String(provider.user_id); //Stringifying the user ID in the provider object
    //matching the IDs from the token with the ID in the provider object
    if (providerUserId === authId) {
      modificationPossible.forEach((field) => {
        if (req.body[field]) {
          provider[field] = req.body[field];
        }
      });
      await provider.save();
      res.status(200).send("data modified successfully!");
    } else {
      res.status(400).send("You don't have the rights to modify this profile");
    }
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
