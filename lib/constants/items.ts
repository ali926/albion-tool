import type { Tier, Enchantment } from "@/types/albion"

export const TIERS: Tier[] = [2, 3, 4, 5, 6, 7, 8]

export const ENCHANTMENTS: Enchantment[] = [0, 1, 2, 3, 4]

export const ITEM_CATEGORIES = {
  WEAPONS: "Weapons",
  ARMOR: "Armor",
  RESOURCES: "Resources",
  CONSUMABLES: "Consumables",
  ACCESSORIES: "Accessories",
} as const

export const CRAFTABLE_ITEMS = [
  // Cloth Armor
  { id: "HEAD_CLOTH_SET1", name: "Scholar Cowl", category: "Armor" },
  { id: "ARMOR_CLOTH_SET1", name: "Scholar Robe", category: "Armor" },
  { id: "SHOES_CLOTH_SET1", name: "Scholar Sandals", category: "Armor" },
  { id: "HEAD_CLOTH_SET2", name: "Cleric Cowl", category: "Armor" },
  { id: "ARMOR_CLOTH_SET2", name: "Cleric Robe", category: "Armor" },
  { id: "SHOES_CLOTH_SET2", name: "Cleric Sandals", category: "Armor" },
  { id: "HEAD_CLOTH_SET3", name: "Mage Cowl", category: "Armor" },
  { id: "ARMOR_CLOTH_SET3", name: "Mage Robe", category: "Armor" },
  { id: "SHOES_CLOTH_SET3", name: "Mage Sandals", category: "Armor" },

  // Leather Armor
  { id: "HEAD_LEATHER_SET1", name: "Mercenary Hood", category: "Armor" },
  { id: "ARMOR_LEATHER_SET1", name: "Mercenary Jacket", category: "Armor" },
  { id: "SHOES_LEATHER_SET1", name: "Mercenary Shoes", category: "Armor" },
  { id: "HEAD_LEATHER_SET2", name: "Hunter Hood", category: "Armor" },
  { id: "ARMOR_LEATHER_SET2", name: "Hunter Jacket", category: "Armor" },
  { id: "SHOES_LEATHER_SET2", name: "Hunter Shoes", category: "Armor" },
  { id: "HEAD_LEATHER_SET3", name: "Assassin Hood", category: "Armor" },
  { id: "ARMOR_LEATHER_SET3", name: "Assassin Jacket", category: "Armor" },
  { id: "SHOES_LEATHER_SET3", name: "Assassin Shoes", category: "Armor" },

  // Plate Armor
  { id: "HEAD_PLATE_SET1", name: "Soldier Helmet", category: "Armor" },
  { id: "ARMOR_PLATE_SET1", name: "Soldier Armor", category: "Armor" },
  { id: "SHOES_PLATE_SET1", name: "Soldier Boots", category: "Armor" },
  { id: "HEAD_PLATE_SET2", name: "Knight Helmet", category: "Armor" },
  { id: "ARMOR_PLATE_SET2", name: "Knight Armor", category: "Armor" },
  { id: "SHOES_PLATE_SET2", name: "Knight Boots", category: "Armor" },
  { id: "HEAD_PLATE_SET3", name: "Guardian Helmet", category: "Armor" },
  { id: "ARMOR_PLATE_SET3", name: "Guardian Armor", category: "Armor" },
  { id: "SHOES_PLATE_SET3", name: "Guardian Boots", category: "Armor" },

  // Weapons - Swords
  { id: "2H_CLAYMORE", name: "Claymore", category: "Weapons" },
  { id: "2H_DUALSWORD", name: "Dual Swords", category: "Weapons" },
  { id: "MAIN_SWORD", name: "Broadsword", category: "Weapons" },
  { id: "2H_CLEAVER", name: "Clarent Blade", category: "Weapons" },

  // Weapons - Axes
  { id: "2H_HALBERD", name: "Halberd", category: "Weapons" },
  { id: "2H_HALBERD_MORGANA", name: "Carrioncaller", category: "Weapons" },
  { id: "MAIN_AXE", name: "Battleaxe", category: "Weapons" },

  // Weapons - Bows
  { id: "2H_BOW", name: "Longbow", category: "Weapons" },
  { id: "2H_WARBOW", name: "Warbow", category: "Weapons" },
  { id: "2H_LONGBOW", name: "Longbow", category: "Weapons" },
]

export const REFINABLE_RESOURCES = [
  // Metal
  { id: "ORE", name: "Ore", category: "Metal", refined: "METALBAR" },

  // Leather
  { id: "HIDE", name: "Hide", category: "Leather", refined: "LEATHER" },

  // Cloth
  { id: "FIBER", name: "Fiber", category: "Cloth", refined: "CLOTH" },

  // Wood
  { id: "WOOD", name: "Wood", category: "Wood", refined: "PLANKS" },

  // Stone
  { id: "ROCK", name: "Stone", category: "Stone", refined: "STONEBLOCK" },
]

export const FLIPPABLE_ITEMS = [
  ...CRAFTABLE_ITEMS,
  // Common trade goods
  { id: "POTION_HEAL", name: "Healing Potion", category: "Consumables" },
  { id: "POTION_ENERGY", name: "Energy Potion", category: "Consumables" },
  { id: "MEAL_OMELETTE", name: "Omelette", category: "Consumables" },
  { id: "MEAL_BREAD", name: "Bread", category: "Consumables" },
]
