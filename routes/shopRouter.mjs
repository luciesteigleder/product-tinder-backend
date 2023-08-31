import express from "express";
import { Shop } from "../models/Shop.mjs";
import authChecker from "../middleware/authChecker.mjs";
const router = express.Router();

router.use(express.json());

//Error Handler
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { error_message:"" };
  //No linked prov or shop profile to a user when logging in
  if (err.message === "profile exists") {
    errors.error_message= "You are already linked to a profile"
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

//Create a new shop profile
router.post("/", authChecker, async (req, res) => {
  const authId = res.locals.payload.user_id; //check with coach ( create an object to not modify req.body  )
  let {
    user_id,
    shop_location: { coordinates },
    shop_name,
    shop_contact: { address, phone },
    description,
    picture,
    language,
  } = req.body;
  req.body.user_id = authId;
  const profileExists = Shop.exists({ user_id: authId });
  try {
    if (!profileExists){
    const newShop = await Shop.create(req.body);
    res.status(200).json(newShop)
    }
    else{
      throw Error('profile exists')
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors })
  }
});

//Modify a new shop profile
router.put("/", authChecker, async (req, res) => {
  const authId = String(res.locals.payload.id); //Stringifying the user ID in the token payload
  const modificationPossible = [
    "shop_location",
    "shop_name",
    "shop_contact",
    "description",
    "picture",
    "language",
  ];

  try {
    //Checking DB for shop ID
    const shop = await Shop.findById(req.query.shop_id);
    const shopUserId = String(shop.user_id); //Stringifying the user ID in the shop object
    //matching the IDs from the token with the ID in the shop object
    if (shopUserId === authId) {
      modificationPossible.forEach((field) => {
        if (req.body[field]) {
          shop[field] = req.body[field];
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
router.get("/search", (req, res) => {
  res.send("search route ok");
});

export default router;
