import express from "express";
const router = express.Router();

//Get favorites
router.get("/", (req, res) => {
    res.send("favRouter ok :)")
})

//Add favorites
router.post("/new", (req, res) => {
    res.send("post request ok :)")
})

//Delete favorites
router.delete("/", (req, res) => {
    res.send("delete request ok :)")
})

export default router