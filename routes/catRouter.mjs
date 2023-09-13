import express from "express";
import { Category } from "../models/Category.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
    try{
        const allCat = await Category.find()
        res.status(200).json(allCat)
    }
    catch (err) {
        console.log(err)
        res.status(400).send("")
    }
})

export default router