//_________________TO BE DELETED, HAS BEEN INTEGRATED WITHIN THE PROV ROUTER

import express from "express";
import { Tag } from "../models/Tag.mjs";
import authChecker from "../middleware/authChecker.mjs";
import natural from "natural";

const router = express.Router();
router.use(express.json());

const stemmer = natural.PorterStemmer;

//get the stem of each words
const getStem = async (string) => {
  const tagWords = string.tag_name.split(" ");
  const stemmedWords = await Promise.all(
    tagWords.map((word) => stemmer.stem(word))
  );
  string.tag_stem = stemmedWords.join(" ");
  console.log(string);
  return string;
};

//get tags by id
router.get("/", async (req, res) => {
  try {
    const tag = await Tag.findById(req.query.tag_id);
    if (!tag) {
      return res.status(404).send("tag not found");
    }
    res.json(tag);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(500).send("Server Error");
  }
});

//get a list of similar tags (only provs)
router.get("/tag", async (req, res) => {
  let searchStem = req.query.tag_stem;
  try {
    const exactTag = await Tag.find({
      tag_stem: searchStem,
      prov_id: { $ne: null },
    });
    const partialTag = await Tag.find({
      tag_stem: { $regex: searchStem, $options: "i" },
    });
    if (exactTag.length === 0 && partialTag.length === 0) {
      return res.status(404).send("tag not found");
    }
    res.json(exactTag + partialTag);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(500).send("Server Error");
  }
});

//add a tag
router.post("/new", async (req, res) => {
  let newlyCreatedTag = req.body;

  //add the stemmed version of the tag name to the object
  await getStem(newlyCreatedTag);

  // depending on whether the user is a prov or a shop (for the next step)
  let tagShop_id;
  let tagProv_id;
  if (newlyCreatedTag.shop_id) {
    tagShop_id = newlyCreatedTag.shop_id;
  } else if (newlyCreatedTag.prov_id) {
    tagProv_id = newlyCreatedTag.prov_id;
  }
  const tagTag_stem = newlyCreatedTag.tag_stem;

  //check if the user doesn't have more than 20 tags already
  try {
    let userTags;
    if (tagShop_id) {
      userTags = await find({ prov_id: tagProv_id });
      if (userTags.length >= 20) {
        res.status(500).send("User reached the limit of tags");
      } else {
        //check if the tag_stem already exists for this user (depending whether it's a shop or a prov)
        let existingTag;
        if (tagProv_id) {
          existingTag = await Tag.findOne({
            prov_id: tagProv_id,
            tag_stem: tagTag_stem,
          });
        } else if (tagShop_id) {
          existingTag = await Tag.findOne({
            shop_id: tagShop_id,
            tag_stem: tagTag_stem,
          });
        }

        if (existingTag) {
          return res.status(400).send("this user already has a similar tag");
        } else {
          const newTag = await Tag.create(newlyCreatedTag);
          res.json(newTag);
        }
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(400).send("Server Error");
  }
});

//delete a tag
router.delete("/", async (req, res) => {
  try {
    const tagToDelete = await Tag.findByIdAndDelete({
      _id: req.query.tag_id,
    });
    res.send("deleted");
  } catch (err) {
    console.error(err.message);
    res.status(400).send("Server Error");
  }
});

export default router;
