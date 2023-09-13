import express from "express";
import { Prov, getCoordinates } from "../models/Prov.mjs";
import { Shop } from "../models/Shop.mjs";
import dotenv from "dotenv";
import authChecker from "../middleware/authChecker.mjs";
import natural from "natural";
import { query, validationResult } from "express-validator";

const router = express.Router();
router.use(express.json());
const stemmer = natural.PorterStemmer;

//___________________________FUNCTIONS_________________________

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

//get the stem of each words
const getStem = async (string) => {
  const tagWords = string.split(" ");
  const stemmedWords = await Promise.all(
    tagWords.map((word) => stemmer.stem(word))
  );
  const result = {
    tag_name: string,
    tag_stem: stemmedWords.join(" "),
  };
  return result;
};

//____________________________________________ROUTES___________________________________
//get prov info from id
router.get("/", query("prov_id").notEmpty().escape(), async (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    try {
      // console.log(req.query);
      // console.log(typeof req.query.prov_id);
      const provider = await Prov.findById(req.query.prov_id);

      if (!provider) {
        return res.status(404).send("Provider not found");
      }
      res.send(provider);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  } else {
    res.send({ errors: result.array() });
  }
});

//get shop profiles from location
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
    prov_address,
    prov_phone,
    description,
    picture,
    language,
    geometry,
    tags,
    categories,
  } = req.body;

  //authentification
  req.body.user_id = authId;
  const profileExists = await Prov.exists({ user_id: authId });

  //get coordinates from address
  let newProv = req.body;
  const newAddress = req.body.prov_address;
  newProv.geometry = await getCoordinates(newAddress);

  //get the stemmed version of the tag
  let newlyCreatedTag = req.body.tags;
  let stemmedTags = [];

  for (const element of newlyCreatedTag) {
    // for because forEach does not work well with asynchronous
    let tagObject = {};
    tagObject.tag_name = element;
    tagObject.tag_stem = await getStem(element);
    stemmedTags.push(tagObject);
  }

  newProv.tags = stemmedTags;

  //save profile
  try {
    if (!profileExists) {
      const newProvCreated = await Prov.create(newProv);
      res.status(200).json(newProvCreated);
    } else {
      throw Error("profile exists");
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
});

//Modify a prov profile
router.put("/", authChecker, async (req, res) => {
  const authId = res.locals.payload.user_id;
  const modificationPossible = [
    "prov_name",
    "prov_address",
    "prov_phone",
    "description",
    "picture",
    "language",
  ];
  try {
    const provider = await Prov.findById(req.query.prov_id);
    const providerUserId = provider.user_id;
    if (providerUserId == authId) {
      for (const field of modificationPossible) {
        if (req.body[field] !== undefined) {
          provider[field] = req.body[field];
          if (field.startsWith("prov_address")) {
            provider.geometry = await getCoordinates(req.body[field]);
            console.log(provider.geometry);
          }
        }
      }

      console.log(provider);
      await provider.save();
      res.status(200).send("Data modified successfully!");
    } else {
      res.status(400).send("You don't have the rights to modify this profile");
    }
  } catch (err) {
    console.error(err.message);
    res.status(400).send("Server Error");
  }
});

//route to add a new tag
router.put("/newTag", authChecker, async (req, res) => {
  const authId = res.locals.payload.user_id;
  const authProvId = res.locals.payload.prov_id;
  try {
    //checking db for prov ID
    const provider = await Prov.findById(authProvId);
    const providerUserId = provider.user_id; //Stringifying the user ID in the provider object
    //matching the IDs from the token with the ID in the provider object
    if (providerUserId == authId) {
      let newlyCreatedTag = req.body;
      let tagToBeAdded = await getStem(newlyCreatedTag.tag_name);
      newlyCreatedTag.tag_stem = tagToBeAdded;

      try {
        //check if the user doesn't have more than 20 tags already

        if (provider.tags.length >= 20) {
          res.status(500).send("User reached the limit of tags");
        } else {
          const tags = provider.tags;
          let hasSimilarTag = false;

          for (const tag of tags) {
            if (tag.tag_stem === tagToBeAdded.tag_stem) {
              hasSimilarTag = true;
              break;
            }
          }
          console.log(hasSimilarTag);
          if (hasSimilarTag) {
            return res.status(400).send("This user already has a similar tag");
          } else {
            const newTag = {
              tag_name: newlyCreatedTag.tag_name,
              tag_stem: newlyCreatedTag.tag_stem,
            };
            provider.tags.push(newTag);
            await provider.save();

            res.json(provider);
          }
        }
      } catch (err) {
        console.error(err.message);
        res.status(400).send("Server Error");
      }
    } else {
      res.status(400).send("You don't have the rights to add a tag");
    }
  } catch (err) {
    console.error(err.message);
    res.status(400).send("Server Error");
  }
});

//delete a tag
router.put("/deleteTag", authChecker, async (req, res) => {
  const authId = res.locals.payload.user_id; 
  const authProvId = res.locals.payload.prov_id
  try {
    //checking db for prov ID
    const provider = await Prov.findById(authProvId);
    const providerUserId = provider.user_id;
    //matching the IDs from the token with the ID in the provider object
    if (providerUserId == authId) {
      try {
        const updateQuery = {
          $pull: { tags: { _id: tagId } },
        };
        const provToBeUpdated = await Prov.findOneAndUpdate(
          { prov_id: provId },
          updateQuery,
          { new: true }
        );
        res.json(provToBeUpdated);
      } catch (err) {
        console.error(err.message);
        res.status(400).send("Server Error");
      }
    } else {
      res.status(400).send("You don't have the rights to delete this tag");
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
