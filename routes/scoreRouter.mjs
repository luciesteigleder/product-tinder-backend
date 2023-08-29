import express from "express";
import { Score } from "../models/Score.mjs";
import authChecker from "../middleware/authChecker.mjs";
const router = express.Router();

router.use(express.json());

//Get scores
router.get("/", async (req, res) => {
  try {
    const score = await Score.findById(req.query.score_id);
    if (!score) {
      return res.status(404).send("score not found");
    }
    res.json(score);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(500).send("Server Error");
  }
});

//Add score
router.post("/new", async (req, res) => {
  let { shop_id, prov_id, score_value } = req.body;
  try {
    // Check if the combination of shop_id and prov_id already exists
    const existingScore = await Score.findOne({ shop_id, prov_id });
    if (existingScore) {
      return res.status(400).send("prov already rated by this shop");
    }
    const newScore = await Score.create(req.body);
    res.json(newScore);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//Update score
router.put("/", async (req, res) => {
  //only the score_value can be modified

  try {
    if (req.body.score_value) {
      const scoreToModify = await Score.findOneAndUpdate(
        { _id: req.query.score_id },
        { score_value: req.body.score_value },
        { new: true }
      );
      await scoreToModify.save();
      console.log(scoreToModify);
      res.status(200).json(scoreToModify);
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
    const scoreToDelete = await Score.findOneAndDelete({
      _id: req.query.score_id,
    });
    res.send("deleted");
  } catch (err) {
    console.error(err.message);
    res.status(400).send("Server Error");
  }
});

export default router;
