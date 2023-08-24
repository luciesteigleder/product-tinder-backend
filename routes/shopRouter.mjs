import express from "express";

import bodyParser from "body-parser";

import { Shop } from "../sample_data.mjs";
const router = express.Router();

router.use(bodyParser.json());

//get shop info
router.get("/", async (req, res) => {
  try {
    const shop = await Shop.findById(req.query.id);
    if (!shop) {
      return res.status(404).send("shop not found");
    }
    res.send(shop);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(500).send("Server Error");
  }
});

//Create a new shop profile
router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const {
      user_id,
      shop_location: { coordinates },
      shop_name,
      shop_contact: { address, phone },
      description,
      picture,
      language,
    } = req.body;
    const newShop = new Shop(req.body);
    await newShop.save();
    res.send("Data saved in the db");
  } catch (err) {
    console.error(err.message);
    res.status(400).send("Server Error");
  }
});

//Modify a new shop profile
router.put("/", async (req, res) => {
  // we need the id in the url
  const modificationPossible = [
    "shop_location",
    "shop_name",
    "shop_contact",
    "description",
    "picture",
    "language",
  ];
  console.log(req.body);
  try {
    const shop = await Shop.findById(req.query.id);
    console.log(shop);
    modificationPossible.forEach((field) => {
      if (req.body[field]) {
        shop[field] = req.body[field];
      }
    });

    await shop.save();

    res.send("data modified successfully!");
  } catch (err) {
    console.error(err.message);
    res.status(400).send("Server Error");
  }
});

export default router;
