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
  let authId = res.locals.payload.user_id; //check with coach ( create an object to not modify req.body  )
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
  const authShopId = res.locals.payload.shop_id;

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
    const shop = await Shop.findById(authShopId);
    const shopUserId = shop.user_id;
    //matching the IDs from the token with the ID in the shop object
    if (shopUserId == authId) {
      const updatePromises = modificationPossible.map(async (field) => {
        if (req.body[field]) {
          shop[field] = req.body[field];
          if (field.startsWith("shop_address")) {
            shop.geometry = await getCoordinates(req.body[field]);
            console.log(shop.geometry);
          }
        }
      });

      await Promise.all(updatePromises);
      console.log(shop.geometry);
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
router.get("/search", (req, res) => {
  res.send("search route ok");
});

export default router;
