import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
    res.send("testing categories route")
})

export default router