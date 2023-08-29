import express from "express";
import { Price } from "../models/Price.mjs";
import authChecker from "../middleware/authChecker.mjs";
const router = express.Router();

router.use(express.json());

//Get prices
router.get("/", async (req, res) => {
  try {
    const price = await Price.findById(req.query.price_id);
    if (!price) {
      return res.status(404).send("price not found");
    }
    res.json(price);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(500).send("Server Error");
  }
});

//Add price
router.post("/new", async (req, res) => {
  let { shop_id, prov_id, price_value } = req.body;
  try {
    // Check if the combination of shop_id and prov_id already exists
    const existingPrice = await Price.findOne({ shop_id, prov_id });
    if (existingPrice) {
      return res.status(400).send("prov already rated by this shop");
    }
    const newPrice = await Price.create(req.body);
    res.json(newPrice);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//Update price
router.put("/", async (req, res) => {
  //only the price_value can be modified
  try {
    if (req.body.price_value) {
      const priceToModify = await Price.findOneAndUpdate(
        { _id: req.query.price_id },
        { price_value: req.body.price_value },
        { new: true }
      );
      console.log(priceToModify);
      await priceToModify.save();
      console.log(priceToModify);
      res.status(200).json(priceToModify);
    } else {
      res.status(400).send("no changes detected");
    }
  } catch (err) {
    console.error(err.message);
    res.status(400).send("Server Error");
  }
});

//Delete scrore
router.delete("/", async (req, res) => {
  try {
    const priceToDelete = await Price.findOneAndDelete({
      _id: req.query.price_id,
    });
    res.send("deleted");
  } catch (err) {
    console.error(err.message);
    res.status(400).send("Server Error");
  }
});

export default router;
