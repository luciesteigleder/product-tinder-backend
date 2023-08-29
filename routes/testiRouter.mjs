import express from "express";
import { Testi } from "../models/Testi.mjs";
import authChecker from "../middleware/authChecker.mjs";
const router = express.Router();

router.use(express.json());

//Get testimonials
router.get("/", async (req, res) => {
  try {
    const testi = await Testi.findById(req.query.testi_id);
    if (!testi) {
      return res.status(404).send("testi not found");
    }
    res.json(testi);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(500).send("Server Error");
  }
});

//Add testimonial
router.post("/new", async (req, res) => {
  let { shop_id, prov_id, testi_text } = req.body;
  try {
    const newTesti = await Testi.create(req.body);
    res.json(newTesti);
  } catch (err) {
    console.error(err.message);
    res.status(400).send("Server Error");
  }
});

//Update testimonial
router.put("/", async (req, res) => {
  //only the testi_text can be modified

  try {
    if (req.body.testi_text) {
      const testiToModify = await Testi.findOneAndUpdate(
        { _id: req.query.testi_id },
        { testi_text: req.body.testi_text },
        { new: true }
      );
      await testiToModify.save();
      console.log(testiToModify);
      res.status(200).json(testiToModify);
    } else {
      res.status(400).send("no changes detected");
    }
  } catch (err) {
    console.error(err.message);
    res.status(400).send("Server Error");
  }
});

//Delete testimonial
router.delete("/", async (req, res) => {
  try {
    const testiToDelete = await Testi.findOneAndDelete({
      _id: req.query.testi_id,
    });
    res.send("deleted");
  } catch (err) {
    console.error(err.message);
    res.status(400).send("Server Error");
  }
});

export default router;
