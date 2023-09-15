import express from "express";
import { Prov, getCoordinates } from "../models/Prov.mjs";
import { Shop } from "../models/Shop.mjs";
import dotenv from "dotenv";
import authChecker from "../middleware/authChecker.mjs";
import natural from "natural";
import { query, validationResult } from "express-validator";
import {
  validateProvData,
  validateDataForPut,
  upload,
} from "../middleware/validateData.mjs";

const router = express.Router();
router.use(express.json());
const stemmer = natural.PorterStemmer;

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ error: "File upload error" });
  } else if (err instanceof Error) {
    res.status(400).json({ error: err.message });
  } else {
    next();
  }
});

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
// const getStem = async (string) => {
//   const tagWords = string.split(" ");
//   const stemmedWords = await Promise.all(
//     tagWords.map((word) => stemmer.stem(word))
//   );
//   const result = {
//     tag_name: string,
//     tag_stem: stemmedWords.join(" "),
//   };
//   return result;
// };

const getStem = async (array) => {
  const tagWords = array.tag_name.split(" ");
  let listWords = [];

  const stemmedWords = await Promise.all(
    tagWords.map((word) => {
      const stemmedWord = stemmer.stem(word);
      listWords.push(stemmedWord);
      return stemmedWord;
    })
  );

  const newArray = {
    tag_name: array.tag_name,
    tag_stem: stemmedWords.join(" "),
    tag_words: listWords,
  };

  return newArray;
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

router.post(
  "/",
  //upload.single("picture"),
  validateProvData,
  authChecker,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
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
    let newProv = { ...req.body };
    const newAddress = req.body.prov_address;
    newProv.geometry = await getCoordinates(newAddress);

    //get the stemmed version of the tag
    let newlyCreatedTag = req.body.tags;
    console.log(newlyCreatedTag);
    let stemmedTags = [];

    for (const element of newlyCreatedTag) {
      console.log(element);
      let tempTag = {};
      tempTag.tag_name = element; // Access the tag name within each object
      const tagObject = await getStem(tempTag);
      console.log("tag object");
      console.log(tagObject);
      stemmedTags.push(tagObject);
      console.log(stemmedTags);
    }

    console.log("final stemmed tags");
    console.log(stemmedTags);

    newProv.tags = stemmedTags;

    console.log(newProv);

    //save profile
    try {
      if (!profileExists) {
        const newProvCreated = await Prov.create(newProv);
        console.log("newProvCreated");
        console.log(newProvCreated);
        res.status(200).json(newProvCreated);
      } else {
        throw Error("profile exists");
      }
    } catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
  }
);

//Modify a prov profile
router.put(
  "/",
  validateDataForPut,
  //upload.single("picture"),
  authChecker,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const authId = res.locals.payload.user_id;
    const authProvId = res.locals.payload.prov_id;

    const modificationPossible = [
      "prov_name",
      "prov_address",
      "prov_phone",
      "description",
      "picture",
      "language",
    ];
    try {
      const provider = await Prov.findById(authProvId);
      const providerUserId = provider.user_id;
      if (providerUserId == authId) {
        const updatePromises = modificationPossible.map(async (field) => {
          if (req.body[field] !== undefined) {
            provider[field] = req.body[field];
            if (field.startsWith("prov_address")) {
              provider.geometry = await getCoordinates(req.body[field]);
              console.log(provider.geometry);
            }
          }
        });
        await Promise.all(updatePromises);
        console.log(provider);
        await provider.save();
        res.status(200).send("Data modified successfully!");
      } else {
        res
          .status(400)
          .send("You don't have the rights to modify this profile");
      }
    } catch (err) {
      console.error(err.message);
      res.status(400).send("Server Error");
    }
  }
);

//route to add a new tag
router.put("/newTag", validateDataForPut, authChecker, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const authId = res.locals.payload.user_id;

  const authProvId = res.locals.payload.prov_id;
  try {
    // checking db for prov ID
    const provider = await Prov.findById(authProvId);
    console.log("provider");
    console.log(provider);
    const providerUserId = provider.user_id;
    // matching the IDs from the token with the ID in the provider object
    if (providerUserId == authId) {
      // check if the provider has this tag
      let tagToBeDeleted;
      console.log("prov.tags");
      console.log(provider.tags);

      provider.tags.forEach((tag) => {
        if (tag._id.toString() === req.query.tag_id) {
          tagToBeDeleted = tag;
          console.log("tagToBeDeleted");
          console.log(tagToBeDeleted);
        }
      });

      if (!tagToBeDeleted) {
        return res.status(400).json("This user doesn't have such tag");
      }

      const updatedTags = provider.tags.filter((tag) => tag !== tagToBeDeleted);

      provider.tags = updatedTags;
      await provider.save();
      return res.json(provider.tags);
    } else {
      return res
        .status(400)
        .send("You don't have the rights to delete this tag");
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

//get results from a search
router.get("/search", (req, res) => {
  res.send("search route ok");
});

export default router;
