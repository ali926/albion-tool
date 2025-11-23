import express from "express";
import axios from "axios";
import cache from "../services/cache.js";

const router = express.Router();

const AODP_BASE = "https://europe.albiononline2d.com/api/v2/stats/prices";
const AFM_BASE = "https://www.albionfreemarket.com/api/v1/stats/prices";

// ░░ Get current prices for 1 item ░░
router.get("/:itemId", async (req, res) => {
  const itemId = req.params.itemId;

  const cacheKey = `price_${itemId}`;
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    const [aodp, afm] = await Promise.all([
      axios.get(`${AODP_BASE}/${itemId}`),
      axios.get(`${AFM_BASE}/${itemId}`)
    ]);

    const data = {
      itemId,
      aodp: aodp.data,
      afm: afm.data,
      updatedAt: new Date().toISOString()
    };

    cache.set(cacheKey, data, 60 * 5); // 5-minutes cache
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch item prices" });
  }
});

// ░░ Manual refresh ░░
router.get("/refresh/:itemId", async (req, res) => {
  const itemId = req.params.itemId;
  cache.del(`price_${itemId}`);
  res.json({ ok: true, message: `Price for ${itemId} refreshed` });
});

export default router;
