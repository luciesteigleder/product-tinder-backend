import express from "express";
const router = express.Router();

//Get price score
router.get("/", (req, res) => {
    res.send("priceRouter ok :)")
})

//Add price score
router.post("/new", (req, res) => {
    res.send("post request ok :)")
})

//Update price score
router.put("/", (req, res) => {
    res.send("update request ok :)")
})

//Delete price score
router.delete("/", (req, res) => {
    res.send("delete request ok :)")
})

export default router