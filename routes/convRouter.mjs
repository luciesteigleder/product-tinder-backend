import express from "express";
const router = express.Router();

// View conversation
router.get("/", (req, res) => {
    res.send("convRouter ok :)")
})

//Creates a new conversation
router.post("/new"), (req,res) => {
    res.send("post route ok")
}

//Delete conversation
router.delete("/"), (req,res) => {
    res.send("delete route ok")
}

export default router