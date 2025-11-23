import express from "express";
import cors from "cors";
import priceRoutes from "./src/routes/prices.js";
import recipeRoutes from "./src/routes/recipes.js";
import statusRoutes from "./src/routes/status.js";

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/prices", priceRoutes);
app.use("/recipes", recipeRoutes);
app.use("/status", statusRoutes);

// DEFAULT ROUTE
app.get("/", (req, res) => {
  res.send("Albion Tool Backend is running");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend live on port ${PORT}`));
