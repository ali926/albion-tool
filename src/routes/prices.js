import express from "express";
import { fetchItemPrice, fetchMultiplePrices } from "../services/priceFetcher.js";

const router = express.Router();

router.get("/:itemId", async (req, res) => {
    try {
        const prices = await fetchItemPrice(req.params.itemId);
        res.json(prices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/bulk", async (req, res) => {
    try {
        const prices = await fetchMultiplePrices(req.body.items);
        res.json(prices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
