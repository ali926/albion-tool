import type { RefiningCalculation, RefiningRecipe } from "@/types/albion"

interface CalculateRefiningProfitParams {
  recipe: RefiningRecipe
  inputPrice: number
  outputPrice: number
  returnRate: number // Percentage with city bonuses applied
  refiningFee: number
}

/**
 * Calculates refining profit including input costs, return rates, and fees
 */
export function calculateRefiningProfit({
  recipe,
  inputPrice,
  outputPrice,
  returnRate,
  refiningFee,
}: CalculateRefiningProfitParams): RefiningCalculation {
  // Calculate effective input cost considering return rate
  const effectiveInputCost = inputPrice * recipe.inputQuantity * (1 - returnRate / 100)

  // Total output value
  const totalOutputValue = outputPrice * recipe.outputQuantity

  const profit = totalOutputValue - effectiveInputCost - refiningFee
  const profitPercentage = effectiveInputCost > 0 ? (profit / effectiveInputCost) * 100 : 0

  return {
    outputItemId: recipe.outputItemId,
    inputCost: effectiveInputCost,
    refiningFee,
    outputValue: totalOutputValue,
    profit,
    profitPercentage,
  }
}
