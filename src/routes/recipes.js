import express from "express";
import { fetchRecipe } from "../services/recipeFetcher.js";

const router = express.Router();

router.get("/:itemId", async (req, res) => {
    try {
        const recipe = await fetchRecipe(req.params.itemId);
        res.json(recipe);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
