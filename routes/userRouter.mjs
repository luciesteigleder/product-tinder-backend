import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import { User, userSchema } from "../models/User.mjs";

const router = express.Router();

router.use(bodyParser.json());

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

//Sign up
const createToken = (id,type) => {
  return jwt.sign({ id, type }, process.env.TOKEN_SECRET, {
    expiresIn: 7200,
  });
};

router.post("/signup", async (req, res) => {
  const { username, password, email, profile_type } = req.body;
  try {
    const newUser = await User.create({
      username,
      password,
      email,
      profile_type,
    });
    const token = createToken(newUser._id,newUser.profile_type)
    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 7200
    })
    res.status(201).json({user: newUser._id, type:newUser.profile_type});
  } catch (err) {
    res.status(401).json({ err });
  }
});

//Log in
router.post("/login", (req, res) => {
  res.send("login route ok :)");
});

export default router;
