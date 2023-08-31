import express from "express";
import { Prov } from "../models/Prov.mjs";
import { Shop } from "../models/Shop.mjs";
import authChecker from "../middleware/authChecker.mjs";

const router = express.Router();

router.use(express.json());

//Error Handler
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { error_message: "" };
  //No linked prov or shop profile to a user when logging in
  if (err.message === "profile exists") {
    errors.error_message = "You are already linked to a profile";
  }
  return errors;
};

//get prov info from id
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

//get prov profile from location
router.get("/loc", async (req, res) => {
  try {
    const nearShops = await Shop.geoNear(
      {
        type: "Point",
        coordinates: [parseFloat(req.query.long), parseFloat(req.query.lat)], //the query has to have 2 params: long & lat (this is the location of the prov that is looking for shops nerby)
      },
      { maxDistance: 500000 /*this is in meters*/, spherical: true }
    );
    if (nearShops.length === 0) {
      res.sendStatus(404).send("there's no shops around");
    }
    res.send(nearShops);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(500).send("Server Error");
  }
});

//Create a new prov profile
router.post("/", authChecker, async (req, res) => {
  const authId = res.locals.payload.user_id;
  let {
    user_id,
    geometry: { type, coordinates },
    prov_name,
    prov_contact: { address, phone },
    description,
    picture,
    language,
  } = req.body;
  req.body.user_id = authId;
  const profileExists = await Prov.exists({ user_id: authId });
  try {
    if (!profileExists) {
      const newProv = await Prov.create(req.body);
      res.status(200).json(newProv);
    } else {
      throw Error("profile exists");
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
});

//Modify a new prov profile
router.put("/", authChecker, async (req, res) => {
  const authId = String(res.locals.payload.id); //Stringifying the user ID in the token payload
  const modificationPossible = [
    "prov_name",
    "geometry",
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
