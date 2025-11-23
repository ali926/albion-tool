import express from "express";
import cache from "../services/cache.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    backend: "online",
    cacheKeys: cache.keys(),
    time: new Date().toISOString()
  });
});

export default router;
