import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import { User, userSchema } from "../models/User.mjs";

const router = express.Router();

router.use(bodyParser.json());

//Handling errors and passing them to the front end
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  //Handling validation issues
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  //Duplicate email
  if (err.code === 11000){
    errors.email = "Email already exists"
    return errors;
  }

  //Handling wrong email
  if (err.message === "wrong email") {
    errors.email = "this email is not registered";
  } //Handling wrong password
  if (err.message === "wrong password") {
    errors.password = "the password doesn't match";
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
const createToken = (id, type) => {
  return jwt.sign({ id, type }, process.env.TOKEN_SECRET, {
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
    const token = createToken(newUser._id, newUser.profile_type); //Create a token with ID and Profile type
    res.cookie("jwt", token, {
      //pushing the jwt in a httpOnly cookie for frontend handling
      httpOnly: true,
      maxAge: 7200000,
    });
    res.status(201).json({ user: newUser._id, type: newUser.profile_type });
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
    const token = createToken(user._id, user.profile_type);
    res.cookie("jwt", token, {
      //pushing the jwt in a httpOnly cookie for frontend handling
      httpOnly: true,
      maxAge: 7200000,
    });
    res.status(200).json({ user: user._id, type: user.profile_type });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
});

export default router;
