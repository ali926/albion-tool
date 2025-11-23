import express from "express";
import { fetchMarketPrices } from "../services/marketFetcher.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const items = req.query.items?.split(",") ?? [];
    const cities = req.query.cities?.split(",") ?? [];

    const data = await fetchMarketPrices(items, cities);
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
