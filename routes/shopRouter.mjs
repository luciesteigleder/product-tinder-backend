import express from "express";
import axios from "axios";
import { Shop, getCoordinates } from "../models/Shop.mjs";
import { Prov } from "../models/Prov.mjs";
import authChecker from "../middleware/authChecker.mjs";
import authToken from "../middleware/authChecker.mjs";
const router = express.Router();

//get it to change the coordinates when they change the address

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

//get shop info
router.get("/", async (req, res) => {
  try {
    const shop = await Shop.findById(req.query.shop_id);
    if (!shop) {
      return res.status(404).send("shop not found");
    }
    res.send(shop);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(500).send("Server Error");
  }
});

//get prov profile from location
router.get("/loc", async (req, res) => {
  try {
    const nearProvs = await Prov.aggregate([
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
    if (nearProvs.length === 0) {
      res.status(404).send("there's no provs around");
    }
    res.send(nearProvs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//Create a new shop profile
router.post("/", authChecker, async (req, res) => {
  let authId = res.locals.payload.user_id;
  console.log(authId);
  let {
    user_id,
    shop_name,
    shop_address,
    shop_phone,
    description,
    picture,
    language,
    geometry,
  } = req.body;

  //authentification
  req.body.user_id = authId;
  const profileExists = await Shop.exists({ user_id: authId });

  //get coordinates from address
  let newShop = req.body;
  const newAddress = req.body.shop_address;
  newShop.geometry = await getCoordinates(newAddress);

  try {
    if (!profileExists) {
      const newShop = await Shop.create(req.body);
      res.status(200).json(newShop);
    } else {
      throw Error("profile exists");
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
});

//Modify a shop profile
router.put("/", authChecker, async (req, res) => {
  const authId = res.locals.payload.user_id;
  const modificationPossible = [
    "shop_name",
    "shop_address",
    "shop_phone",
    "description",
    "picture",
    "language",
  ];
  try {
    //Checking DB for shop ID
    const shop = await Shop.findById(req.query.shop_id);
    const shopUserId = shop.user_id;
    //matching the IDs from the token with the ID in the shop object
    if (shopUserId == authId) {
      modificationPossible.forEach(async (field) => {
        if (req.body[field]) {
          shop[field] = req.body[field];
          if (field.startsWith("shop_address")) {
            shop.geometry = await getCoordinates(req.body[field]);
          }
        }
      });
      await shop.save();
      res.status(200).json(shop);
    } else {
      res.status(400).send("You don't have the rights to modify this profile");
    }
  } catch (err) {
    console.error(err.message);
    res.status(400).send("Server Error");
  }
});

//get results from a search
router.get("/search", authChecker, async (req, res) => {
  const { max_distance, categories, tags } = req.body;
  const shopId = res.locals.payload.shop_id;
  try {
    const shop = await Shop.findById(shopId);
    const shopLoc = shop.geometry.coordinates;

    //Creating an array of objects for the Provs that match the minimum distance
    const nearProvs = await Prov.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(shopLoc[0]), parseFloat(shopLoc[1])],
          },
          distanceField: "distance",
          maxDistance: max_distance,
          spherical: true,
        },
      },
    ]);
    if (nearProvs.length === 0) {
      res.status(404).send("there's no provs around");
    }

    //Searching for category matches and attributing them a score to sort out results
    const sortByCat = async () => {
      const catMatchProv = [];
      const addedProvs = [];
      nearProvs.forEach((prov) => {
        for (let j = 0; j < prov.categories.length; j++) {
          for (let i = 0; i < categories.length; i++) {
            const existingProvider = catMatchProv.find(
              (existing) => existing._id === prov._id
            );
            if (
              categories[i] === prov.categories[j] &&
              !addedProvs.includes(prov)
            ) {
              prov.score++;
              catMatchProv.push(prov);
              addedProvs.push(prov);
            } else if (
              categories[i] === prov.categories[j] &&
              addedProvs.includes(prov)
            ) {
              existingProvider.score++;
            }
          }
        }
      });
      return catMatchProv;
    };

    //Searching for tag matches and attributing them a score to sort out results
    const sortByTag = async () => {
      const finalProv = [];
      const addedProvs = [];
      const tagMatchProv = await sortByCat();
      tagMatchProv.forEach((prov) => {
        for (let j = 0; j < prov.tags.length; j++) {
          for (let i = 0; i < tags.length; i++) {
            const existingProvider = tagMatchProv.find(
              (existing) => existing._id === prov._id
            );
            if (
              tags[i] === prov.tags[j].tag_name &&
              !addedProvs.includes(prov)
            ) {
              prov.score += 2;
              finalProv.push(prov);
              addedProvs.push(prov);
            } else if (
              tags[i] === prov.tags[j].tag_name &&
              addedProvs.includes(prov)
            ) {
              existingProvider.score += 2;
            }
          }
        }
      });
      return finalProv;
    };
    const result = await sortByTag();
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
