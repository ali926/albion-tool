import type { CraftingCalculation, CraftingRecipe } from "@/types/albion"

interface CalculateCraftingProfitParams {
  recipe: CraftingRecipe
  materialPrices: number[]
  outputPrice: number
  returnRate: number // Percentage with city bonuses applied
  craftingFee: number
}

/**
 * Calculates crafting profit including material costs, return rates, and fees
 */
export function calculateCraftingProfit({
  recipe,
  materialPrices,
  outputPrice,
  returnRate,
  craftingFee,
}: CalculateCraftingProfitParams): CraftingCalculation {
  // Calculate total material cost
  const totalMaterialCost = recipe.materials.reduce((sum, material, index) => {
    const materialCost = materialPrices[index] || 0
    const effectiveCost = materialCost * material.quantity * (1 - returnRate / 100)
    return sum + effectiveCost
  }, 0)

  const profit = outputPrice - totalMaterialCost - craftingFee
  const profitPercentage = totalMaterialCost > 0 ? (profit / totalMaterialCost) * 100 : 0

  return {
    itemId: recipe.outputItemId,
    materialCosts: totalMaterialCost,
    craftingFee,
    outputValue: outputPrice,
    profit,
    profitPercentage,
  }
}
