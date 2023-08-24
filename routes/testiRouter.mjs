import express from "express";
const router = express.Router();


//Get testimonials
router.get("/", (req, res) => {
    res.send("testiRouter ok :)")
})

//Add testimonial
router.post("/new", (req, res) => {
    res.send("post request ok :)")
})

//Update testimonial
router.put("/", (req, res) => {
    res.send("update request ok :)")
})

//Delete testimonial
router.delete("/", (req, res) => {
    res.send("delete request ok :)")
})

export default router