import express from "express";
import cors from "cors";

import itemsRouter from "./src/routes/items.js";
import pricesRouter from "./src/routes/prices.js";
import recipeRouter from "./src/routes/recipes.js";
import { startAutoPriceUpdate } from "./src/services/priceFetcher.js";

const app = express();
app.use(cors());
app.use(express.json());

// Register routes
app.use("/api/items", itemsRouter);
app.use("/api/prices", pricesRouter);
app.use("/api/recipes", recipeRouter);

// Start auto refresh timer
startAutoPriceUpdate();

app.get("/", (req, res) => {
    res.send("Albion Backend Running");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log("Backend running on port", PORT);
});
