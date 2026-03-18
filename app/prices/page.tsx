'use client'

import { useState } from 'react'
import {
  TrendingUp, TrendingDown, BarChart3, RefreshCw, Globe2,
  ArrowUp, ArrowDown, Bell, Download, Bot, Activity, Clock
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  Cell, Legend
} from 'recharts'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useT } from '@/lib/i18n'
import { PRICE_DATA, TOP_SPECIES_TRADE, EXCHANGE_RATES } from '@/lib/data'
import { PlatformCategoryBar } from '@/components/PlatformCategoryBar'
import { AirFreightRates } from '@/components/AirFreightRates'
import { formatPrice, cn } from '@/lib/utils'

// ─── Comprehensive category price items (5-10 per category) ─────────────────
interface PriceItem {
  id: string
  name: string
  icon: string
  category: 'frozen-seafood' | 'frozen-value-added' | 'seafood-specials' | 'fresh-seafood'
  speciesGroup: string
  origin: string
  processingType: string
  price: number      // USD/kg
  prev: number       // previous period USD/kg
  history: number[]  // 6 months
}

const ALL_PRICE_ITEMS: PriceItem[] = [
  // ══ FROZEN SEAFOOD (10 items) ══════════════════════════════════════════════
  { id:'pi-fs-01', name:'Atlantic Salmon — Fillet IQF Skin-On',            icon:'🐟', category:'frozen-seafood',     speciesGroup:'Atlantic Salmon',      origin:'Norway',      processingType:'IQF Frozen',            price:5.85,    prev:5.72,    history:[5.20,5.35,5.48,5.60,5.72,5.85] },
  { id:'pi-fs-02', name:'Yellowfin Tuna — Loins Vacuum IQF',               icon:'🐠', category:'frozen-seafood',     speciesGroup:'Yellowfin Tuna',       origin:'Maldives',    processingType:'IQF Frozen',            price:6.40,    prev:6.15,    history:[5.80,5.95,6.05,6.15,6.25,6.40] },
  { id:'pi-fs-03', name:'Tilapia — Fillet Skinless IQF 3-5oz',             icon:'🐟', category:'frozen-seafood',     speciesGroup:'Tilapia',              origin:'China',       processingType:'IQF Frozen',            price:2.85,    prev:2.95,    history:[3.10,3.00,2.95,2.90,2.88,2.85] },
  { id:'pi-fs-04', name:'Vannamei Shrimp — HLSO 21/25 Block Frozen',       icon:'🦐', category:'frozen-seafood',     speciesGroup:'Shrimp',               origin:'Ecuador',     processingType:'Block Frozen',          price:7.20,    prev:7.45,    history:[7.80,7.65,7.50,7.42,7.38,7.20] },
  { id:'pi-fs-05', name:'Lobster — Cold Water Tails 4-5oz Raw IQF',        icon:'🦞', category:'frozen-seafood',     speciesGroup:'Lobster',              origin:'Canada',      processingType:'Raw IQF',               price:38.50,   prev:36.00,   history:[34.00,35.00,35.50,36.00,37.00,38.50] },
  { id:'pi-fs-06', name:'Yellowtail Hamachi — Sashimi Grade Super Frozen', icon:'🐡', category:'frozen-seafood',     speciesGroup:'Yellowtail / Hamachi', origin:'Japan',       processingType:'Super Frozen (-60°C)',  price:22.50,   prev:20.80,   history:[18.50,19.00,19.80,20.50,20.80,22.50] },
  { id:'pi-fs-07', name:'Black Tiger Shrimp — HLSO 8/12 IQF',              icon:'🦐', category:'frozen-seafood',     speciesGroup:'Shrimp',               origin:'Bangladesh',  processingType:'IQF Frozen',            price:14.50,   prev:14.10,   history:[13.50,13.70,13.90,14.00,14.10,14.50] },
  { id:'pi-fs-08', name:'Tilapia — Whole Round Frozen',                    icon:'🐟', category:'frozen-seafood',     speciesGroup:'Tilapia',              origin:'China',       processingType:'Block Frozen',          price:1.85,    prev:1.92,    history:[2.10,2.05,2.00,1.95,1.92,1.85] },
  { id:'pi-fs-09', name:'Atlantic Salmon — Trim & Belly Flaps Frozen',     icon:'🐟', category:'frozen-seafood',     speciesGroup:'Atlantic Salmon',      origin:'Chile',       processingType:'Block Frozen',          price:3.20,    prev:3.05,    history:[2.90,2.95,3.00,3.05,3.10,3.20] },
  { id:'pi-fs-10', name:'Yellowfin Tuna — Belly Flaps (Toro) Frozen',      icon:'🐠', category:'frozen-seafood',     speciesGroup:'Yellowfin Tuna',       origin:'Indonesia',   processingType:'Block Frozen',          price:5.10,    prev:4.90,    history:[4.50,4.60,4.70,4.80,4.90,5.10] },

  // ══ FROZEN VALUE ADDED (8 items) ══════════════════════════════════════════
  { id:'pi-va-01', name:'Breaded Shrimp — Panko Butterfly IQF',            icon:'🍤', category:'frozen-value-added', speciesGroup:'Value Added',          origin:'Thailand',    processingType:'Breaded Frozen',        price:14.90,   prev:14.50,   history:[13.80,14.00,14.20,14.40,14.50,14.90] },
  { id:'pi-va-02', name:'Smoked Atlantic Salmon — Sliced Retail',          icon:'🐟', category:'frozen-value-added', speciesGroup:'Value Added',          origin:'Scotland',    processingType:'Smoked Chilled',        price:21.50,   prev:20.50,   history:[19.50,19.80,20.00,20.20,20.50,21.50] },
  { id:'pi-va-03', name:'Yellowfin Tuna — Herb Marinated Steaks IQF',      icon:'🐠', category:'frozen-value-added', speciesGroup:'Value Added',          origin:'Ecuador',     processingType:'Marinated Frozen',      price:11.90,   prev:11.50,   history:[10.80,11.00,11.20,11.30,11.50,11.90] },
  { id:'pi-va-04', name:'Lobster Bisque — Ready-to-Serve Pouch',           icon:'🦞', category:'frozen-value-added', speciesGroup:'Value Added',          origin:'Canada',      processingType:'Frozen Meal',           price:18.80,   prev:18.00,   history:[17.20,17.50,17.70,17.90,18.00,18.80] },
  { id:'pi-va-05', name:'Breaded Tilapia — Fillet Oven-Crispy IQF',        icon:'🐟', category:'frozen-value-added', speciesGroup:'Value Added',          origin:'China',       processingType:'Breaded Frozen',        price:5.90,    prev:5.70,    history:[5.30,5.40,5.50,5.60,5.70,5.90] },
  { id:'pi-va-06', name:'Calamari Rings — Breaded IQF',                    icon:'🦑', category:'frozen-value-added', speciesGroup:'Value Added',          origin:'Spain',       processingType:'Breaded Frozen',        price:8.90,    prev:8.60,    history:[8.10,8.20,8.40,8.50,8.60,8.90] },
  { id:'pi-va-07', name:'Salmon Burger Patty — Herb & Lemon 120g',         icon:'🐟', category:'frozen-value-added', speciesGroup:'Value Added',          origin:'Norway',      processingType:'Formed Frozen',         price:13.40,   prev:13.00,   history:[12.50,12.60,12.80,12.90,13.00,13.40] },
  { id:'pi-va-08', name:'Seafood Mix — Calamari, Shrimp & Octopus IQF',    icon:'🥘', category:'frozen-value-added', speciesGroup:'Value Added',          origin:'Spain',       processingType:'IQF Mix',               price:9.50,    prev:9.20,    history:[8.80,8.90,9.00,9.10,9.20,9.50] },

  // ══ SEAFOOD SPECIALS (10 items) ════════════════════════════════════════════
  { id:'pi-sp-01', name:'Beluga Caviar — Premium Grade (30g / 50g / 125g)', icon:'🫧', category:'seafood-specials',   speciesGroup:'Caviar',               origin:'Iran',        processingType:'Chilled Specialty',     price:8500,    prev:8300,    history:[8000,8100,8200,8250,8300,8500] },
  { id:'pi-sp-02', name:'Osetra Caviar — Royal Grade (30g / 50g)',          icon:'🫧', category:'seafood-specials',   speciesGroup:'Caviar',               origin:'France',      processingType:'Chilled Specialty',     price:3800,    prev:3700,    history:[3500,3550,3600,3650,3700,3800] },
  { id:'pi-sp-03', name:'Bottarga di Muggine — Mullet Roe DOP (Sardinia)', icon:'🟡', category:'seafood-specials',   speciesGroup:'Bottarga',             origin:'Italy',       processingType:'Cured Specialty',       price:780,     prev:750,     history:[710,720,730,740,750,780] },
  { id:'pi-sp-04', name:'Bottarga di Tonno — Tuna Roe Sicilian',            icon:'🟤', category:'seafood-specials',   speciesGroup:'Bottarga',             origin:'Italy',       processingType:'Cured Specialty',       price:420,     prev:405,     history:[385,390,398,402,405,420] },
  { id:'pi-sp-05', name:'Norwegian Salmon Carpaccio — Hand-Sliced',         icon:'🍱', category:'seafood-specials',   speciesGroup:'Seafood Specials',     origin:'Norway',      processingType:'Chilled Specialty',     price:42.00,   prev:40.50,   history:[38.00,38.50,39.50,40.00,40.50,42.00] },
  { id:'pi-sp-06', name:'Nordic Gravlax — Salmon Cured Dill & Sea Salt',    icon:'🌿', category:'seafood-specials',   speciesGroup:'Seafood Specials',     origin:'Norway',      processingType:'Cured Chilled',         price:38.00,   prev:36.50,   history:[34.00,35.00,35.50,36.00,36.50,38.00] },
  { id:'pi-sp-07', name:'Octopus Carpaccio — Wild Atlantic, Marinated',     icon:'🐙', category:'seafood-specials',   speciesGroup:'Seafood Specials',     origin:'Spain',       processingType:'Chilled Specialty',     price:28.50,   prev:27.50,   history:[25.00,25.80,26.50,27.00,27.50,28.50] },
  { id:'pi-sp-08', name:'King Crab Legs — Red King Crab Frozen Sections',   icon:'🦀', category:'seafood-specials',   speciesGroup:'Seafood Specials',     origin:'Norway',      processingType:'Cooked Frozen',         price:68.00,   prev:65.00,   history:[60.00,61.00,62.00,63.50,65.00,68.00] },
  { id:'pi-sp-09', name:'Mediterranean Seafood Salad — Shrimp & Octopus',   icon:'🥗', category:'seafood-specials',   speciesGroup:'Seafood Specials',     origin:'Spain',       processingType:'Ready-to-Eat Chilled',  price:16.90,   prev:16.50,   history:[15.50,15.80,16.00,16.20,16.50,16.90] },
  { id:'pi-sp-10', name:'Ecuadorian Shrimp Ceviche — Ready-to-Eat',         icon:'🍋', category:'seafood-specials',   speciesGroup:'Seafood Specials',     origin:'Peru',        processingType:'Ready-to-Eat Chilled',  price:22.50,   prev:21.50,   history:[20.00,20.50,21.00,21.20,21.50,22.50] },

  // ══ FRESH SEAFOOD (10 items) ═══════════════════════════════════════════════
  { id:'pi-fr-01', name:'Bluefin Tuna — Fresh Sashimi Grade A+ (-60°C)',    icon:'🐟', category:'fresh-seafood',      speciesGroup:'Bluefin Tuna',         origin:'Japan',       processingType:'Super Frozen (-60°C)',  price:88.00,   prev:84.00,   history:[78.00,80.00,82.00,83.00,84.00,88.00] },
  { id:'pi-fr-02', name:'Atlantic Salmon — Fresh Whole HOG (Chilled)',      icon:'🐟', category:'fresh-seafood',      speciesGroup:'Atlantic Salmon',      origin:'Norway',      processingType:'Fresh Chilled',         price:4.95,    prev:4.80,    history:[4.50,4.60,4.65,4.70,4.80,4.95] },
  { id:'pi-fr-03', name:'King Salmon / Chinook — Fresh Whole HOG (Alaska)', icon:'🐟', category:'fresh-seafood',      speciesGroup:'King Salmon',          origin:'USA',         processingType:'Fresh Chilled',         price:28.00,   prev:26.00,   history:[22.00,23.00,24.00,25.00,26.00,28.00] },
  { id:'pi-fr-04', name:'European Sea Bass / Branzino — Fresh Whole',       icon:'🐟', category:'fresh-seafood',      speciesGroup:'Sea Bass',             origin:'Greece',      processingType:'Fresh Chilled',         price:8.90,    prev:8.55,    history:[7.80,8.00,8.20,8.35,8.55,8.90] },
  { id:'pi-fr-05', name:'Atlantic Halibut — Fresh H&G (Iceland)',           icon:'🐟', category:'fresh-seafood',      speciesGroup:'Halibut',              origin:'Iceland',     processingType:'Fresh Chilled',         price:18.50,   prev:17.80,   history:[16.50,17.00,17.20,17.50,17.80,18.50] },
  { id:'pi-fr-06', name:'Atlantic Cod — Fresh Skinless Fillet (Iceland)',   icon:'🐟', category:'fresh-seafood',      speciesGroup:'Cod',                  origin:'Iceland',     processingType:'Fresh Chilled',         price:7.80,    prev:7.50,    history:[7.00,7.10,7.20,7.35,7.50,7.80] },
  { id:'pi-fr-07', name:'Mahi-Mahi / Dorado — Fresh Fillet Skinless',       icon:'🐟', category:'fresh-seafood',      speciesGroup:'Mahi-Mahi',            origin:'Ecuador',     processingType:'Fresh Chilled',         price:9.40,    prev:9.00,    history:[8.40,8.60,8.70,8.85,9.00,9.40] },
  { id:'pi-fr-08', name:'Swordfish — Fresh Steaks Mediterranean Longline',  icon:'🗡️', category:'fresh-seafood',      speciesGroup:'Swordfish',            origin:'Italy',       processingType:'Fresh Chilled',         price:14.80,   prev:14.20,   history:[13.20,13.50,13.80,14.00,14.20,14.80] },
  { id:'pi-fr-09', name:'Sea Bream / Dorade — Fresh Whole (Aegean)',        icon:'🐟', category:'fresh-seafood',      speciesGroup:'Sea Bream',            origin:'Greece',      processingType:'Fresh Chilled',         price:7.20,    prev:6.90,    history:[6.40,6.55,6.65,6.75,6.90,7.20] },
  { id:'pi-fr-10', name:'Red Snapper — Fresh Whole H&G (Gulf of Mexico)',   icon:'🐠', category:'fresh-seafood',      speciesGroup:'Red Snapper',          origin:'Mexico',      processingType:'Fresh Chilled',         price:11.20,   prev:10.80,   history:[9.80,10.00,10.20,10.50,10.80,11.20] },
]

// Which species IDs belong to which category (for legacy species cards)
const SPECIES_CATEGORY_MAP: Record<string, string> = {
  salmon:        'frozen-seafood',
  yellowfin:     'frozen-seafood',
  tilapia:       'frozen-seafood',
  shrimp:        'frozen-seafood',
  lobster:       'frozen-seafood',
  hamachi:       'frozen-seafood',
  'value-added': 'frozen-value-added',
}

const CAT_STYLE: Record<string, { gradient: string; border: string; text: string; bg: string }> = {
  'frozen-seafood':     { gradient:'from-sky-500 to-sky-700',     border:'border-sky-200',    text:'text-sky-700',     bg:'bg-sky-50' },
  'frozen-value-added': { gradient:'from-violet-500 to-violet-700', border:'border-violet-200', text:'text-violet-700',  bg:'bg-violet-50' },
  'seafood-specials':   { gradient:'from-orange-500 to-orange-700', border:'border-orange-200', text:'text-orange-700',  bg:'bg-orange-50' },
  'fresh-seafood':      { gradient:'from-emerald-500 to-emerald-700', border:'border-emerald-200', text:'text-emerald-700', bg:'bg-emerald-50' },
}
const CAT_ICON: Record<string, string> = {
  'frozen-seafood':'🧊', 'frozen-value-added':'⭐', 'seafood-specials':'🍽️', 'fresh-seafood':'🐟',
}

const CAT_CHART_COLOR: Record<string, string> = {
  'frozen-seafood':     '#0ea5e9',
  'frozen-value-added': '#8b5cf6',
  'seafood-specials':   '#f97316',
  'fresh-seafood':      '#10b981',
}

// Last 6 months relative to Mar 2026
const HISTORY_MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']

const CURRENCIES = Object.keys(EXCHANGE_RATES.rates)
const UNITS = ['kg', 'lb', 'MT', 'Short Ton']

// 7 main price categories
const PRICE_SPECIES = [
  { id: 'salmon',       label: 'Atlantic Salmon',     icon: '🐟', color: '#f97316', bg: 'from-orange-500 to-orange-700' },
  { id: 'yellowfin',   label: 'Yellowfin Tuna',      icon: '🐠', color: '#0ea5e9', bg: 'from-sky-500 to-sky-700' },
  { id: 'tilapia',     label: 'Tilapia',              icon: '🐟', color: '#059669', bg: 'from-emerald-500 to-emerald-700' },
  { id: 'shrimp',      label: 'Shrimp',               icon: '🦐', color: '#f43f5e', bg: 'from-rose-500 to-rose-700' },
  { id: 'lobster',     label: 'Lobster',              icon: '🦞', color: '#dc2626', bg: 'from-red-500 to-red-700' },
  { id: 'hamachi',     label: 'Yellowtail / Hamachi', icon: '🐡', color: '#8b5cf6', bg: 'from-violet-400 to-violet-600' },
  { id: 'value-added', label: 'Value Added',          icon: '⭐', color: '#7c3aed', bg: 'from-violet-500 to-violet-700' },
]

// Sub-variants per species for the detailed price table
const PRICE_VARIANTS: Record<string, { name: string; price: number; prev: number; origin: string; type: string }[]> = {
  salmon: [
    { name: 'Whole HOG Fresh',            price: 4.95, prev: 4.80, origin: 'Norway',  type: 'Fresh Chilled' },
    { name: 'Fillet IQF Skin-On',         price: 5.85, prev: 5.72, origin: 'Norway',  type: 'IQF Frozen' },
    { name: 'Fillet Skinless IQF',        price: 5.45, prev: 5.30, origin: 'Chile',   type: 'IQF Frozen' },
    { name: 'Portions 180g',              price: 7.20, prev: 6.95, origin: 'Norway',  type: 'IQF Frozen' },
    { name: 'Trim & Belly Flaps',         price: 3.20, prev: 3.05, origin: 'Chile',   type: 'Block Frozen' },
    { name: 'Smoked Sliced (Retail)',      price: 21.50, prev: 20.50, origin: 'Scotland', type: 'Smoked Chilled' },
  ],
  yellowfin: [
    { name: 'Whole Round Fresh',          price: 4.80, prev: 4.60, origin: 'Indonesia', type: 'Fresh' },
    { name: 'Loins Vacuum IQF',           price: 6.40, prev: 6.15, origin: 'Maldives',  type: 'IQF Frozen' },
    { name: 'Steaks IQF 170-220g',        price: 7.90, prev: 7.70, origin: 'Ecuador',   type: 'IQF Frozen' },
    { name: 'Sashimi Grade Super Frozen', price: 18.50, prev: 17.50, origin: 'Japan',  type: 'Super Frozen' },
    { name: 'Belly Flaps (Toro)',         price: 5.10, prev: 4.90, origin: 'Indonesia', type: 'Block Frozen' },
    { name: 'Marinated Herb Steaks',      price: 11.90, prev: 11.50, origin: 'Ecuador', type: 'Marinated Frozen' },
  ],
  tilapia: [
    { name: 'Whole Round Frozen',         price: 1.85, prev: 1.92, origin: 'China',   type: 'Block Frozen' },
    { name: 'Fillet Skinless IQF 3-5oz',  price: 2.85, prev: 2.95, origin: 'China',   type: 'IQF Frozen' },
    { name: 'Fillet Skin-On IQF',         price: 2.60, prev: 2.70, origin: 'Vietnam', type: 'IQF Frozen' },
    { name: 'Portions 120-170g',          price: 3.45, prev: 3.55, origin: 'Egypt',   type: 'IQF Frozen' },
    { name: 'Smoked Fillet',              price: 7.50, prev: 7.20, origin: 'Israel',  type: 'Smoked Chilled' },
    { name: 'Breaded Fillet',             price: 5.90, prev: 5.70, origin: 'China',   type: 'Breaded Frozen' },
  ],
  shrimp: [
    { name: 'Vannamei HLSO 16/20',        price: 9.40, prev: 9.60, origin: 'Ecuador',    type: 'Block Frozen' },
    { name: 'Vannamei HLSO 21/25',        price: 7.20, prev: 7.45, origin: 'Ecuador',    type: 'Block Frozen' },
    { name: 'Vannamei HLSO 31/40',        price: 6.50, prev: 6.70, origin: 'Ecuador',    type: 'IQF Frozen' },
    { name: 'Vannamei HLSO 41/50',        price: 5.80, prev: 6.00, origin: 'India',      type: 'IQF Frozen' },
    { name: 'PD Raw IQF 26/30',           price: 9.20, prev: 9.50, origin: 'Vietnam',    type: 'IQF Frozen' },
    { name: 'PD Cooked IQF 31/40',        price: 10.80, prev: 11.10, origin: 'Vietnam',  type: 'IQF Frozen' },
    { name: 'Black Tiger HLSO 8/12',      price: 14.50, prev: 14.10, origin: 'Bangladesh', type: 'IQF Frozen' },
    { name: 'Butterfly 26/30',            price: 12.40, prev: 12.10, origin: 'Thailand',  type: 'IQF Frozen' },
    { name: 'Breaded Panko Butterfly',    price: 14.90, prev: 14.50, origin: 'Thailand',  type: 'Breaded Frozen' },
  ],
  lobster: [
    { name: 'Live Hard-Shell 1-1.25lb',   price: 28.50, prev: 27.00, origin: 'USA',     type: 'Live' },
    { name: 'Whole Cooked Frozen',        price: 24.80, prev: 23.50, origin: 'Canada',  type: 'Cooked IQF' },
    { name: 'Cold Water Tails 4-5oz',     price: 38.50, prev: 36.00, origin: 'Canada',  type: 'Raw IQF' },
    { name: 'Cold Water Tails 5-6oz',     price: 42.00, prev: 39.00, origin: 'Canada',  type: 'Raw IQF' },
    { name: 'Spiny Tails 6-8oz',          price: 22.50, prev: 21.00, origin: 'Nicaragua', type: 'IQF Frozen' },
    { name: 'Knuckle & Claw Meat',        price: 52.00, prev: 49.00, origin: 'Canada',  type: 'Cooked Frozen' },
  ],
  hamachi: [
    { name: 'Whole Fresh 3-5kg',            price: 16.80, prev: 15.90, origin: 'Japan',     type: 'Fresh Chilled' },
    { name: 'Loin Fillet Skinless IQF',     price: 18.90, prev: 17.90, origin: 'Australia', type: 'IQF Frozen' },
    { name: 'Sashimi Grade Super Frozen',   price: 22.50, prev: 20.80, origin: 'Japan',     type: 'Super Frozen' },
    { name: 'Collar (Kama) IQF',            price: 11.20, prev: 10.50, origin: 'Japan',     type: 'IQF Frozen' },
    { name: 'Yellowtail Kingfish Fillet',   price: 19.50, prev: 18.60, origin: 'Australia', type: 'Fresh Chilled' },
    { name: 'Hamachi Belly (Toro) Frozen',  price: 28.00, prev: 26.50, origin: 'Japan',     type: 'Super Frozen' },
  ],
  'value-added': [
    { name: 'Breaded Shrimp Panko',       price: 14.90, prev: 14.50, origin: 'Thailand', type: 'Breaded Frozen' },
    { name: 'Smoked Salmon Sliced',       price: 21.50, prev: 20.50, origin: 'Scotland', type: 'Smoked Chilled' },
    { name: 'YFT Marinated Steaks',       price: 11.90, prev: 11.50, origin: 'Ecuador',  type: 'Marinated Frozen' },
    { name: 'Lobster Bisque Pouch',       price: 18.80, prev: 18.00, origin: 'Canada',   type: 'Frozen Meal' },
    { name: 'Breaded Tilapia Fillet',     price: 5.90, prev: 5.70, origin: 'China',     type: 'Breaded Frozen' },
    { name: 'Calamari Rings Breaded',     price: 8.90, prev: 8.60, origin: 'Spain',     type: 'Breaded Frozen' },
    { name: 'Salmon Burger Patty 120g',   price: 13.40, prev: 13.00, origin: 'Norway',  type: 'Formed Frozen' },
    { name: 'Seafood Mix (Shrimp/Squid)', price: 9.50, prev: 9.20, origin: 'Spain',     type: 'IQF Frozen' },
  ],
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

// 0=off-season, 1=low, 2=available, 3=peak
const SEASON_SPECIES = [
  {
    id: 'salmon', label: 'Atlantic Salmon', icon: '🐟', color: '#f97316', type: 'Farmed',
    months: [2,2,3,3,2,2,3,3,3,3,3,2],
    fao: [
      { code: 'FAO 27', name: 'NE Atlantic',       note: 'Norway · Scotland · Faroes · Iceland' },
      { code: 'FAO 21', name: 'NW Atlantic',        note: 'Canada' },
      { code: 'FAO 87', name: 'SE Pacific',         note: 'Chile' },
    ],
  },
  {
    id: 'yellowfin', label: 'Yellowfin Tuna', icon: '🐠', color: '#0ea5e9', type: 'Wild',
    months: [2,2,3,3,3,2,2,2,3,3,3,2],
    fao: [
      { code: 'FAO 51', name: 'W Indian Ocean',     note: 'Maldives · Sri Lanka · India' },
      { code: 'FAO 57', name: 'E Indian Ocean',     note: 'Indonesia · Philippines' },
      { code: 'FAO 71', name: 'W Central Pacific',  note: 'PNG · Fiji · Solomon Is.' },
      { code: 'FAO 77', name: 'E Central Pacific',  note: 'Ecuador · Mexico' },
      { code: 'FAO 34', name: 'E Central Atlantic', note: 'Ghana · Senegal' },
    ],
  },
  {
    id: 'tilapia', label: 'Tilapia', icon: '🐡', color: '#059669', type: 'Farmed',
    months: [2,1,2,3,3,3,3,3,3,2,2,2],
    fao: [
      { code: 'FAO 61', name: 'NW Pacific',         note: 'China (65% global supply)' },
      { code: 'FAO 57', name: 'E Indian Ocean',     note: 'Indonesia · Thailand' },
      { code: 'FAO 51', name: 'W Indian Ocean',     note: 'Egypt · Israel' },
      { code: 'FAO 31', name: 'W Central Atlantic', note: 'Honduras · Ecuador' },
    ],
  },
  {
    id: 'shrimp', label: 'Shrimp', icon: '🦐', color: '#f43f5e', type: 'Mixed',
    months: [3,2,3,3,3,2,2,2,3,3,3,3],
    fao: [
      { code: 'FAO 87', name: 'SE Pacific',         note: 'Ecuador (Vannamei leader)' },
      { code: 'FAO 57', name: 'E Indian Ocean',     note: 'Vietnam · Bangladesh' },
      { code: 'FAO 51', name: 'W Indian Ocean',     note: 'India · Pakistan' },
      { code: 'FAO 71', name: 'W Central Pacific',  note: 'Thailand · Indonesia' },
      { code: 'FAO 31', name: 'W Central Atlantic', note: 'Gulf of Mexico · Caribbean' },
    ],
  },
  {
    id: 'lobster', label: 'Lobster', icon: '🦞', color: '#dc2626', type: 'Wild',
    months: [1,1,1,2,3,3,3,3,3,3,3,2],
    fao: [
      { code: 'FAO 21', name: 'NW Atlantic',        note: 'USA (Maine) · Canada (NS, NL)' },
      { code: 'FAO 71', name: 'W Central Pacific',  note: 'Caribbean · Bahamas' },
      { code: 'FAO 57', name: 'E Indian Ocean',     note: 'Australia · New Zealand' },
      { code: 'FAO 87', name: 'SE Pacific',         note: 'Chile · Nicaragua' },
    ],
  },
  {
    id: 'hamachi', label: 'Yellowtail / Hamachi', icon: '🐡', color: '#8b5cf6', type: 'Farmed',
    months: [2,2,3,3,3,3,2,2,2,3,3,2],
    fao: [
      { code: 'FAO 61', name: 'NW Pacific',         note: 'Japan (Kyushu · Kochi · Ehime)' },
      { code: 'FAO 57', name: 'E Indian Ocean',     note: 'Australia (Spencer Gulf — Kingfish)' },
      { code: 'FAO 81', name: 'SW Pacific',         note: 'New Zealand (Kingfish)' },
    ],
  },
]

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

const CUSTOM_TOOLTIP = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 rounded-xl shadow-glass p-3">
        <p className="text-xs font-semibold text-slate-700 mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="text-sm font-bold" style={{ color: p.color }}>
            {formatPrice(p.value)}/kg
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function PricesPage() {
  const t = useT()
  const [selectedSpecies, setSelectedSpecies] = useState('salmon')
  const [selectedCurrency, setSelectedCurrency] = useState('USD')
  const [selectedUnit, setSelectedUnit] = useState('kg')
  const [timeRange, setTimeRange] = useState('12M')
  const [priceCategory, setPriceCategory] = useState('all')
  const [selectedPriceItem, setSelectedPriceItem] = useState<string | null>(null)

  const spec = PRICE_SPECIES.find(s => s.id === selectedSpecies)
  const selectedData = PRICE_DATA[selectedSpecies as keyof typeof PRICE_DATA]
  const conversionRate = EXCHANGE_RATES.rates[selectedCurrency as keyof typeof EXCHANGE_RATES.rates] || 1
  const convertPrice = (p: number) => selectedCurrency === 'USD' ? p : p * conversionRate
  const variants = PRICE_VARIANTS[selectedSpecies] || []

  // Multi-species comparison
  const hamachiHistory = (PRICE_DATA as Record<string, typeof PRICE_DATA.salmon>).hamachi?.history ?? []
  const comparisonData = PRICE_DATA.salmon.history.map((h, i) => ({
    month: h.month,
    salmon:    PRICE_DATA.salmon.history[i]?.price,
    yellowfin: PRICE_DATA.yellowfin.history[i]?.price,
    tilapia:   PRICE_DATA.tilapia.history[i]?.price,
    shrimp:    PRICE_DATA.shrimp.history[i]?.price,
    lobster:   PRICE_DATA.lobster.history[i]?.price / 5, // scaled ÷5 for visual
    hamachi:   hamachiHistory[i]?.price,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('page.prices.title')}</h1>
          <p className="text-slate-500 text-sm mt-1 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            7 species · Full variant pricing · Live market data
            <span className="text-slate-300">·</span>
            <Clock className="w-3.5 h-3.5" />
            Updated {new Date().toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm"><Bell className="w-4 h-4" />Price Alerts</Button>
          <Button variant="secondary" size="sm"><Download className="w-4 h-4" />Export</Button>
          <Button variant="primary" size="sm"><RefreshCw className="w-4 h-4" />Refresh</Button>
        </div>
      </div>

      {/* Category Bar */}
      <PlatformCategoryBar
        selected={priceCategory}
        onSelect={(cat) => { setPriceCategory(cat); setSelectedPriceItem(null) }}
        counts={{
          all: ALL_PRICE_ITEMS.length,
          'frozen-seafood':     ALL_PRICE_ITEMS.filter(p => p.category === 'frozen-seafood').length,
          'frozen-value-added': ALL_PRICE_ITEMS.filter(p => p.category === 'frozen-value-added').length,
          'seafood-specials':   ALL_PRICE_ITEMS.filter(p => p.category === 'seafood-specials').length,
          'fresh-seafood':      ALL_PRICE_ITEMS.filter(p => p.category === 'fresh-seafood').length,
        }}
      />

      {/* Currency & Unit */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-slate-500" />
          <select
            value={selectedCurrency}
            onChange={e => setSelectedCurrency(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ocean-300"
          >
            <option value="USD">USD — US Dollar</option>
            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex gap-1">
          {UNITS.map(u => (
            <button key={u} onClick={() => setSelectedUnit(u)}
              className={cn('px-2.5 py-1 rounded-lg text-xs font-medium transition-all',
                selectedUnit === u ? 'bg-ocean-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}>
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* Category Price Items */}
      {(() => {
        const filteredItems = priceCategory === 'all'
          ? ALL_PRICE_ITEMS
          : ALL_PRICE_ITEMS.filter(p => p.category === priceCategory)

        // Group by category for "all" view
        const categories: Array<'frozen-seafood' | 'frozen-value-added' | 'seafood-specials' | 'fresh-seafood'> =
          ['frozen-seafood', 'frozen-value-added', 'seafood-specials', 'fresh-seafood']

        const catLabels: Record<string, string> = {
          'frozen-seafood': 'Frozen Seafood',
          'frozen-value-added': 'Frozen Value Added',
          'seafood-specials': 'Seafood Specials',
          'fresh-seafood': 'Fresh Seafood',
        }

        const renderItemsGrid = (items: PriceItem[], clickable = false) => (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {items.map(item => {
              const chg = item.price - item.prev
              const pct = ((chg / item.prev) * 100).toFixed(1)
              const isUp = chg >= 0
              const cs = CAT_STYLE[item.category]
              const converted = convertPrice(item.price)
              const isSelected = clickable && selectedPriceItem === item.id
              return (
                <Card
                  key={item.id}
                  onClick={() => clickable && setSelectedPriceItem(isSelected ? null : item.id)}
                  className={cn(
                    'p-4 transition-all duration-200 hover:shadow-lg hover:scale-[1.01] border-2',
                    cs.border, cs.bg,
                    clickable && 'cursor-pointer',
                    isSelected && 'ring-2 ring-offset-2 shadow-xl scale-[1.02]',
                    isSelected && `ring-${cs.text.replace('text-', '')}`,
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{item.icon}</span>
                    <div className={cn('text-xs font-bold px-1.5 py-0.5 rounded-full',
                      isUp ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600')}>
                      {isUp ? '▲' : '▼'}{Math.abs(Number(pct))}%
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-slate-600 mb-1 leading-tight line-clamp-2">{item.name}</p>
                  <p className="text-lg font-bold text-slate-900 leading-tight mt-1">
                    {selectedCurrency !== 'USD' ? '' : '$'}{converted >= 100 ? converted.toLocaleString('en-US', {maximumFractionDigits:0}) : converted.toFixed(2)}
                    <span className="text-xs font-normal text-slate-400">/{selectedUnit}</span>
                  </p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <span className="text-[10px] text-slate-400 truncate">{item.origin}</span>
                    <span className="text-slate-200">·</span>
                    <span className="text-[10px] text-slate-400 truncate">{item.processingType}</span>
                  </div>
                  {clickable && (
                    <p className="text-[10px] text-slate-400 mt-1.5 text-center">
                      {isSelected ? '▲ hide chart' : '▼ view trend'}
                    </p>
                  )}
                </Card>
              )
            })}
          </div>
        )

        const renderPriceTrendCharts = (items: PriceItem[]) => {
          const chartsToShow = selectedPriceItem
            ? items.filter(i => i.id === selectedPriceItem)
            : items
          return (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-slate-600" />
                <h3 className="font-bold text-slate-800 text-sm">
                  Annual Price Trend
                  {selectedPriceItem && chartsToShow[0] ? ` — ${chartsToShow[0].name}` : ` — All ${items.length} Products`}
                </h3>
                {selectedPriceItem && (
                  <button
                    onClick={() => setSelectedPriceItem(null)}
                    className="ml-auto text-xs text-slate-400 hover:text-slate-600 underline"
                  >
                    Show all
                  </button>
                )}
              </div>
              <div className={cn(
                'grid gap-4',
                chartsToShow.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'
              )}>
                {chartsToShow.map(item => {
                  const chartColor = CAT_CHART_COLOR[item.category]
                  const isUp = item.price >= item.prev
                  const chartData = item.history.map((v, i) => ({
                    month: HISTORY_MONTHS[i],
                    price: convertPrice(v),
                  }))
                  const pct = (Math.abs((item.price - item.prev) / item.prev) * 100).toFixed(1)
                  return (
                    <Card key={item.id} className="p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <span className="text-2xl mt-0.5">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-slate-900 leading-tight">{item.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{item.origin} · {item.processingType}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-slate-900 text-base">
                            {convertPrice(item.price) >= 100
                              ? `$${convertPrice(item.price).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
                              : formatPrice(convertPrice(item.price))}
                            <span className="text-xs font-normal text-slate-400">/{selectedUnit}</span>
                          </p>
                          <span className={cn('text-xs font-bold', isUp ? 'text-emerald-600' : 'text-red-500')}>
                            {isUp ? '▲' : '▼'} {pct}% vs prev period
                          </span>
                        </div>
                      </div>
                      <ResponsiveContainer width="100%" height={chartsToShow.length === 1 ? 220 : 140}>
                        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id={`cgrad-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={chartColor} stopOpacity={0.25} />
                              <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                          <YAxis
                            tick={{ fontSize: 11, fill: '#94a3b8' }}
                            tickFormatter={(v: number) => v >= 100 ? `$${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}` : `$${v.toFixed(2)}`}
                            width={chartsToShow.length === 1 ? 70 : 56}
                          />
                          <Tooltip
                            formatter={(v: number | undefined) => [
                              v != null
                                ? (v >= 100 ? `$${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}` : `$${v.toFixed(2)}`)
                                : '-',
                              `Price/${selectedUnit}`,
                            ]}
                            contentStyle={{ borderRadius: '10px', fontSize: '12px' }}
                          />
                          <Area
                            type="monotone"
                            dataKey="price"
                            stroke={chartColor}
                            strokeWidth={2.5}
                            fill={`url(#cgrad-${item.id})`}
                            dot={{ fill: chartColor, r: 4, strokeWidth: 0 }}
                            activeDot={{ r: 6 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Card>
                  )
                })}
              </div>
            </div>
          )
        }

        if (priceCategory !== 'all') {
          const cs = CAT_STYLE[priceCategory]
          return (
            <div className="space-y-6">
              <div className={cn('flex items-center gap-3 px-4 py-3 rounded-2xl border-2', cs.border, cs.bg)}>
                <span className="text-2xl">{CAT_ICON[priceCategory]}</span>
                <div>
                  <h2 className={cn('font-bold text-base', cs.text)}>{catLabels[priceCategory]} — Live Prices</h2>
                  <p className="text-xs text-slate-500">{filteredItems.length} products · Click a card to view its price trend · Prices in {selectedCurrency}/{selectedUnit}</p>
                </div>
              </div>
              {renderItemsGrid(filteredItems, true)}
              {renderPriceTrendCharts(filteredItems)}
              {priceCategory === 'fresh-seafood' && <AirFreightRates />}
            </div>
          )
        }

        // "all" view — grouped by category
        return (
          <div className="space-y-8">
            {categories.map(cat => {
              const catItems = ALL_PRICE_ITEMS.filter(p => p.category === cat)
              const cs = CAT_STYLE[cat]
              return (
                <div key={cat} className="space-y-3">
                  <div className={cn('flex items-center gap-2.5 px-3 py-2 rounded-xl border', cs.border, cs.bg)}>
                    <span className="text-xl">{CAT_ICON[cat]}</span>
                    <h3 className={cn('font-bold text-sm', cs.text)}>{catLabels[cat]}</h3>
                    <span className={cn('ml-auto text-xs font-medium px-2 py-0.5 rounded-full', cs.bg, cs.text, 'border', cs.border)}>
                      {catItems.length} items
                    </span>
                  </div>
                  {renderItemsGrid(catItems)}
                </div>
              )
            })}
          </div>
        )
      })()}

      {/* Main Chart + Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                  <span>{spec?.icon}</span>
                  {spec?.label} — Annual Price Trend
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">{selectedData?.description} · {selectedCurrency}/{selectedUnit}</p>
              </div>
              <div className="flex gap-1">
                {['3M', '6M', '12M', '3Y'].map(r => (
                  <button key={r} onClick={() => setTimeRange(r)}
                    className={cn('px-2.5 py-1 rounded-lg text-xs font-medium',
                      timeRange === r ? 'bg-ocean-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {selectedData && (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={selectedData.history.map(h => ({ ...h, price: convertPrice(h.price) }))}>
                  <defs>
                    <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={spec?.color} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={spec?.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }}
                    tickFormatter={(v) => `${v.toFixed(v > 100 ? 0 : 2)}`} />
                  <Tooltip content={<CUSTOM_TOOLTIP />} />
                  <Area type="monotone" dataKey="price" stroke={spec?.color} strokeWidth={2.5}
                    fill="url(#priceGrad)" dot={{ fill: spec?.color, r: 3 }} activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}

            {/* AI Forecast */}
            <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-100">
              <div className="flex items-center gap-1.5 mb-1">
                <Bot className="w-3.5 h-3.5 text-purple-600" />
                <span className="text-xs font-semibold text-purple-900">AI 30-day Price Forecast</span>
              </div>
              <p className="text-xs text-purple-700 leading-relaxed">
                {selectedSpecies === 'salmon' && 'Norwegian supply constraints expected to push prices +4-7% over next 30 days. Recommend forward buying.'}
                {selectedSpecies === 'yellowfin' && 'Maldivian pole-and-line season peak approaching — expect stable-to-firm prices. MSC premium holding.'}
                {selectedSpecies === 'tilapia' && 'Chinese production strong. Prices expected to remain soft (-2 to +1%). Good time for volume contracts.'}
                {selectedSpecies === 'shrimp' && 'Ecuador Q2 harvest above forecast. Prices likely to dip another 2-4% before seasonal Q3 recovery.'}
                {selectedSpecies === 'lobster' && 'Maine season opening strong. Prices expected to climb +5-8% as Chinese pre-holiday buying accelerates.'}
                {selectedSpecies === 'value-added' && 'Value-added segment showing consistent +3-5% annual price growth as convenience demand accelerates globally.'}
              </p>
            </div>
          </Card>
        </div>

        {/* Side: Exchange rates + converter */}
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-ocean-600" />Live Exchange Rates
            </h3>
            <div className="space-y-1.5 max-h-56 overflow-y-auto">
              {Object.entries(EXCHANGE_RATES.rates).map(([currency, rate]) => (
                <div key={currency} className="flex items-center justify-between text-sm py-1 border-b border-slate-50">
                  <span className="font-medium text-slate-700">{currency}</span>
                  <span className="text-slate-900 font-semibold tabular-nums">
                    {rate.toFixed(['JPY', 'KRW', 'VND', 'INR'].includes(currency) ? 0 : 2)}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2">Base: 1 USD · Updated hourly</p>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold text-slate-900 mb-3">Unit Converter</h3>
            <div className="space-y-2">
              <input type="number" placeholder="Enter quantity" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[['MT', '1.000'], ['Short Ton', '1.102'], ['kg', '1,000'], ['lb', '2,204.6']].map(([u, v]) => (
                  <div key={u} className="bg-slate-50 rounded-lg p-2 text-center">
                    <p className="text-slate-500">{u}</p>
                    <p className="font-bold text-slate-900">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Detailed Price Table — filtered by category */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-ocean-600" />
              {priceCategory === 'all' ? 'All Products' : {
                'frozen-seafood': '🧊 Frozen Seafood',
                'frozen-value-added': '⭐ Frozen Value Added',
                'seafood-specials': '🍽️ Seafood Specials',
                'fresh-seafood': '🐟 Fresh Seafood',
              }[priceCategory]} — Detailed Price Table
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {priceCategory === 'all' ? `${ALL_PRICE_ITEMS.length} products` : `${ALL_PRICE_ITEMS.filter(p => p.category === priceCategory).length} products`} · Prices in {selectedCurrency}/{selectedUnit}
            </p>
          </div>
          <Button variant="secondary" size="sm"><Download className="w-4 h-4" />Export</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-2.5 px-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Product</th>
                <th className="text-left py-2.5 px-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Species</th>
                <th className="text-left py-2.5 px-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Origin</th>
                <th className="text-left py-2.5 px-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Processing</th>
                <th className="text-right py-2.5 px-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Price/{selectedUnit}</th>
                <th className="text-right py-2.5 px-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Change</th>
                <th className="text-right py-2.5 px-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Trend</th>
              </tr>
            </thead>
            <tbody>
              {(priceCategory === 'all' ? ALL_PRICE_ITEMS : ALL_PRICE_ITEMS.filter(p => p.category === priceCategory)).map((item) => {
                const chg = item.price - item.prev
                const pct = ((chg / item.prev) * 100).toFixed(1)
                const isUp = chg >= 0
                const converted = convertPrice(item.price)
                const cs = CAT_STYLE[item.category]
                const min = Math.min(...item.history)
                const max = Math.max(...item.history)
                const range = max - min || 1
                return (
                  <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors group">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{item.icon}</span>
                        <span className="font-medium text-slate-900 leading-tight">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium border', cs.bg, cs.text, cs.border)}>
                        {item.speciesGroup}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-sm">{item.origin}</td>
                    <td className="py-3 px-3">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{item.processingType}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">
                      {converted >= 100
                        ? `$${converted.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
                        : formatPrice(converted)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className={cn('text-xs font-semibold', isUp ? 'text-emerald-600' : 'text-red-500')}>
                        {isUp ? '▲' : '▼'} {Math.abs(Number(pct))}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {/* Mini sparkline (SVG) */}
                      <svg width="60" height="20" className="inline-block">
                        <polyline
                          points={item.history.map((v, i) =>
                            `${(i / (item.history.length - 1)) * 58},${18 - ((v - min) / range) * 16}`
                          ).join(' ')}
                          fill="none"
                          stroke={isUp ? '#10b981' : '#ef4444'}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Multi-Species Comparison Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="font-bold text-slate-900 mb-1">Top Species — Global Trade Volume</h2>
          <p className="text-xs text-slate-500 mb-4">Annual volume in million metric tons</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={TOP_SPECIES_TRADE} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={v => `${v}M`} />
              <YAxis type="category" dataKey="species" tick={{ fontSize: 11 }} width={65} />
              <Tooltip formatter={(v) => [`${Number(v).toFixed(1)}M MT`, 'Volume']} contentStyle={{ borderRadius: '12px' }} />
              <Bar dataKey="volume" radius={[0, 6, 6, 0]}>
                {TOP_SPECIES_TRADE.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold text-slate-900 mb-1">{t('page.prices.multiSpec')}</h2>
          <p className="text-xs text-slate-500 mb-4">{t('page.prices.multiSpecSub')} · Note: Lobster ÷5 for scale</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `$${v}`} />
              <Tooltip contentStyle={{ borderRadius: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line type="monotone" dataKey="salmon"    stroke="#f97316" strokeWidth={2} dot={false} name="Salmon" />
              <Line type="monotone" dataKey="yellowfin" stroke="#0ea5e9" strokeWidth={2} dot={false} name="YF Tuna" />
              <Line type="monotone" dataKey="tilapia"   stroke="#059669" strokeWidth={2} dot={false} name="Tilapia" />
              <Line type="monotone" dataKey="shrimp"    stroke="#f43f5e" strokeWidth={2} dot={false} name="Shrimp" />
              <Line type="monotone" dataKey="lobster"   stroke="#dc2626" strokeWidth={2} dot={false} name="Lobster÷5" />
              <Line type="monotone" dataKey="hamachi"   stroke="#8b5cf6" strokeWidth={2} dot={false} name="Hamachi" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Seasons & FAO Fishing Zones */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              🌊 Fishing Seasons &amp; FAO Zones
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">Peak harvest windows and FAO fishing area classifications for the 6 main species</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-slate-200 inline-block" />Off-Season
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded inline-block" style={{ backgroundColor: 'rgba(16,185,129,0.25)' }} />Low
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded inline-block" style={{ backgroundColor: 'rgba(16,185,129,0.6)' }} />Available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded inline-block" style={{ backgroundColor: 'rgba(16,185,129,1)' }} />Peak
            </span>
          </div>
        </div>

        {/* Seasonal Heatmap */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-xs min-w-[700px]">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 text-slate-500 font-semibold w-44">Species</th>
                {MONTHS.map(m => (
                  <th key={m} className="text-center py-2 px-1 text-slate-500 font-semibold w-10">{m}</th>
                ))}
                <th className="text-center py-2 px-3 text-slate-500 font-semibold">Type</th>
              </tr>
            </thead>
            <tbody>
              {SEASON_SPECIES.map(sp => (
                <tr key={sp.id} className="border-t border-slate-50">
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{sp.icon}</span>
                      <span className="font-semibold text-slate-800 text-xs leading-tight">{sp.label}</span>
                    </div>
                  </td>
                  {sp.months.map((level, mi) => {
                    const alphas = [0, 0.22, 0.58, 1.0]
                    const bg = level === 0 ? '#e2e8f0' : hexToRgba(sp.color, alphas[level])
                    const textColor = level >= 2 ? '#fff' : level === 1 ? hexToRgba(sp.color, 0.9) : '#cbd5e1'
                    const icons = ['–', '○', '●', '★']
                    const labels = ['Off-Season', 'Low', 'Available', 'Peak']
                    return (
                      <td key={mi} className="py-2 px-1 text-center">
                        <div
                          className="w-8 h-8 rounded-lg mx-auto flex items-center justify-center font-bold text-sm select-none cursor-default"
                          style={{ backgroundColor: bg, color: textColor }}
                          title={`${sp.label} — ${MONTHS[mi]}: ${labels[level]}`}
                        >
                          {icons[level]}
                        </div>
                      </td>
                    )
                  })}
                  <td className="py-2.5 px-3 text-center">
                    <span className={cn(
                      'text-xs font-semibold px-2 py-0.5 rounded-full',
                      sp.type === 'Farmed' ? 'bg-emerald-50 text-emerald-700' :
                      sp.type === 'Wild'   ? 'bg-sky-50 text-sky-700' :
                                             'bg-amber-50 text-amber-700'
                    )}>
                      {sp.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FAO Zones */}
        <div>
          <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-ocean-600" />
            FAO Fishing Area Classifications
          </h3>
          <div className="space-y-3">
            {SEASON_SPECIES.map(sp => (
              <div key={sp.id} className="flex flex-col sm:flex-row sm:items-start gap-2">
                <div className="flex items-center gap-2 sm:w-44 flex-shrink-0">
                  <span className="text-base">{sp.icon}</span>
                  <span className="text-xs font-semibold text-slate-700">{sp.label}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sp.fao.map(area => (
                    <div
                      key={area.code}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs"
                      style={{ borderColor: hexToRgba(sp.color, 0.35), backgroundColor: hexToRgba(sp.color, 0.06) }}
                    >
                      <span className="font-bold" style={{ color: sp.color }}>{area.code}</span>
                      <span className="text-slate-600 font-medium">{area.name}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-500">{area.note}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Regional Demand */}
      <Card className="p-6">
        <h2 className="font-bold text-slate-900 mb-4">{t('page.prices.regional')}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-2 px-3 text-xs font-bold text-slate-500 uppercase">{t('page.prices.region')}</th>
                <th className="text-center py-2 px-3 text-xs font-bold text-orange-500 uppercase">🐟 Salmon</th>
                <th className="text-center py-2 px-3 text-xs font-bold text-sky-500 uppercase">🐠 YF Tuna</th>
                <th className="text-center py-2 px-3 text-xs font-bold text-emerald-600 uppercase">🐟 Tilapia</th>
                <th className="text-center py-2 px-3 text-xs font-bold text-rose-500 uppercase">🦐 Shrimp</th>
                <th className="text-center py-2 px-3 text-xs font-bold text-red-600 uppercase">🦞 Lobster</th>
                <th className="text-center py-2 px-3 text-xs font-bold text-violet-500 uppercase">🐡 Hamachi</th>
                <th className="text-center py-2 px-3 text-xs font-bold text-violet-600 uppercase">⭐ Value Added</th>
              </tr>
            </thead>
            <tbody>
              {[
                { region: '🇪🇺 Europe',       salmon: '+4.2%', tuna: '+7.1%', tilapia: '+2.8%', shrimp: '+5.3%', lobster: '+3.1%', hamachi: '+14.8%', va: '+9.2%' },
                { region: '🌏 Asia Pacific',  salmon: '+8.7%', tuna: '+12.4%', tilapia: '+6.1%', shrimp: '+9.8%', lobster: '+15.2%', hamachi: '+22.1%', va: '+11.3%' },
                { region: '🌎 Americas',       salmon: '+3.1%', tuna: '+4.2%', tilapia: '+5.8%', shrimp: '+2.4%', lobster: '+1.8%', hamachi: '+19.3%', va: '+7.6%' },
                { region: '🌍 Middle East',    salmon: '+11.3%', tuna: '+8.5%', tilapia: '+14.2%', shrimp: '+13.1%', lobster: '+6.4%', hamachi: '+28.4%', va: '+16.8%' },
              ].map(row => (
                <tr key={row.region} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-medium text-slate-900">{row.region}</td>
                  {[row.salmon, row.tuna, row.tilapia, row.shrimp, row.lobster, row.hamachi, row.va].map((v, i) => (
                    <td key={i} className="py-2.5 px-3 text-center">
                      <span className="text-xs font-bold text-emerald-600">{v}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
