import express from "express";
const router = express.Router();

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

//Sign up
router.post("/signup", (req, res) => {
    res.send("signup route ok :)")
})

//Log in
router.post("/login", (req, res) => {
    res.send("login route ok :)")
})



export default router