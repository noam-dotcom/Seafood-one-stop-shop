export type WidgetCategory = 'prices' | 'news' | 'market' | 'marketplace' | 'tools'

export interface WidgetDef {
  id: string
  category: WidgetCategory
  label: string
  description: string
  icon: string
  defaultEnabled: boolean
}

export const WIDGET_CATEGORIES: { id: WidgetCategory; label: string; icon: string }[] = [
  { id: 'prices',      label: 'Price Intelligence', icon: '📈' },
  { id: 'news',        label: 'News & Insights',    icon: '📰' },
  { id: 'market',      label: 'Market Data',         icon: '🌐' },
  { id: 'marketplace', label: 'Marketplace',          icon: '🛒' },
  { id: 'tools',       label: 'Tools & Resources',   icon: '🔧' },
]

export const WIDGET_DEFS: WidgetDef[] = [
  // ── Prices ───────────────────────────────────────────────
  {
    id: 'price-salmon',
    category: 'prices',
    label: 'Salmon Prices',
    description: 'Live price card + 12-month trend chart for Atlantic Salmon',
    icon: '🐟',
    defaultEnabled: false,
  },
  {
    id: 'price-tuna',
    category: 'prices',
    label: 'Yellowfin Tuna Prices',
    description: 'Live price card + trend chart for Yellowfin Tuna',
    icon: '🐠',
    defaultEnabled: false,
  },
  {
    id: 'price-shrimp',
    category: 'prices',
    label: 'Shrimp Prices',
    description: 'Live price card + trend chart for Vannamei Shrimp',
    icon: '🦐',
    defaultEnabled: false,
  },
  {
    id: 'price-lobster',
    category: 'prices',
    label: 'Lobster Prices',
    description: 'Live price card + trend chart for Lobster',
    icon: '🦞',
    defaultEnabled: false,
  },
  {
    id: 'price-tilapia',
    category: 'prices',
    label: 'Tilapia Prices',
    description: 'Live price card + trend chart for Tilapia',
    icon: '🐡',
    defaultEnabled: false,
  },
  {
    id: 'price-hamachi',
    category: 'prices',
    label: 'Yellowtail / Hamachi Prices',
    description: 'Live price card + 12-month trend chart for Yellowtail / Hamachi',
    icon: '🐡',
    defaultEnabled: false,
  },
  {
    id: 'price-value-added',
    category: 'prices',
    label: 'Value Added Prices',
    description: 'Price index for processed & value added seafood',
    icon: '⭐',
    defaultEnabled: false,
  },
  {
    id: 'price-comparison',
    category: 'prices',
    label: 'Multi-Species Chart',
    description: 'Compare all 7 species price trends on one chart',
    icon: '📊',
    defaultEnabled: true,
  },
  {
    id: 'price-trade-volume',
    category: 'prices',
    label: 'Global Trade Volume',
    description: 'Annual trade volume & value by species',
    icon: '📦',
    defaultEnabled: false,
  },
  {
    id: 'seasonal-calendar',
    category: 'prices',
    label: 'Seasonal Calendar',
    description: 'Fishing seasons & peak availability heatmap',
    icon: '📅',
    defaultEnabled: false,
  },

  // ── News ─────────────────────────────────────────────────
  {
    id: 'news-latest',
    category: 'news',
    label: 'Latest News',
    description: 'Most recent industry news & updates',
    icon: '📰',
    defaultEnabled: true,
  },
  {
    id: 'news-ai-briefing',
    category: 'news',
    label: 'AI Weekly Briefing',
    description: 'AI-generated weekly market intelligence summary',
    icon: '🤖',
    defaultEnabled: false,
  },
  {
    id: 'news-prices',
    category: 'news',
    label: 'Price Intelligence News',
    description: 'News focused on market prices & trade data',
    icon: '💹',
    defaultEnabled: false,
  },
  {
    id: 'news-regulation',
    category: 'news',
    label: 'Regulatory Updates',
    description: 'Import/export regulations, compliance & policy changes',
    icon: '⚖️',
    defaultEnabled: false,
  },
  {
    id: 'news-aquaculture',
    category: 'news',
    label: 'Aquaculture News',
    description: 'Farming, sustainability & production updates',
    icon: '🌊',
    defaultEnabled: false,
  },

  // ── Market ───────────────────────────────────────────────
  {
    id: 'ai-signals',
    category: 'market',
    label: 'AI Trading Signals',
    description: 'AI-powered buy/sell recommendations with confidence score',
    icon: '🎯',
    defaultEnabled: true,
  },
  {
    id: 'market-stats',
    category: 'market',
    label: 'Platform Stats',
    description: 'Live platform metrics: members, listings, trade volume',
    icon: '📉',
    defaultEnabled: true,
  },
  {
    id: 'trust',
    category: 'market',
    label: 'Trust & Security',
    description: 'Platform safety, verification & escrow protection info',
    icon: '🛡️',
    defaultEnabled: true,
  },

  // ── Marketplace ──────────────────────────────────────────
  {
    id: 'marketplace-tiles',
    category: 'marketplace',
    label: 'Quick Access Tiles',
    description: 'Fast navigation to Buy, Sell, Prices, News, Knowledge & Recipes',
    icon: '🗂️',
    defaultEnabled: true,
  },
  {
    id: 'marketplace-deals',
    category: 'marketplace',
    label: 'Smart Features',
    description: 'Near-expiry deals (50% guaranteed) & group container buying',
    icon: '⚡',
    defaultEnabled: true,
  },

  // ── Tools ────────────────────────────────────────────────
  {
    id: 'exchange-rates',
    category: 'tools',
    label: 'Exchange Rates',
    description: 'Live currency conversion for 18+ major trade currencies',
    icon: '💱',
    defaultEnabled: false,
  },
  {
    id: 'recipes',
    category: 'tools',
    label: 'Recipes',
    description: 'Chef-crafted recipes with trade cost & margin analysis',
    icon: '🍽️',
    defaultEnabled: false,
  },
  {
    id: 'knowledge',
    category: 'tools',
    label: 'Knowledge Center',
    description: 'Industry guides, videos & processing insights',
    icon: '📚',
    defaultEnabled: false,
  },
]

// Explicit ordered list matching the original homepage layout
export const DEFAULT_WIDGETS = [
  'market-stats',        // Platform Stats
  'marketplace-tiles',   // Navigation Tiles
  'ai-signals',          // AI Trading Signals
  'price-comparison',    // Multi-Species Chart
  'news-latest',         // Latest News
  'trust',               // Trust & Security
  'marketplace-deals',   // Smart Features CTA
]

export const STORAGE_KEY = 'seafood-dashboard-prefs-v2'

export interface DashboardPrefs {
  order: string[]
  hidden: string[]
}
