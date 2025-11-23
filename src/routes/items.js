import express from "express";
import { getAllItems, getCraftableItems, getItemById } from "../utils/items.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.json(getAllItems());
});

router.get("/craftable", (req, res) => {
    res.json(getCraftableItems());
});

router.get("/:itemId", (req, res) => {
    const item = getItemById(req.params.itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    res.json(item);
});

export default router;
