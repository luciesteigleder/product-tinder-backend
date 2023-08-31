import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.mjs";
import { Shop } from "../models/Shop.mjs";
import { Prov } from "../models/Prov.mjs";

const router = express.Router();

router.use(express.json());

//Handling errors and passing them to the front end
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "", other:"" };

  //Handling validation issues
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  //Duplicate email
  if (err.code === 11000) {
    errors.email = "Email already exists";
    return errors;
  }

  //Handling wrong email
  if (err.message === "wrong email") {
    errors.email = "this email is not registered";
  } //Handling wrong password
  if (err.message === "wrong password") {
    errors.password = "the password doesn't match";
  }

  //No linked prov or shop profile to a user when logging in
  if (err.message === "No shop or prov profile") {
    errors.other= "There is no shop or provider profile linked to this user"
  }

  return errors;

};

//Display user info
router.get("/", (req, res) => {
  res.send("userRouter ok :)");
});

//Update user info
router.put("/", (req, res) => {
  res.send("update route ok :)");
});

//Delete user
router.delete("/", (req, res) => {
  res.send("delete route ok :)");
});

//Function to create a token with the user ID and user type as payload
const createToken = (user_id = null, shop_id = null, prov_id = null) => {
  return jwt.sign({ user_id, shop_id, prov_id }, process.env.TOKEN_SECRET, {
    expiresIn: 7200000,
  });
};

//Sign up route
router.post("/signup", async (req, res) => {
  const { username, password, email, profile_type } = req.body;
  try {
    const newUser = await User.create({
      username,
      password,
      email,
      profile_type,
    });
    const token = createToken(newUser._id, newUser.shop_id, newUser.prov_id); //Create a token with ID
    // res.cookie("jwt", token, {
    //   //pushing the jwt in a httpOnly cookie for frontend handling
    //   httpOnly: true,
    //   maxAge: 7200000,
    // });
    res.status(200).json(token);
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
});

//Log in
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    //passing the login statics method (in user model) to verify if email & password match
    const user = await User.login(email, password);
    const userId = user._id;
    const shop = await Shop.find({ user_id: userId });
    const prov = await Prov.find({ user_id: userId });
    let token = null;

    const shopExist = await Shop.exists({ user_id: userId });
    const provExist = await Prov.exists({ user_id: userId });

    if (shopExist) {
      const shopId = shop[0].id;
      token = createToken(userId, shopId, null);
      console.log(shopId)
    }
    else if (provExist) {
      const provId = prov[0].id;
      token = createToken(userId, null, provId);
      console.log(provId)
    }
    else{
      token = createToken(userId, null, null);
      // throw Error('No shop or prov profile')
    }

    // res.cookie("jwt", token, {
    //   //pushing the jwt in a httpOnly cookie for frontend handling
    //   httpOnly: true,
    //   maxAge: 7200000,
    // });
    res.status(200).json(token);
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
});

export default router;
