import express from "express";
const router = express.Router();

//Get scores
router.get("/", (req, res) => {
    res.send("scoreRouter ok :)")
})

//Add score
router.post("/new", (req, res) => {
    res.send("post request ok :)")
})

//Update score
router.put("/", (req, res) => {
    res.send("update request ok :)")
})

//Delete scrore
router.delete("/", (req, res) => {
    res.send("delete request ok :)")
})

export default router