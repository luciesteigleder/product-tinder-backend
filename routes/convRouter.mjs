import express from "express";
const router = express.Router();


//CONVERSATIONS
// View conversation
router.get("/", (req, res) => {
    res.send("convRouter ok :)")
})

//Creates a new conversation
router.post("/new", (req,res) => {
    res.send("post route ok")
})

//Delete conversation
router.delete("/", (req,res) => {
    res.send("delete route ok")
})

//MESSAGES
//Create new message
router.post("/mess/new", (req,res) => {
    res.send("post route ok")
})

//Update message
router.put("/mess", (req,res) => {
    res.send("update route ok")
})

//Delete message
router.delete("/mess", (req,res) => {
    res.send("delete route ok")
})


export default router