import express from "express";
import axios from "axios";
import cache from "../services/cache.js";

const router = express.Router();
const RECIPE_BASE = "https://europe.albiononline2d.com/en/item";

// ░░ Fetch crafting recipe ░░
router.get("/:itemId", async (req, res) => {
  const itemId = req.params.itemId;
  const cacheKey = `recipe_${itemId}`;

  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    const html = await axios.get(`${RECIPE_BASE}/${itemId}`);

    const data = {
      itemId,
      html: html.data,
      updatedAt: new Date().toISOString()
    };

    cache.set(cacheKey, data, 60 * 60); // 1 hour cache
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
});

export default router;
