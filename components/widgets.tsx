'use client'

import Link from 'next/link'
import {
  TrendingUp, TrendingDown, AlertCircle, Bot, Activity, ArrowRight,
  ShoppingCart, BarChart3, Newspaper, BookOpen, ChefHat, Users,
  Package, DollarSign, Globe2, Shield, CheckCircle2, Zap, Bell,
  Star, Clock, ExternalLink, Heart, RefreshCw
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PRICE_DATA, AI_INSIGHTS, NEWS_ARTICLES, TOP_SPECIES_TRADE, RECIPES, EXCHANGE_RATES } from '@/lib/data'
import { cn } from '@/lib/utils'
import { useT } from '@/lib/i18n'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend
} from 'recharts'

// ── Helpers ───────────────────────────────────────────────────────────

function PriceChange({ change, pct }: { change: number; pct: number }) {
  const up = change >= 0
  return (
    <span className={cn('flex items-center gap-0.5 text-xs font-semibold', up ? 'text-emerald-600' : 'text-red-500')}>
      {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {up ? '+' : ''}{pct.toFixed(1)}%
    </span>
  )
}

// ── Individual Species Price Widget ──────────────────────────────────

interface SpeciesPriceWidgetProps {
  speciesId: 'salmon' | 'yellowfin' | 'tilapia' | 'shrimp' | 'lobster' | 'value-added' | 'hamachi'
  label: string
  icon: string
  color: string
  gradientFrom: string
  gradientTo: string
}

export function SpeciesPriceWidget({ speciesId, label, icon, color, gradientFrom, gradientTo }: SpeciesPriceWidgetProps) {
  const t = useT()
  const data = (PRICE_DATA as Record<string, typeof PRICE_DATA.salmon>)[speciesId]
  if (!data) return null

  const change = data.current - data.previous
  const pct = (change / data.previous) * 100
  const chartData = data.history.map((p: { month: string; price: number }) => ({ month: p.month, price: p.price }))

  return (
    <Card className="p-5 overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center text-2xl shadow-md`}>
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-slate-900">{label}</h3>
            <p className="text-xs text-slate-500">{data.description}</p>
          </div>
        </div>
        <Link href="/prices">
          <Button variant="ghost" size="sm" className="text-xs">
            {t('btn.fullChart')} <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </Link>
      </div>

      <div className="flex items-end gap-4 mb-4">
        <div>
          <p className="text-3xl font-bold text-slate-900">${data.current.toFixed(2)}</p>
          <p className="text-xs text-slate-500 mt-0.5">{t('w.perKgUSD')}</p>
        </div>
        <div className="mb-1">
          <PriceChange change={change} pct={pct} />
          <p className="text-xs text-slate-400">{t('w.vsLastMonth')}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-sm font-semibold text-slate-700">{data.volume}</p>
          <p className="text-xs text-slate-400">{t('w.annualVol')}</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={100}>
        <AreaChart data={chartData} margin={{ top: 2, right: 2, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`grad-${speciesId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.25} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis domain={['auto', 'auto']} hide />
          <Tooltip
            formatter={(v: number | string | undefined) => [`$${Number(v).toFixed(2)}/kg`]}
            contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: 12 }}
          />
          <Area type="monotone" dataKey="price" stroke={color} strokeWidth={2} fill={`url(#grad-${speciesId})`} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}

// ── All 6 species price widgets ─────────────────────────────────────

export function SalmonPriceWidget() {
  return <SpeciesPriceWidget speciesId="salmon" label="Atlantic Salmon" icon="🐟" color="#f97316" gradientFrom="from-orange-400" gradientTo="to-orange-600" />
}
export function TunaPriceWidget() {
  return <SpeciesPriceWidget speciesId="yellowfin" label="Yellowfin Tuna" icon="🐠" color="#0ea5e9" gradientFrom="from-sky-400" gradientTo="to-sky-600" />
}
export function ShrimpPriceWidget() {
  return <SpeciesPriceWidget speciesId="shrimp" label="Vannamei Shrimp" icon="🦐" color="#f43f5e" gradientFrom="from-rose-400" gradientTo="to-rose-600" />
}
export function LobsterPriceWidget() {
  return <SpeciesPriceWidget speciesId="lobster" label="Lobster" icon="🦞" color="#dc2626" gradientFrom="from-red-400" gradientTo="to-red-600" />
}
export function TilapiaPriceWidget() {
  return <SpeciesPriceWidget speciesId="tilapia" label="Tilapia" icon="🐡" color="#059669" gradientFrom="from-emerald-400" gradientTo="to-emerald-600" />
}
export function HamachiPriceWidget() {
  return <SpeciesPriceWidget speciesId="hamachi" label="Yellowtail / Hamachi" icon="🐟" color="#8b5cf6" gradientFrom="from-violet-400" gradientTo="to-violet-600" />
}
export function ValueAddedPriceWidget() {
  return <SpeciesPriceWidget speciesId="value-added" label="Value Added Seafood" icon="⭐" color="#7c3aed" gradientFrom="from-violet-400" gradientTo="to-violet-600" />
}

// ── Multi-Species Comparison Chart ──────────────────────────────────

export function PriceComparisonWidget() {
  const t = useT()
  const salmon  = PRICE_DATA.salmon.history
  const tuna    = PRICE_DATA.yellowfin.history
  const shrimp  = PRICE_DATA.shrimp.history
  const tilapia = PRICE_DATA.tilapia.history
  const lobster = PRICE_DATA.lobster.history
  const hamachi = (PRICE_DATA as Record<string, typeof PRICE_DATA.salmon>).hamachi?.history ?? []

  const chartData = salmon.map((s: { month: string; price: number }, i: number) => ({
    month:    s.month,
    Salmon:   s.price,
    Tuna:     tuna[i]?.price,
    Shrimp:   shrimp[i]?.price,
    Tilapia:  tilapia[i]?.price,
    Lobster:  lobster[i]?.price,
    Hamachi:  hamachi[i]?.price,
  }))

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{t('w.priceComp')}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{t('w.priceComp.sub')}</p>
        </div>
        <Link href="/prices"><Button variant="outline" size="sm">{t('btn.fullDashboard')}</Button></Link>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} domain={['auto', 'auto']} />
          <Tooltip
            formatter={(v: number | string | undefined, name: string | undefined) => [`$${Number(v).toFixed(2)}/kg`, name ?? '']}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
          />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          <Line type="monotone" dataKey="Salmon"  stroke="#f97316" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Tuna"    stroke="#0ea5e9" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Shrimp"  stroke="#f43f5e" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Tilapia" stroke="#059669" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Lobster" stroke="#dc2626" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Hamachi" stroke="#8b5cf6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}

// ── Trade Volume Chart ───────────────────────────────────────────────

export function TradeVolumeWidget() {
  const t = useT()
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{t('w.tradeVol')}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{t('w.tradeVol.sub')}</p>
        </div>
        <Link href="/prices"><Button variant="outline" size="sm">{t('btn.fullDashboard')}</Button></Link>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={TOP_SPECIES_TRADE} layout="vertical" margin={{ left: 10, right: 30 }}>
          <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}M`} />
          <YAxis type="category" dataKey="species" tick={{ fontSize: 12 }} width={55} />
          <Tooltip
            formatter={(v: number | string | undefined) => [`${Number(v).toFixed(1)}M MT`]}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
          />
          <Bar dataKey="volume" radius={[0, 6, 6, 0]}>
            {TOP_SPECIES_TRADE.map((e: { color: string }, i: number) => <Cell key={i} fill={e.color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

// ── Seasonal Calendar ────────────────────────────────────────────────

const SEASONS = [
  { species: '🐟 Salmon',    type: 'Farmed', months: [3,3,3,3,3,3,3,3,3,3,3,3] },
  { species: '🐠 Yellowfin', type: 'Wild',   months: [2,2,3,3,3,2,2,2,3,3,2,1] },
  { species: '🐡 Tilapia',   type: 'Farmed', months: [3,3,3,3,3,3,3,3,3,3,3,3] },
  { species: '🦐 Shrimp',    type: 'Mixed',  months: [2,2,1,1,2,3,3,3,2,2,2,2] },
  { species: '🦞 Lobster',   type: 'Wild',   months: [1,1,0,0,1,2,3,3,3,2,1,1] },
  { species: '🐡 Hamachi',   type: 'Farmed', months: [2,2,3,3,3,3,2,2,2,3,3,2] },
]
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const SEASON_LABEL: Record<number, { label: string; bg: string; text: string }> = {
  0: { label: 'Off',   bg: 'bg-slate-100',   text: 'text-slate-300' },
  1: { label: 'Low',   bg: 'bg-sky-100',     text: 'text-sky-500'   },
  2: { label: 'Avail', bg: 'bg-emerald-100', text: 'text-emerald-600' },
  3: { label: 'Peak',  bg: 'bg-emerald-500', text: 'text-white'     },
}

export function SeasonalCalendarWidget() {
  const t = useT()
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{t('w.seasonal')}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{t('w.seasonal.sub')}</p>
        </div>
        <div className="flex items-center gap-2">
          {[0,1,2,3].map(v => (
            <span key={v} className={`text-xs px-2 py-0.5 rounded-full ${SEASON_LABEL[v].bg} ${SEASON_LABEL[v].text}`}>
              {SEASON_LABEL[v].label}
            </span>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left text-slate-500 font-medium pb-2 pr-4 w-28">Species</th>
              {MONTHS_SHORT.map(m => (
                <th key={m} className="text-center text-slate-400 font-medium pb-2 px-0.5">{m}</th>
              ))}
            </tr>
          </thead>
          <tbody className="space-y-1">
            {SEASONS.map((row) => (
              <tr key={row.species}>
                <td className="pr-4 py-1 text-slate-700 font-medium whitespace-nowrap">{row.species}</td>
                {row.months.map((val, i) => {
                  const s = SEASON_LABEL[val]
                  return (
                    <td key={i} className="px-0.5 py-1">
                      <div className={`w-full h-6 rounded ${s.bg} flex items-center justify-center ${s.text} font-bold text-[9px]`}>
                        {val === 3 ? '★' : val === 2 ? '●' : val === 1 ? '○' : '–'}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

// ── Exchange Rates ───────────────────────────────────────────────────

export function ExchangeRatesWidget() {
  const t = useT()
  const currencies = EXCHANGE_RATES?.rates ? Object.entries(EXCHANGE_RATES.rates).slice(0, 12) : []
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{t('w.rates')}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{t('w.rates.sub')}</p>
        </div>
        <RefreshCw className="w-4 h-4 text-slate-400" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {currencies.map(([code, rate]) => (
          <div key={code} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl">
            <span className="text-sm font-semibold text-slate-700">{code}</span>
            <span className="text-sm text-slate-500">{typeof rate === 'number' ? rate.toFixed(3) : rate}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── News Widgets ─────────────────────────────────────────────────────

interface NewsWidgetProps {
  title: string
  subtitle: string
  filterCategory?: string
  maxItems?: number
}

function NewsWidget({ title, subtitle, filterCategory, maxItems = 3 }: NewsWidgetProps) {
  const t = useT()
  const articles = filterCategory
    ? NEWS_ARTICLES.filter((a: { category: string }) => a.category === filterCategory).slice(0, maxItems)
    : NEWS_ARTICLES.slice(0, maxItems)

  if (articles.length === 0) return null

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-amber-600" />
          <div>
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
        </div>
        <Link href="/news"><Button variant="ghost" size="sm" iconRight={<ArrowRight className="w-4 h-4" />}>{t('btn.viewAll')}</Button></Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {articles.map((article: {
          id: string; image: string; sentiment: string; category: string;
          title: string; summary: string; source: string; readTime: number; aiSummary?: string
        }) => (
          <Card key={article.id} className="p-5" hover>
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl">{article.image}</span>
              <div className="flex-1 min-w-0">
                <Badge variant={article.sentiment === 'positive' ? 'success' : article.sentiment === 'alert' ? 'warning' : 'default'} className="mb-2">
                  {article.category}
                </Badge>
                <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug">{article.title}</h3>
              </div>
            </div>
            <p className="text-xs text-slate-500 line-clamp-2 mb-3">{article.summary}</p>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{article.source}</span>
              <span>{article.readTime} {t('w.minRead')}</span>
            </div>
            {article.aiSummary && (
              <div className="mt-3 p-3 bg-ocean-50 rounded-xl border border-ocean-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <Bot className="w-3 h-3 text-ocean-600" />
                  <span className="text-xs font-semibold text-ocean-700">{t('w.aiInsight')}</span>
                </div>
                <p className="text-xs text-ocean-600 line-clamp-2">{article.aiSummary}</p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </section>
  )
}

export function LatestNewsWidget() {
  const t = useT()
  return <NewsWidget title={t('w.news')} subtitle={t('w.news.sub')} />
}
export function PricesNewsWidget() {
  return <NewsWidget title="Price Intelligence News" subtitle="Market prices & trade data" filterCategory="Prices" />
}
export function RegulationNewsWidget() {
  return <NewsWidget title="Regulatory Updates" subtitle="Import/export regulations & policy" filterCategory="Regulation" />
}
export function AquacultureNewsWidget() {
  return <NewsWidget title="Aquaculture News" subtitle="Farming, sustainability & production" filterCategory="Aquaculture" />
}

// ── AI Weekly Briefing ───────────────────────────────────────────────

export function AIBriefingWidget() {
  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-ocean-600 via-ocean-700 to-teal-700 p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/15 rounded-xl"><Bot className="w-5 h-5 text-white" /></div>
            <div>
              <h2 className="font-bold text-white">AI Weekly Briefing</h2>
              <p className="text-ocean-200 text-xs">Week of Mar 3–7, 2026</p>
            </div>
          </div>
          <Badge className="bg-yellow-400/20 text-yellow-200 border-yellow-400/30">New</Badge>
        </div>
        <div className="space-y-3 text-sm text-white/90">
          <p>🐟 <strong>Salmon:</strong> Norwegian HOG prices surged 8.2% this week on reduced Chile supply. Buy window closing — consider forward contracts for Q2.</p>
          <p>🦐 <strong>Shrimp:</strong> Ecuador hit a record export quarter. Spot prices stable at $7.20/kg but futures signal a 3-5% dip by May.</p>
          <p>⚖️ <strong>Regulation:</strong> EU Digital Product Passport enforcement begins April 1. Ensure all suppliers have traceability docs ready.</p>
          <p>💡 <strong>Alpha move:</strong> Tilapia demand in MENA is growing 12% YoY. Source now from Egypt before regional buyers lock up Q3 inventory.</p>
        </div>
      </div>
    </Card>
  )
}

// ── AI Trading Signals ───────────────────────────────────────────────

export function AISignalsWidget() {
  const t = useT()
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Bot className="w-5 h-5 text-ocean-600" />
        <h2 className="text-lg font-bold text-slate-900">{t('w.aiSignals')}</h2>
        <Badge variant="ocean">{t('w.aiSignals.live')}</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {AI_INSIGHTS.map((insight: {
          title: string; type: string; color: string; confidence: number; message: string; action: string
        }) => (
          <Card key={insight.title} className="p-4" hover>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${insight.color === 'emerald' ? 'bg-emerald-50' : insight.color === 'amber' ? 'bg-amber-50' : 'bg-ocean-50'}`}>
                {insight.type === 'buying_opportunity'
                  ? <TrendingDown className={`w-4 h-4 ${insight.color === 'emerald' ? 'text-emerald-600' : 'text-ocean-600'}`} />
                  : insight.type === 'sell_alert'
                    ? <TrendingUp className="w-4 h-4 text-amber-600" />
                    : <AlertCircle className="w-4 h-4 text-ocean-600" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold text-slate-900">{insight.title}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${insight.confidence >= 85 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {insight.confidence}%
                  </span>
                </div>
                <p className="text-xs text-slate-500">{insight.message}</p>
                <button className={`mt-2 text-xs font-semibold ${insight.color === 'emerald' ? 'text-emerald-600' : insight.color === 'amber' ? 'text-amber-600' : 'text-ocean-600'} hover:underline`}>
                  {insight.action} →
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ── Platform Stats ───────────────────────────────────────────────────

export function PlatformStatsWidget() {
  const stats = [
    { label: 'Active Members', value: '48,200+', icon: Users,   color: 'text-ocean-600',   bg: 'bg-ocean-50'   },
    { label: 'Active Listings', value: '12,450', icon: Package,  color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Monthly Trade',   value: '$2.4B',   icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Countries Active', value: '87',    icon: Globe2,   color: 'text-amber-600',   bg: 'bg-amber-50'   },
  ]
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map(stat => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="p-4 text-center">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-2`}>
              <Icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
          </Card>
        )
      })}
    </section>
  )
}

// ── Navigation Tiles ─────────────────────────────────────────────────

const NAV_TILES = [
  { title: 'Buy Seafood',       subtitle: 'Source from 3,800+ verified suppliers', href: '/marketplace/buy',   icon: ShoppingCart, gradient: 'from-ocean-600 to-ocean-800',   accent: 'bg-ocean-500',   badge: '12,450 listings', stats: '87 countries', emoji: '🟦' },
  { title: 'Sell Seafood',      subtitle: 'List products, reach global buyers',    href: '/marketplace/sell',  icon: TrendingUp,   gradient: 'from-emerald-600 to-teal-700',  accent: 'bg-emerald-500', badge: 'Anonymous option', stats: 'AI pricing', emoji: '🟩' },
  { title: 'Group Buy',         subtitle: 'Split containers, save on freight',    href: '/marketplace/group-buy', icon: Users,    gradient: 'from-rose-500 to-pink-700',     accent: 'bg-rose-500',    badge: 'Save up to 40%', stats: 'Active deals', emoji: '🤝' },
  { title: 'News & Insights',   subtitle: 'AI-curated industry intelligence',      href: '/news',              icon: Newspaper,    gradient: 'from-amber-500 to-orange-700',  accent: 'bg-amber-500',   badge: 'AI summaries', stats: 'Daily', emoji: '📰' },
  { title: 'Knowledge Center',  subtitle: 'Guides, videos & processing insights', href: '/knowledge',         icon: BookOpen,     gradient: 'from-sky-600 to-cyan-700',      accent: 'bg-sky-500',     badge: '500+ resources', stats: 'Expert', emoji: '📚' },
  { title: 'Seafood Prices',    subtitle: 'Real-time global price intelligence',   href: '/prices',            icon: BarChart3,    gradient: 'from-violet-600 to-purple-800', accent: 'bg-violet-500',  badge: 'Live data', stats: '50+ species', emoji: '📊' },
]

export function MarketplaceTilesWidget() {
  const t = useT()
  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t('w.platformHub')}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{t('w.platformHub.sub')}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {NAV_TILES.map(tile => {
          const Icon = tile.icon
          return (
            <Link key={tile.href} href={tile.href} className="block group">
              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${tile.gradient} p-6 h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${tile.accent}/30 backdrop-blur-sm border border-white/20`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl">{tile.emoji}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{tile.title}</h3>
                  <p className="text-white/75 text-sm mb-4">{tile.subtitle}</p>
                  <div className="flex items-center justify-between">
                    <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full">{tile.badge}</span>
                    <div className="flex items-center gap-1 text-white/80 text-sm group-hover:translate-x-1 transition-transform">
                      <span className="text-xs">{tile.stats}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

// ── Smart Features (Near-Expiry + Group Buy) ─────────────────────────

export function SmartFeaturesWidget() {
  const t = useT()
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-600 rounded-xl shadow-md"><Zap className="w-6 h-6 text-white" /></div>
          <div>
            <h3 className="font-bold text-slate-900 mb-1">{t('w.nearExpiry')}</h3>
            <p className="text-sm text-slate-600">{t('w.nearExpiry.desc')}</p>
            <Link href="/marketplace/sell">
              <Button variant="primary" size="sm" className="mt-3 bg-emerald-600 hover:bg-emerald-700">{t('btn.postExpiry')}</Button>
            </Link>
          </div>
        </div>
      </Card>
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-100">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-600 rounded-xl shadow-md"><Users className="w-6 h-6 text-white" /></div>
          <div>
            <h3 className="font-bold text-slate-900 mb-1">{t('w.groupBuy')}</h3>
            <p className="text-sm text-slate-600">{t('w.groupBuy.desc')}</p>
            <Button variant="primary" size="sm" className="mt-3 bg-purple-600 hover:bg-purple-700">{t('btn.joinGroup')}</Button>
          </div>
        </div>
      </Card>
    </section>
  )
}

// ── Trust & Security ────────────────────────────────────────────────

export function TrustWidget() {
  const t = useT()
  const TRUST_ITEMS = [
    { icon: Shield,       title: t('w.trust.verified'),  desc: 'Every supplier undergoes multi-step KYC' },
    { icon: CheckCircle2, title: t('w.trust.escrow'),    desc: 'Funds secured until delivery confirmed' },
    { icon: Globe2,       title: t('w.trust.compliance'),desc: 'Trade regulation guidance for 87+ countries' },
    { icon: Bot,          title: t('w.trust.ai'),        desc: 'Smart algorithms connect optimal pairs' },
  ]
  return (
    <section className="bg-gradient-to-br from-slate-900 to-ocean-900 rounded-3xl p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">{t('w.trust.title')}</h2>
        <p className="text-slate-400">{t('w.trust.sub')}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {TRUST_ITEMS.map(item => {
          const Icon = item.icon
          return (
            <div key={item.title} className="text-center p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-ocean-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Icon className="w-6 h-6 text-ocean-300" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
              <p className="text-xs text-slate-400">{item.desc}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ── Recipes ──────────────────────────────────────────────────────────

export function RecipesWidget() {
  const t = useT()
  const featured = RECIPES ? RECIPES.slice(0, 3) : []
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ChefHat className="w-5 h-5 text-rose-500" />
          <h2 className="text-lg font-bold text-slate-900">{t('w.featuredRecipes')}</h2>
        </div>
        <Link href="/recipes"><Button variant="ghost" size="sm" iconRight={<ArrowRight className="w-4 h-4" />}>{t('btn.allRecipes')}</Button></Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {featured.map((r: {
          id: string; name: string; chef: string; time: number; difficulty: string;
          rating: number; reviews: number; businessNote: string; species: string
        }) => (
          <Card key={r.id} className="p-5" hover>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🍽️</span>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">{r.name}</h3>
                <p className="text-xs text-slate-500">by {r.chef}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.time} min</span>
              <span>{r.difficulty}</span>
              <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{r.rating}</span>
            </div>
            {r.businessNote && (
              <div className="mt-3 px-3 py-1.5 bg-emerald-50 rounded-lg text-xs text-emerald-700 font-medium">
                💰 {r.businessNote}
              </div>
            )}
          </Card>
        ))}
      </div>
    </section>
  )
}

// ── Knowledge ────────────────────────────────────────────────────────

export function KnowledgeWidget() {
  const t = useT()
  return (
    <Card className="p-6 bg-gradient-to-br from-sky-50 to-cyan-50 border-sky-100">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-sky-600 rounded-xl shadow-md"><BookOpen className="w-6 h-6 text-white" /></div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 mb-1">{t('w.knowledge')}</h3>
          <p className="text-sm text-slate-600 mb-3">{t('w.knowledge.sub')}</p>
          <div className="flex flex-wrap gap-2">
            {['IQF Technology', 'Cold Chain', 'Tuna Fishing', 'Salmon Farming', 'Value Added Processing'].map(tag => (
              <span key={tag} className="text-xs px-2.5 py-1 bg-sky-100 text-sky-700 rounded-full">{tag}</span>
            ))}
          </div>
          <Link href="/knowledge">
            <Button variant="primary" size="sm" className="mt-3 bg-sky-600 hover:bg-sky-700">{t('btn.browse')}</Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}

// ── Widget registry ──────────────────────────────────────────────────

export const WIDGET_REGISTRY: Record<string, React.ReactNode> = {
  'price-salmon':      <SalmonPriceWidget />,
  'price-tuna':        <TunaPriceWidget />,
  'price-shrimp':      <ShrimpPriceWidget />,
  'price-lobster':     <LobsterPriceWidget />,
  'price-tilapia':     <TilapiaPriceWidget />,
  'price-value-added': <ValueAddedPriceWidget />,
  'price-hamachi':     <HamachiPriceWidget />,
  'price-comparison':  <PriceComparisonWidget />,
  'price-trade-volume': <TradeVolumeWidget />,
  'seasonal-calendar': <SeasonalCalendarWidget />,
  'exchange-rates':    <ExchangeRatesWidget />,
  'news-latest':       <LatestNewsWidget />,
  'news-ai-briefing':  <AIBriefingWidget />,
  'news-prices':       <PricesNewsWidget />,
  'news-regulation':   <RegulationNewsWidget />,
  'news-aquaculture':  <AquacultureNewsWidget />,
  'ai-signals':        <AISignalsWidget />,
  'market-stats':      <PlatformStatsWidget />,
  'marketplace-tiles': <MarketplaceTilesWidget />,
  'marketplace-deals': <SmartFeaturesWidget />,
  'trust':             <TrustWidget />,
  'recipes':           <RecipesWidget />,
  'knowledge':         <KnowledgeWidget />,
}
