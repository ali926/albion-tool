"use client"

import type { TopProfitItem } from "@/components/top-profits-table"

export type FavoriteItem = TopProfitItem & {
  id: string
  type: "crafting" | "refining" | "bm-flips" | "item-flipper"
  addedAt: number
  itemId?: string
}

const STORAGE_KEY = "albion-favorites"

export function getFavorites(): FavoriteItem[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []

  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function addFavorite(item: TopProfitItem, type: FavoriteItem["type"]): void {
  const favorites = getFavorites()

  // Create unique ID based on item properties
  const id = `${type}-${item.itemName}-T${item.tier}.${item.enchantment}-${item.city || ""}-${item.buyCity || ""}-${item.sellCity || ""}`

  // Check if already exists
  if (favorites.some((f) => f.id === id)) {
    return
  }

  const favorite: FavoriteItem = {
    ...item,
    id,
    type,
    addedAt: Date.now(),
    itemId: item.itemId,
  }

  favorites.unshift(favorite)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
}

export function removeFavorite(id: string): void {
  const favorites = getFavorites()
  const updated = favorites.filter((f) => f.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export function isFavorite(item: TopProfitItem, type: FavoriteItem["type"]): boolean {
  const id = `${type}-${item.itemName}-T${item.tier}.${item.enchantment}-${item.city || ""}-${item.buyCity || ""}-${item.sellCity || ""}`
  const favorites = getFavorites()
  return favorites.some((f) => f.id === id)
}

export function clearFavorites(): void {
  localStorage.removeItem(STORAGE_KEY)
}
