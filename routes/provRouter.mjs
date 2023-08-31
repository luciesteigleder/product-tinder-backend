import express from "express";
import axios from "axios";
import { Prov } from "../models/Prov.mjs";
import { Shop } from "../models/Shop.mjs";
import dotenv from "dotenv";
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
    const nearShops = await Shop.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [
              parseFloat(req.query.long),
              parseFloat(req.query.lat),
            ],
          },
          distanceField: "distance",
          maxDistance: 500000,
          spherical: true,
        },
      },
    ]);
    if (nearShops.length === 0) {
      res.status(404).send("there's no shops around");
    } else {
      res.send(nearShops);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//Create a new prov profile
router.post("/", authChecker, async (req, res) => {
  const authId = res.locals.payload.user_id;
  let {
    user_id,
    prov_name,
    prov_contact: { address, phone },
    description,
    picture,
    language,
    geometry,
  } = req.body;

  //authentification
  req.body.user_id = authId;
  const profileExists = await Prov.exists({ user_id: authId });

  //get coordinates from address
  const newAddress = req.body.prov_contact.address;
  const geocodify = await axios.get(
    `https://api.geocodify.com/v2/geocode?api_key=${process.env.GEO_KEY}&q=${address}`
  );
  const html = geocodify.data;
  const coordinates = html.response.features[0].geometry;
  req.body.geometry = coordinates;
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
