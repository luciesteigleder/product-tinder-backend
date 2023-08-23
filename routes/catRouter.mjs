import express from "express";
// import db from "./db.mjs";
const router = express.Router();

export default router.get("/", (req, res) => {
    res.send("testing categories route")
})