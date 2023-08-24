import express from "express";
import bodyParser from "body-parser";
import { User, userSchema } from "../models/User.mjs";

const router = express.Router();

router.use(bodyParser.json());

//Display user info
router.get("/", (req, res) => {
    res.send("userRouter ok :)")
})

//Update user info
router.put("/", (req, res) => {
    res.send("update route ok :)")
})

//Delete user
router.delete("/", (req, res) => {
    res.send("delete route ok :)")
})

// //Sign up
// router.post("/signup", (req, res) => {
//     res.send("signup route ok :)")
// })


router.post("/signup", async (req, res) => {
    // const {
    //     username,
    //     password,
    //     email,
    //     profile_type
    // } = req.body 
    const newUser = new User({
        username: "test",
        password: "test",
        email: "test",
        profile_type: true
    });
    await newUser.save();
    res.status(200).send("test ok")
})


// username: {
//     type: String,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//   },
//   profile_type: {
//     type: Boolean, //do we really ant boolean ? Yes-no
//     required: true,
//   },

//Sign up
// router.post("/signup", async (req, res) => {
//     User.pre('save', (doc, next) => {

//     })
//     try {
//       const hashedPw = await bcrypt.hash(req.body.password, 10);

//       const newUser = new User(req.body);
//       await newUser.save();
//       client.connect((err) => {
//         if (err) console.log(err);

//       });
//     } catch {
//       res.status(500);
//       res.send("can't create user");
//     }
//   });

//Log in
router.post("/login", (req, res) => {
    res.send("login route ok :)")
})



export default router