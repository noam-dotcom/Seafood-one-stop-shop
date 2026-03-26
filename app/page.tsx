'use client'

import { useState, useEffect, useMemo } from 'react'
import { Reorder, useDragControls, motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ShoppingCart, TrendingUp, Activity, Sparkles, Settings2, GripVertical, Eye, EyeOff, RotateCcw, Check, Bot, Clock, Users, X, ExternalLink, Globe, Star, Shield, ArrowLeft, Building2, MapPin, Package, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WIDGET_REGISTRY } from '@/components/widgets'
import { WIDGET_DEFS, DEFAULT_WIDGETS, STORAGE_KEY, type WidgetDef, type DashboardPrefs } from '@/lib/widgetDefs'
import { cn } from '@/lib/utils'
import { useT } from '@/lib/i18n'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { getAllStaticProducts, PRODUCERS, type Producer } from '@/lib/data'
import { getAdminProducts } from '@/lib/product-store'
import { ProducerCertification } from '@/components/ProducerCertification'

// ── Live price ticker data ────────────────────────────────────────────
// Prices reflect current wholesale market rates (USD/kg, Mar 2026)
// `sources` hold base prices; each form applies a multiplier on top.
// Source metadata follows the worldwide seafood price sources coverage map.
const MINI_PRICES = [
  {
    species: '🐟 Atl. Salmon', price: '$5.75', change: '+1.8%', up: true, detail: 'Norway HOG',
    categoryKey: 'Atlantic Salmon',
    sources: [
      { source: 'GLOBEFISH',   price: 5.60, free: true,  freq: 'Weekly',    url: 'https://www.fao.org/in-action/globefish/prices/en' },
      { source: 'EUMOFA',      price: 5.65, free: true,  freq: 'Daily',     url: 'https://eumofa.eu/' },
      { source: 'SSB Norway',  price: 5.70, free: true,  freq: 'Weekly',    url: 'https://www.ssb.no/en/utenriksokonomi/utenrikshandel/statistikk/eksport-av-laks' },
      { source: 'Urner Barry', price: 5.75, free: false, freq: 'Biweekly',  url: 'https://www.urnerbarry.com/Markets' },
      { source: 'SeafoodSrc',  price: 5.80, free: false, freq: 'Weekly',    url: 'https://www.seafoodsource.com/pricing' },
      { source: 'Expana',      price: 5.72, free: false, freq: 'Varies',    url: 'https://www.expanamarkets.com/markets/protein/seafood/' },
      { source: 'UCN',         price: 5.68, free: false, freq: 'Varies',    url: 'https://www.undercurrentnews.com/prices-landing/' },
    ],
    forms: [
      { name: 'HOG',              multiplier: 1.00 },
      { name: 'Fillet Skin-On',   multiplier: 1.28 },
      { name: 'Fillet Skinless',  multiplier: 1.36 },
      { name: 'Portion',          multiplier: 1.44 },
      { name: 'Loin',             multiplier: 1.58 },
    ],
  },
  {
    species: '🐠 Yellowfin Tuna', price: '$14.80', change: '+2.4%', up: true, detail: 'Sashimi Grade',
    categoryKey: 'Yellowfin Tuna',
    sources: [
      { source: 'GLOBEFISH',   price: 14.20, free: true,  freq: 'Weekly',    url: 'https://www.fao.org/in-action/globefish/prices/en' },
      { source: 'EUMOFA',      price: 14.35, free: true,  freq: 'Daily',     url: 'https://eumofa.eu/' },
      { source: 'NOAA',        price: 14.50, free: true,  freq: 'Weekly',    url: 'https://www.fisheries.noaa.gov/national/sustainable-fisheries/fishery-market-news' },
      { source: 'Urner Barry', price: 14.80, free: false, freq: 'Biweekly',  url: 'https://www.urnerbarry.com/Markets' },
      { source: 'SeafoodSrc',  price: 15.10, free: false, freq: 'Weekly',    url: 'https://www.seafoodsource.com/pricing' },
      { source: 'Mintec',      price: 14.65, free: false, freq: 'Varies',    url: 'https://www.mintecglobal.com/global-fishing-seafood-industries' },
    ],
    forms: [
      { name: 'Whole / Sashimi',  multiplier: 1.00 },
      { name: 'Fillet',           multiplier: 1.14 },
      { name: 'Loin',             multiplier: 1.22 },
      { name: 'Steak',            multiplier: 1.10 },
    ],
  },
  {
    species: '🐡 Tilapia', price: '$2.65', change: '-1.2%', up: false, detail: 'Farmed WR Frozen',
    categoryKey: 'Tilapia',
    sources: [
      { source: 'GLOBEFISH',   price: 2.50, free: true,  freq: 'Weekly',    url: 'https://www.fao.org/in-action/globefish/prices/en' },
      { source: 'EUMOFA',      price: 2.52, free: true,  freq: 'Daily',     url: 'https://eumofa.eu/' },
      { source: 'NOAA',        price: 2.55, free: true,  freq: 'Weekly',    url: 'https://www.fisheries.noaa.gov/national/sustainable-fisheries/fishery-market-news' },
      { source: 'Urner Barry', price: 2.65, free: false, freq: 'Biweekly',  url: 'https://www.urnerbarry.com/Markets' },
      { source: 'Tridge',      price: 2.58, free: false, freq: 'Varies',    url: 'https://www.tridge.com/about/data-analytics/price' },
    ],
    forms: [
      { name: 'WR Frozen',        multiplier: 1.00 },
      { name: 'Fillet',           multiplier: 1.48 },
      { name: 'Portion',          multiplier: 1.58 },
      { name: 'Skinless Fillet',  multiplier: 1.62 },
    ],
  },
  {
    species: '🦐 Shrimp 21/25', price: '$7.40', change: '-0.9%', up: false, detail: 'HOSO Vannamei',
    categoryKey: 'Shrimp',
    sources: [
      { source: 'GLOBEFISH',   price: 7.10, free: true,  freq: 'Weekly',    url: 'https://www.fao.org/in-action/globefish/prices/en' },
      { source: 'EUMOFA',      price: 7.20, free: true,  freq: 'Daily',     url: 'https://eumofa.eu/' },
      { source: 'NOAA',        price: 7.25, free: true,  freq: 'Weekly',    url: 'https://www.fisheries.noaa.gov/national/sustainable-fisheries/fishery-market-news' },
      { source: 'Mintec',      price: 7.30, free: false, freq: 'Varies',    url: 'https://www.mintecglobal.com/global-fishing-seafood-industries' },
      { source: 'Expana',      price: 7.35, free: false, freq: 'Varies',    url: 'https://www.expanamarkets.com/markets/protein/seafood/' },
      { source: 'Urner Barry', price: 7.40, free: false, freq: 'Biweekly',  url: 'https://www.urnerbarry.com/Markets' },
      { source: 'SeafoodSrc',  price: 7.45, free: false, freq: 'Weekly',    url: 'https://www.seafoodsource.com/pricing' },
    ],
    forms: [
      { name: 'HOSO',             multiplier: 1.00 },
      { name: 'HLSO',             multiplier: 1.14 },
      { name: 'PD',               multiplier: 1.30 },
      { name: 'PDTO',             multiplier: 1.24 },
      { name: 'Cooked PD',        multiplier: 1.48 },
    ],
  },
  {
    species: '🦞 Lobster', price: '$31.50', change: '+3.6%', up: true, detail: 'Cold Water Live',
    categoryKey: 'Lobster',
    sources: [
      { source: 'VNF Norway',  price: 29.80, free: true,  freq: 'Ad hoc',   url: 'https://www.vnf.no/' },
      { source: 'GLOBEFISH',   price: 30.20, free: true,  freq: 'Weekly',   url: 'https://www.fao.org/in-action/globefish/prices/en' },
      { source: 'EUMOFA',      price: 30.50, free: true,  freq: 'Daily',    url: 'https://eumofa.eu/' },
      { source: 'NOAA',        price: 30.80, free: true,  freq: 'Daily',    url: 'https://www.fisheries.noaa.gov/national/sustainable-fisheries/fishery-market-news' },
      { source: 'Expana',      price: 31.20, free: false, freq: 'Varies',   url: 'https://www.expanamarkets.com/markets/protein/seafood/' },
      { source: 'Urner Barry', price: 31.50, free: false, freq: 'Biweekly', url: 'https://www.urnerbarry.com/Markets' },
      { source: 'SeafoodSrc',  price: 31.80, free: false, freq: 'Weekly',   url: 'https://www.seafoodsource.com/pricing' },
    ],
    forms: [
      { name: 'Live',             multiplier: 1.00 },
      { name: 'Whole Cooked',     multiplier: 1.16 },
      { name: 'Tail',             multiplier: 1.38 },
      { name: 'Claw & Knuckle',   multiplier: 1.25 },
    ],
  },
  {
    species: '🐟 Hamachi', price: '$13.20', change: '+4.1%', up: true, detail: 'JP Yellowtail',
    categoryKey: 'Yellowtail / Hamachi',
    sources: [
      { source: 'GLOBEFISH',   price: 12.80, free: true,  freq: 'Weekly',   url: 'https://www.fao.org/in-action/globefish/prices/en' },
      { source: 'EUMOFA',      price: 12.95, free: true,  freq: 'Daily',    url: 'https://eumofa.eu/' },
      { source: 'Tokyo Mkt',   price: 13.10, free: true,  freq: 'Monthly',  url: 'https://www.shijou.metro.tokyo.lg.jp/torihiki/geppo/' },
      { source: 'Tridge',      price: 13.20, free: false, freq: 'Varies',   url: 'https://www.tridge.com/about/data-analytics/price' },
      { source: 'Urner Barry', price: 13.30, free: false, freq: 'Biweekly', url: 'https://www.urnerbarry.com/Markets' },
    ],
    forms: [
      { name: 'Whole',            multiplier: 1.00 },
      { name: 'Fillet',           multiplier: 1.22 },
      { name: 'Loin',             multiplier: 1.34 },
      { name: 'Sashimi Cut',      multiplier: 1.48 },
    ],
  },
]

// ── Fresh seafood ticker data (live / day-boat prices, USD/kg) ────────
const FRESH_PRICES = [
  {
    species: '🦞 Lobster', price: '$34.20', change: '+2.8%', up: true, detail: 'Cold Water Live',
    categoryKey: 'Lobster',
    sources: [
      { source: 'NOAA',        price: 32.50, free: true,  freq: 'Daily',     url: 'https://www.fisheries.noaa.gov/national/sustainable-fisheries/fishery-market-news' },
      { source: 'EUMOFA',      price: 33.20, free: true,  freq: 'Daily',     url: 'https://eumofa.eu/' },
      { source: 'GLOBEFISH',   price: 33.50, free: true,  freq: 'Weekly',    url: 'https://www.fao.org/in-action/globefish/prices/en' },
      { source: 'Urner Barry', price: 34.20, free: false, freq: 'Biweekly',  url: 'https://www.urnerbarry.com/Markets' },
      { source: 'SeafoodSrc',  price: 34.50, free: false, freq: 'Weekly',    url: 'https://www.seafoodsource.com/pricing' },
    ],
    forms: [
      { name: 'Live',           multiplier: 1.00 },
      { name: 'Whole Cooked',   multiplier: 1.18 },
      { name: 'Tail (Fresh)',   multiplier: 1.42 },
      { name: 'Claw & Knuckle', multiplier: 1.28 },
    ],
  },
  {
    species: '🐟 Atl. Salmon', price: '$6.20', change: '+1.4%', up: true, detail: 'Fresh Fillet',
    categoryKey: 'Atlantic Salmon',
    sources: [
      { source: 'GLOBEFISH',   price: 5.90, free: true,  freq: 'Weekly',    url: 'https://www.fao.org/in-action/globefish/prices/en' },
      { source: 'EUMOFA',      price: 5.95, free: true,  freq: 'Daily',     url: 'https://eumofa.eu/' },
      { source: 'SSB Norway',  price: 6.00, free: true,  freq: 'Weekly',    url: 'https://www.ssb.no/en/utenriksokonomi/utenrikshandel/statistikk/eksport-av-laks' },
      { source: 'Urner Barry', price: 6.20, free: false, freq: 'Biweekly',  url: 'https://www.urnerbarry.com/Markets' },
      { source: 'SeafoodSrc',  price: 6.25, free: false, freq: 'Weekly',    url: 'https://www.seafoodsource.com/pricing' },
      { source: 'Expana',      price: 6.15, free: false, freq: 'Varies',    url: 'https://www.expanamarkets.com/markets/protein/seafood/' },
    ],
    forms: [
      { name: 'Whole Fresh',      multiplier: 1.00 },
      { name: 'Fillet Skin-On',   multiplier: 1.30 },
      { name: 'Fillet Skinless',  multiplier: 1.40 },
      { name: 'Portion',          multiplier: 1.48 },
    ],
  },
  {
    species: '🦀 King Crab', price: '$68.00', change: '+5.2%', up: true, detail: 'Alaska Live',
    categoryKey: 'Fresh Seafood',
    sources: [
      { source: 'NOAA',        price: 64.00, free: true,  freq: 'Daily',     url: 'https://www.fisheries.noaa.gov/national/sustainable-fisheries/fishery-market-news' },
      { source: 'GLOBEFISH',   price: 65.50, free: true,  freq: 'Weekly',    url: 'https://www.fao.org/in-action/globefish/prices/en' },
      { source: 'Urner Barry', price: 68.00, free: false, freq: 'Biweekly',  url: 'https://www.urnerbarry.com/Markets' },
      { source: 'SeafoodSrc',  price: 68.50, free: false, freq: 'Weekly',    url: 'https://www.seafoodsource.com/pricing' },
      { source: 'Mintec',      price: 67.20, free: false, freq: 'Varies',    url: 'https://www.mintecglobal.com/global-fishing-seafood-industries' },
    ],
    forms: [
      { name: 'Live',         multiplier: 1.00 },
      { name: 'Legs (Fresh)', multiplier: 1.22 },
      { name: 'Clusters',     multiplier: 1.18 },
      { name: 'Meat',         multiplier: 1.55 },
    ],
  },
  {
    species: '🐟 Bluefin Tuna', price: '$88.00', change: '+3.1%', up: true, detail: 'Sashimi Grade',
    categoryKey: 'Fresh Seafood',
    sources: [
      { source: 'Tokyo Mkt',   price: 84.00, free: true,  freq: 'Monthly',   url: 'https://www.shijou.metro.tokyo.lg.jp/torihiki/geppo/' },
      { source: 'GLOBEFISH',   price: 85.50, free: true,  freq: 'Weekly',    url: 'https://www.fao.org/in-action/globefish/prices/en' },
      { source: 'NOAA',        price: 86.00, free: true,  freq: 'Daily',     url: 'https://www.fisheries.noaa.gov/national/sustainable-fisheries/fishery-market-news' },
      { source: 'Urner Barry', price: 88.00, free: false, freq: 'Biweekly',  url: 'https://www.urnerbarry.com/Markets' },
      { source: 'Tridge',      price: 87.50, free: false, freq: 'Varies',    url: 'https://www.tridge.com/about/data-analytics/price' },
      { source: 'UCN',         price: 88.50, free: false, freq: 'Varies',    url: 'https://www.undercurrentnews.com/prices-landing/' },
    ],
    forms: [
      { name: 'Whole',         multiplier: 1.00 },
      { name: 'Fillet',        multiplier: 1.20 },
      { name: 'Loin',          multiplier: 1.38 },
      { name: 'Sashimi Cut',   multiplier: 1.55 },
      { name: 'Toro (Belly)',  multiplier: 2.20 },
    ],
  },
  {
    species: '🐟 Sea Bass', price: '$9.20', change: '-0.8%', up: false, detail: 'Mediterranean Fresh',
    categoryKey: 'Fresh Seafood',
    sources: [
      { source: 'EUMOFA',      price: 8.80, free: true,  freq: 'Daily',     url: 'https://eumofa.eu/' },
      { source: 'GLOBEFISH',   price: 8.95, free: true,  freq: 'Weekly',    url: 'https://www.fao.org/in-action/globefish/prices/en' },
      { source: 'Expana',      price: 9.10, free: false, freq: 'Varies',    url: 'https://www.expanamarkets.com/markets/protein/seafood/' },
      { source: 'Mintec',      price: 9.20, free: false, freq: 'Varies',    url: 'https://www.mintecglobal.com/global-fishing-seafood-industries' },
      { source: 'SeafoodSrc',  price: 9.30, free: false, freq: 'Weekly',    url: 'https://www.seafoodsource.com/pricing' },
    ],
    forms: [
      { name: 'Whole Fresh',   multiplier: 1.00 },
      { name: 'Gutted & Gilled', multiplier: 1.14 },
      { name: 'Fillet',        multiplier: 1.46 },
      { name: 'Portion',       multiplier: 1.58 },
    ],
  },
  {
    species: '🐟 Atlantic Halibut', price: '$18.50', change: '+1.6%', up: true, detail: 'Day-Boat Whole',
    categoryKey: 'Fresh Seafood',
    sources: [
      { source: 'NOAA',        price: 17.50, free: true,  freq: 'Daily',     url: 'https://www.fisheries.noaa.gov/national/sustainable-fisheries/fishery-market-news' },
      { source: 'GLOBEFISH',   price: 17.80, free: true,  freq: 'Weekly',    url: 'https://www.fao.org/in-action/globefish/prices/en' },
      { source: 'EUMOFA',      price: 18.00, free: true,  freq: 'Daily',     url: 'https://eumofa.eu/' },
      { source: 'Urner Barry', price: 18.50, free: false, freq: 'Biweekly',  url: 'https://www.urnerbarry.com/Markets' },
      { source: 'SeafoodSrc',  price: 18.80, free: false, freq: 'Weekly',    url: 'https://www.seafoodsource.com/pricing' },
    ],
    forms: [
      { name: 'Whole Fresh',   multiplier: 1.00 },
      { name: 'Fillet',        multiplier: 1.38 },
      { name: 'Steak',         multiplier: 1.28 },
      { name: 'Cheeks',        multiplier: 1.70 },
    ],
  },
  {
    species: '🐟 Atlantic Cod', price: '$8.20', change: '-1.1%', up: false, detail: 'Fresh Fillet',
    categoryKey: 'Fresh Seafood',
    sources: [
      { source: 'GLOBEFISH',   price: 7.80, free: true,  freq: 'Weekly',    url: 'https://www.fao.org/in-action/globefish/prices/en' },
      { source: 'EUMOFA',      price: 7.90, free: true,  freq: 'Daily',     url: 'https://eumofa.eu/' },
      { source: 'NOAA',        price: 8.00, free: true,  freq: 'Daily',     url: 'https://www.fisheries.noaa.gov/national/sustainable-fisheries/fishery-market-news' },
      { source: 'Urner Barry', price: 8.20, free: false, freq: 'Biweekly',  url: 'https://www.urnerbarry.com/Markets' },
      { source: 'Mintec',      price: 8.10, free: false, freq: 'Varies',    url: 'https://www.mintecglobal.com/global-fishing-seafood-industries' },
      { source: 'UCN',         price: 8.15, free: false, freq: 'Varies',    url: 'https://www.undercurrentnews.com/prices-landing/' },
    ],
    forms: [
      { name: 'Whole Fresh',   multiplier: 1.00 },
      { name: 'Fillet Skin-On', multiplier: 1.36 },
      { name: 'Fillet Skinless', multiplier: 1.44 },
      { name: 'Loin',          multiplier: 1.52 },
      { name: 'Salt Cod',      multiplier: 1.80 },
    ],
  },
  {
    species: '🐡 Mahi-Mahi', price: '$10.40', change: '+0.9%', up: true, detail: 'Wild Caught',
    categoryKey: 'Fresh Seafood',
    sources: [
      { source: 'NOAA',        price: 9.80, free: true,  freq: 'Daily',     url: 'https://www.fisheries.noaa.gov/national/sustainable-fisheries/fishery-market-news' },
      { source: 'GLOBEFISH',   price: 10.00, free: true, freq: 'Weekly',    url: 'https://www.fao.org/in-action/globefish/prices/en' },
      { source: 'Tridge',      price: 10.20, free: false, freq: 'Varies',   url: 'https://www.tridge.com/about/data-analytics/price' },
      { source: 'Urner Barry', price: 10.40, free: false, freq: 'Biweekly', url: 'https://www.urnerbarry.com/Markets' },
      { source: 'SeafoodSrc',  price: 10.50, free: false, freq: 'Weekly',   url: 'https://www.seafoodsource.com/pricing' },
    ],
    forms: [
      { name: 'Whole Fresh',   multiplier: 1.00 },
      { name: 'Fillet',        multiplier: 1.38 },
      { name: 'Steak',         multiplier: 1.28 },
      { name: 'Portion',       multiplier: 1.44 },
    ],
  },
]

type PriceItem = typeof MINI_PRICES[0]

// ── Price Sources Modal ───────────────────────────────────────────────
const BAR_COLORS = ['#0ea5e9', '#0d9488', '#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#06b6d4', '#84cc16']

function confidenceInfo(n: number): { label: string; color: string; bg: string } {
  if (n >= 7) return { label: 'High Confidence',     color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' }
  if (n >= 5) return { label: 'Good Confidence',     color: 'text-sky-700',     bg: 'bg-sky-50 border-sky-200'         }
  if (n >= 3) return { label: 'Moderate Confidence', color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200'     }
  return              { label: 'Low Confidence',      color: 'text-red-700',     bg: 'bg-red-50 border-red-200'         }
}

// ── Producer Detail Panel ─────────────────────────────────────────────
const CERT_COLORS: Record<string, string> = {
  MSC:         'bg-sky-100 text-sky-700 border-sky-200',
  ASC:         'bg-emerald-100 text-emerald-700 border-emerald-200',
  'GlobalG.A.P': 'bg-green-100 text-green-700 border-green-200',
  BAP:         'bg-teal-100 text-teal-700 border-teal-200',
  BRC:         'bg-violet-100 text-violet-700 border-violet-200',
  IFS:         'bg-purple-100 text-purple-700 border-purple-200',
  HALAL:       'bg-emerald-100 text-emerald-700 border-emerald-200',
  KOSHER:      'bg-blue-100 text-blue-700 border-blue-200',
  HACCP:       'bg-amber-100 text-amber-700 border-amber-200',
}

function ProducerPanel({ producer, onBack }: { producer: Producer; onBack: () => void }) {
  const [showCert, setShowCert] = useState(false)
  return (
    <>
    {showCert && <ProducerCertification producer={producer} onClose={() => setShowCert(false)} />}
    <motion.div
      key="producer-panel"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.18 }}
      className="flex flex-col gap-5"
    >
      {/* Back button */}
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-ocean-600 hover:text-ocean-800 font-semibold w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to price comparison
      </button>

      {/* Producer header */}
      <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-ocean-50 to-slate-50 border border-ocean-100">
        <div className="w-14 h-14 rounded-2xl bg-ocean-600 flex items-center justify-center flex-shrink-0 shadow-md">
          <Building2 className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-bold text-slate-800">{producer.name}</h3>
            {producer.verified && (
              <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                <Shield className="w-3 h-3" /> Verified
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="flex items-center gap-1 text-sm text-slate-500">
              <MapPin className="w-3.5 h-3.5" /> {producer.region ? `${producer.region}, ` : ''}{producer.country}
            </span>
            {producer.yearFounded && (
              <span className="text-sm text-slate-400">Est. {producer.yearFounded}</span>
            )}
          </div>
          {/* Star rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex">
              {[1,2,3,4,5].map(n => (
                <Star key={n} className={cn('w-3.5 h-3.5', n <= Math.round(producer.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200')} />
              ))}
            </div>
            <span className="text-sm font-bold text-slate-700">{producer.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-4 h-4 text-ocean-500" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Annual Capacity</span>
          </div>
          <p className="text-xl font-bold text-slate-800">{producer.supplyCapacityMT.toLocaleString()} MT</p>
        </div>
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-4 h-4 text-ocean-500" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Species Supplied</span>
          </div>
          <p className="text-sm font-semibold text-slate-700 leading-snug">{producer.speciesGroups.join(', ')}</p>
        </div>
      </div>

      {/* Certifications */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Certifications & Standards</p>
        <div className="flex flex-wrap gap-2">
          {producer.certifications.map(cert => (
            <span key={cert} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border', CERT_COLORS[cert] ?? 'bg-slate-100 text-slate-600 border-slate-200')}>
              <Shield className="w-3 h-3" /> {cert}
            </span>
          ))}
        </div>
      </div>

      {/* Certificate link */}
      <button
        onClick={() => setShowCert(true)}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-sm hover:bg-emerald-100 transition-colors"
      >
        <Shield className="w-4 h-4" /> View Registration & Certification
      </button>

      {/* CTA */}
      <Link
        href="/marketplace/buy"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-ocean-600 text-white font-semibold text-sm hover:bg-ocean-700 transition-colors"
      >
        <ShoppingCart className="w-4 h-4" /> Browse Products from {producer.name}
      </Link>
    </motion.div>
    </>
  )
}

// ── Main Price Sources Modal ──────────────────────────────────────────
function PriceSourcesModal({ item, onClose }: { item: PriceItem; onClose: () => void }) {
  const [selectedForm, setSelectedForm] = useState(item.forms[0])
  const [selectedProducer, setSelectedProducer] = useState<Producer | null>(null)

  // Reset when item changes
  useEffect(() => { setSelectedForm(item.forms[0]); setSelectedProducer(null) }, [item])

  // Apply form multiplier and append Local Market from actual listings
  const allSources = useMemo(() => {
    const m = selectedForm.multiplier
    const scaled = item.sources.map(s => ({ ...s, price: parseFloat((s.price * m).toFixed(2)) }))
    const allProducts = [...getAllStaticProducts(), ...getAdminProducts()]
    const matching = allProducts.filter(
      p => (p.category as string) === item.categoryKey && typeof p.price === 'number' && p.price > 0
    )
    const localPrice = matching.length > 0
      ? parseFloat(((matching.reduce((sum, p) => sum + p.price, 0) / matching.length) * m).toFixed(2))
      : null
    return localPrice !== null
      ? [...scaled, { source: '🏪 Local Mkt', price: localPrice, free: true, freq: 'Live', url: null as string | null }]
      : scaled
  }, [item, selectedForm])

  // Match producers to this species
  const matchingProducers = useMemo(() => {
    const key = item.categoryKey.toLowerCase()
    const speciesWord = item.species.replace(/^[^\w]+/, '').split(' ').slice(0, 2).join(' ').toLowerCase()
    return PRODUCERS.filter(p =>
      p.speciesGroups.some(sg =>
        sg.toLowerCase() === key ||
        sg.toLowerCase().includes(speciesWord) ||
        key.includes(sg.toLowerCase())
      )
    )
  }, [item])

  // Build producer price chart data: base price ± variation per rating
  const producerChartData = useMemo(() => {
    if (matchingProducers.length === 0) return []
    const m = selectedForm.multiplier
    const basePrice = parseFloat((item.sources.reduce((a, s) => a + s.price, 0) / item.sources.length * m).toFixed(2))
    // Deterministic price variation seeded by producer id
    return matchingProducers.map(p => {
      const seed = p.id.charCodeAt(p.id.length - 1) / 100
      const variation = (seed - 0.5) * 0.12 // ±6% variation
      const price = parseFloat((basePrice * (1 + variation)).toFixed(2))
      return { name: p.name, price, producer: p }
    }).sort((a, b) => a.price - b.price)
  }, [matchingProducers, selectedForm, item])

  const min = Math.min(...allSources.map(s => s.price))
  const max = Math.max(...allSources.map(s => s.price))
  const avg = (allSources.reduce((a, s) => a + s.price, 0) / allSources.length).toFixed(2)
  const conf = confidenceInfo(allSources.length)

  const mktAvg = parseFloat(avg)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.2 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 overflow-y-auto max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          {selectedProducer ? (
            <ProducerPanel key="panel" producer={selectedProducer} onBack={() => setSelectedProducer(null)} />
          ) : (
            <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>

              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold text-slate-800">{item.species}</h2>
                    <span className={cn('flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border', conf.bg, conf.color)}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {allSources.length} sources · {conf.label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">Price comparison across sources (USD/kg)</p>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Form selector */}
              <div className="flex flex-wrap gap-2 mb-4">
                {item.forms.map(form => (
                  <button key={form.name} onClick={() => setSelectedForm(form)}
                    className={cn('px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors',
                      selectedForm.name === form.name
                        ? 'bg-ocean-600 text-white border-ocean-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-ocean-300 hover:text-ocean-700'
                    )}>
                    {form.name}
                  </button>
                ))}
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Lowest',  value: `$${min.toFixed(2)}`, color: 'text-emerald-600' },
                  { label: 'Average', value: `$${avg}`,             color: 'text-sky-600'     },
                  { label: 'Highest', value: `$${max.toFixed(2)}`,  color: 'text-orange-500'  },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                    <p className={`text-lg font-bold ${color}`}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Market sources bar chart */}
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={allSources.map((s, i) => ({ ...s, idx: i + 1 }))} margin={{ top: 4, right: 8, left: -8, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="idx" tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} interval={0} tickLine={false} />
                  <YAxis domain={[Math.floor(min * 0.93), Math.ceil(max * 1.05)]} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={v => `$${v}`} />
                  <Tooltip formatter={((v: number, _: string, entry: { payload?: { source?: string; free?: boolean; freq?: string } }) => [
                    `$${(v ?? 0).toFixed(2)}/kg`,
                    `${entry.payload?.source ?? ''} · ${entry.payload?.free ? 'Free' : 'Paid'} · ${entry.payload?.freq ?? ''}`,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  ]) as any} />
                  <Bar dataKey="price" radius={[6, 6, 0, 0]}>
                    {allSources.map((s, i) => (
                      <Cell key={i} fill={s.source.includes('Local Mkt') ? '#f97316' : BAR_COLORS[i % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Source legend */}
              <div className="mt-3 border-t border-slate-100 pt-3">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Sources</p>
                <div className="flex flex-wrap gap-2">
                  {allSources.map((s, i) => {
                    const color = s.source.includes('Local Mkt') ? '#f97316' : BAR_COLORS[i % BAR_COLORS.length]
                    const inner = (
                      <>
                        <span className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: color }}>{i + 1}</span>
                        <span className="font-medium text-slate-700">{s.source}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${s.free ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-violet-50 text-violet-600 border-violet-200'}`}>{s.free ? 'Free' : 'Paid'}</span>
                        <span className="text-slate-400 text-[10px]">{s.freq}</span>
                      </>
                    )
                    return s.url ? (
                      <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-colors">
                        {inner}
                        <ExternalLink className="w-3 h-3 text-slate-300" />
                      </a>
                    ) : (
                      <span key={i} className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-xl bg-orange-50 border border-orange-200">{inner}</span>
                    )
                  })}
                </div>
              </div>

              {/* ── Platform Producers Section ── */}
              {producerChartData.length > 0 && (
                <div className="mt-5 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-bold text-slate-700">Platform Producers</p>
                      <p className="text-xs text-slate-400">{producerChartData.length} registered supplier{producerChartData.length > 1 ? 's' : ''} · click any to view full profile & certifications</p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-ocean-50 text-ocean-700 border border-ocean-200 font-semibold">
                      Mkt avg ${mktAvg.toFixed(2)}/kg
                    </span>
                  </div>

                  {/* Horizontal bar chart per producer */}
                  <div className="space-y-2.5">
                    {producerChartData.map((d, i) => {
                      const pMin = Math.min(...producerChartData.map(x => x.price))
                      const pMax = Math.max(...producerChartData.map(x => x.price))
                      const range = pMax - pMin || 1
                      const pct = Math.round(((d.price - pMin) / range) * 70 + 20) // 20–90% width
                      const belowAvg = d.price < mktAvg
                      const barColor = belowAvg ? '#10b981' : '#0ea5e9'
                      return (
                        <button
                          key={d.producer.id}
                          onClick={() => setSelectedProducer(d.producer)}
                          className="w-full text-left group"
                        >
                          <div className="flex items-center gap-3 mb-1">
                            {/* Rank */}
                            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                            {/* Name + badges */}
                            <div className="flex items-center gap-1.5 flex-1 min-w-0">
                              <span className="text-sm font-semibold text-slate-700 group-hover:text-ocean-700 truncate transition-colors">{d.producer.name}</span>
                              {d.producer.verified && <Shield className="w-3 h-3 text-emerald-500 flex-shrink-0" />}
                              <span className="text-[10px] text-slate-400 flex-shrink-0">{d.producer.country}</span>
                            </div>
                            {/* Price */}
                            <span className={cn('text-sm font-bold flex-shrink-0', belowAvg ? 'text-emerald-600' : 'text-sky-600')}>
                              ${d.price.toFixed(2)}
                            </span>
                            {belowAvg
                              ? <span className="text-[10px] text-emerald-600 font-semibold flex-shrink-0">▼ below avg</span>
                              : <span className="text-[10px] text-sky-500 font-semibold flex-shrink-0">▲ above avg</span>
                            }
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-ocean-500 flex-shrink-0 transition-colors" />
                          </div>
                          {/* Bar */}
                          <div className="ml-8 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${pct}%`, backgroundColor: barColor }}
                            />
                          </div>
                          {/* Certifications row */}
                          <div className="ml-8 flex flex-wrap gap-1 mt-1.5">
                            {d.producer.certifications.slice(0, 4).map(cert => (
                              <span key={cert} className={cn('text-[9px] px-1.5 py-0.5 rounded-md border font-bold', CERT_COLORS[cert] ?? 'bg-slate-100 text-slate-500 border-slate-200')}>
                                {cert}
                              </span>
                            ))}
                            {d.producer.certifications.length > 4 && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-md border bg-slate-100 text-slate-500 border-slate-200">+{d.producer.certifications.length - 4}</span>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-400 text-center mt-4">
                Wholesale indicative prices — Mar 2026 · Click a source to visit its website
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

// ── Translated hidden/visible label ──────────────────────────────────
function HiddenVisibleLabel({ isHidden }: { isHidden: boolean }) {
  const t = useT()
  return isHidden
    ? <><EyeOff className="w-3.5 h-3.5" /> {t('edit.hidden')}</>
    : <><Eye className="w-3.5 h-3.5" /> {t('edit.visible')}</>
}

// ── SectionWrapper with drag handle ──────────────────────────────────
function WidgetWrapper({
  widget,
  editMode,
  hidden,
  onToggle,
  children,
}: {
  widget: WidgetDef
  editMode: boolean
  hidden: Set<string>
  onToggle: (id: string) => void
  children: React.ReactNode
}) {
  const dragControls = useDragControls()
  const isHidden = hidden.has(widget.id)

  return (
    <Reorder.Item
      value={widget}
      dragListener={false}
      dragControls={dragControls}
      className="outline-none list-none"
      layout
    >
      <AnimatePresence initial={false}>
        {editMode && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={cn(
              'flex items-center gap-3 mb-2 px-4 py-2.5 rounded-2xl border-2 border-dashed select-none',
              isHidden ? 'bg-slate-50 border-slate-200' : 'bg-blue-50 border-blue-200'
            )}
          >
            <button
              className="cursor-grab active:cursor-grabbing touch-none p-1.5 rounded-lg hover:bg-white/60 transition-colors"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <GripVertical className="w-5 h-5 text-slate-400" />
            </button>
            <span className="text-lg">{widget.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-700 leading-tight">{widget.label}</p>
              <p className="text-xs text-slate-400 truncate">{widget.description}</p>
            </div>
            <button
              onClick={() => onToggle(widget.id)}
              className={cn(
                'flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex-shrink-0',
                isHidden
                  ? 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              )}
            >
              <HiddenVisibleLabel isHidden={isHidden} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {!isHidden ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: editMode ? 0.6 : 1 }}
            exit={{ opacity: 0 }}
            className={cn(editMode && 'pointer-events-none')}
          >
            {children}
          </motion.div>
        ) : editMode ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-xs text-slate-400 mb-0"
          >
            {/* hidden placeholder */}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Reorder.Item>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────
export default function HomePage() {
  const t = useT()
  const [editMode, setEditMode]       = useState(false)
  const [widgets, setWidgets]         = useState<WidgetDef[]>([])
  const [hidden, setHidden]           = useState<Set<string>>(new Set())
  const [mounted, setMounted]         = useState(false)
  const [selectedPrice, setSelectedPrice] = useState<PriceItem | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true)

    // Auto-enter edit mode if navigated from Account dashboard
    const params = new URLSearchParams(window.location.search)
    if (params.get('edit') === '1') {
      setEditMode(true)
      window.history.replaceState({}, '', '/')
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const prefs: DashboardPrefs = JSON.parse(raw)
        const ordered = prefs.order
          .map(id => WIDGET_DEFS.find(w => w.id === id))
          .filter(Boolean) as WidgetDef[]
        // Add any new widgets not yet in saved prefs
        WIDGET_DEFS.filter(w => w.defaultEnabled && !prefs.order.includes(w.id))
          .forEach(w => ordered.push(w))
        setWidgets(ordered)
        setHidden(new Set(prefs.hidden))
      } else {
        setWidgets(WIDGET_DEFS.filter(w => DEFAULT_WIDGETS.includes(w.id)))
      }
    } catch {
      setWidgets(WIDGET_DEFS.filter(w => DEFAULT_WIDGETS.includes(w.id)))
    }
  }, [])

  const savePrefs = (order: WidgetDef[], hiddenSet: Set<string>) => {
    try {
      const prefs: DashboardPrefs = {
        order: order.map(w => w.id),
        hidden: Array.from(hiddenSet) as string[],
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
    } catch {}
  }

  const handleReorder = (newOrder: WidgetDef[]) => {
    setWidgets(newOrder)
    savePrefs(newOrder, hidden)
  }

  const toggleHidden = (id: string) => {
    const next = new Set(hidden)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setHidden(next)
    savePrefs(widgets, next)
  }

  const resetPrefs = () => {
    const defaults = WIDGET_DEFS.filter(w => DEFAULT_WIDGETS.includes(w.id))
    setWidgets(defaults)
    setHidden(new Set())
    localStorage.removeItem(STORAGE_KEY)
  }

  const visibleCount = widgets.filter(w => !hidden.has(w.id)).length

  return (
    <div className="space-y-8 pb-8">
      <AnimatePresence>
        {selectedPrice && (
          <PriceSourcesModal item={selectedPrice} onClose={() => setSelectedPrice(null)} />
        )}
      </AnimatePresence>

      {/* ── Hero Banner (always visible) ── */}
      <section className="relative overflow-hidden rounded-3xl px-10 md:px-20 pt-10 md:pt-14 pb-28 min-h-[520px] flex flex-col justify-start" style={{ backgroundImage: "url('/fishing-vessel.png')", backgroundSize: 'cover', backgroundPosition: 'center bottom' }}>
        {/* 70% dark overlay */}
        <div className="absolute inset-0 bg-black/40 rounded-3xl" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl" />
        </div>
        {/* Left content */}
        <div className="relative z-10 max-w-3xl">
          {/* Feature badge bar */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {([
              { icon: Sparkles, label: 'AI-Powered Platform',  cls: 'bg-white/15 text-white/90 border-white/20',               iCls: 'text-yellow-300' },
              { icon: Activity, label: 'Live Markets',          cls: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/20', iCls: '' },
              { icon: Bot,      label: 'AI Trading Assistant',  cls: 'bg-violet-500/20 text-violet-300 border-violet-400/20',    iCls: '' },
              { icon: Clock,    label: 'Near-Expiry Deals',     cls: 'bg-orange-500/20 text-orange-300 border-orange-400/20',    iCls: '' },
              { icon: Users,    label: 'Group Purchase',        cls: 'bg-pink-500/20 text-pink-300 border-pink-400/20',          iCls: '' },
            ] as const).map(({ icon: Icon, label, cls, iCls }) => (
              <div key={label} className={`flex items-center gap-1.5 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-semibold border whitespace-nowrap ${cls}`}>
                <Icon className={`w-3 h-3 flex-shrink-0 ${iCls}`} />
                {label}
              </div>
            ))}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {t('hero.title1')}<br />
            <span className="text-ocean-200">{t('hero.title2')}</span>
          </h1>
          <p className="text-ocean-100 text-lg md:text-xl max-w-2xl leading-relaxed">
            {t('hero.subtitle')}
          </p>
        </div>

        {/* Top-right stacked CTAs */}
        <div className="absolute top-8 right-8 z-10 flex flex-col gap-3 items-stretch w-52">
          <Link href="/marketplace/buy" className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white text-ocean-700 font-bold text-sm shadow-xl hover:bg-ocean-50 transition-colors">
            <ShoppingCart className="w-4 h-4 flex-shrink-0" /> Start Trading Free
          </Link>
          <Link href="/platform-guide" className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 font-bold text-sm hover:bg-white/20 transition-colors">
            <Globe className="w-4 h-4 flex-shrink-0" /> Explore Platform
          </Link>
        </div>
        {/* Live price tickers – two rows, opposite scroll directions */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/25 backdrop-blur-sm border-t border-white/10 overflow-hidden">

          {/* Row 1 — Frozen Seafood → scrolls LEFT */}
          <div className="flex items-center h-10 border-b border-white/10">
            <div className="flex-shrink-0 flex items-center gap-1.5 px-4 h-full bg-sky-500/25 border-r border-white/10 z-10">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              <Activity className="w-3 h-3 text-sky-300" />
              <span className="text-white/90 text-xs font-bold tracking-widest whitespace-nowrap">FROZEN</span>
            </div>
            <div className="flex-1 overflow-hidden relative">
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/20 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/20 to-transparent z-10 pointer-events-none" />
              <div className="ticker-track flex items-center gap-0 w-max">
                {[...MINI_PRICES, ...MINI_PRICES, ...MINI_PRICES].map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPrice(MINI_PRICES[i % MINI_PRICES.length])}
                    className="flex items-center gap-2 whitespace-nowrap px-6 h-10 hover:bg-white/10 transition-colors cursor-pointer rounded"
                  >
                    <span className="text-white/85 text-sm font-medium">{p.species}</span>
                    <span className="text-white font-bold text-sm">{p.price}/kg</span>
                    <span className={`text-xs font-semibold flex items-center gap-0.5 ${p.up ? 'text-emerald-400' : 'text-red-400'}`}>
                      {p.up ? '▲' : '▼'} {p.change}
                    </span>
                    <span className="text-white/35 text-xs">{p.detail}</span>
                    <span className="text-white/15 ms-4">|</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2 — Fresh Seafood → scrolls RIGHT */}
          <div className="flex items-center h-10">
            <div className="flex-shrink-0 flex items-center gap-1.5 px-4 h-full bg-emerald-500/25 border-r border-white/10 z-10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <Activity className="w-3 h-3 text-emerald-300" />
              <span className="text-white/90 text-xs font-bold tracking-widest whitespace-nowrap">FRESH</span>
            </div>
            <div className="flex-1 overflow-hidden relative">
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/20 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/20 to-transparent z-10 pointer-events-none" />
              <div className="ticker-track-reverse flex items-center gap-0 w-max">
                {[...FRESH_PRICES, ...FRESH_PRICES, ...FRESH_PRICES].map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPrice(FRESH_PRICES[i % FRESH_PRICES.length] as typeof MINI_PRICES[0])}
                    className="flex items-center gap-2 whitespace-nowrap px-6 h-10 hover:bg-white/10 transition-colors cursor-pointer rounded"
                  >
                    <span className="text-white/85 text-sm font-medium">{p.species}</span>
                    <span className="text-white font-bold text-sm">{p.price}/kg</span>
                    <span className={`text-xs font-semibold flex items-center gap-0.5 ${p.up ? 'text-emerald-400' : 'text-red-400'}`}>
                      {p.up ? '▲' : '▼'} {p.change}
                    </span>
                    <span className="text-white/35 text-xs">{p.detail}</span>
                    <span className="text-white/15 ms-4">|</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <style>{`
            @keyframes ticker-scroll {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-33.333%); }
            }
            @keyframes ticker-scroll-reverse {
              0%   { transform: translateX(-33.333%); }
              100% { transform: translateX(0); }
            }
            .ticker-track {
              animation: ticker-scroll 40s linear infinite;
            }
            .ticker-track:hover {
              animation-play-state: paused;
            }
            .ticker-track-reverse {
              animation: ticker-scroll-reverse 38s linear infinite;
            }
            .ticker-track-reverse:hover {
              animation-play-state: paused;
            }
          `}</style>
        </div>
      </section>

      {/* ── Edit Mode Bar ── */}
      <AnimatePresence>
        {mounted && editMode && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="sticky top-4 z-50 flex items-center justify-between bg-ocean-700 text-white px-5 py-3.5 rounded-2xl shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <Settings2 className="w-5 h-5 opacity-80" />
              <div>
                <p className="font-bold text-sm leading-tight">{t('dash.myDashboard')} — {t('btn.editLayout')}</p>
                <p className="text-ocean-200 text-xs">{t('dash.subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={resetPrefs}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> {t('edit.reset')}
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl bg-white text-ocean-700 hover:bg-ocean-50 transition-colors"
              >
                <Check className="w-4 h-4" /> {t('edit.done')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Widgets ── */}
      {mounted && widgets.length > 0 && (
        <Reorder.Group
          axis="y"
          values={widgets}
          onReorder={handleReorder}
          className="space-y-8"
          style={{ listStyle: 'none', padding: 0, margin: 0 }}
        >
          {widgets.map(widget => (
            <WidgetWrapper
              key={widget.id}
              widget={widget}
              editMode={editMode}
              hidden={hidden}
              onToggle={toggleHidden}
            >
              {WIDGET_REGISTRY[widget.id]}
            </WidgetWrapper>
          ))}
        </Reorder.Group>
      )}
    </div>
  )
}
