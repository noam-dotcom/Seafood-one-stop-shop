'use client'

import { useState, useMemo } from 'react'
import {
  Newspaper, Bot, Filter, Search, Clock, ExternalLink, Tag,
  BookOpen, TrendingUp, AlertCircle, CheckCircle, Globe2,
  ChevronRight, Sparkles, Mail, Bell, Download, RefreshCw,
  Calendar, ArrowRight
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { NEWS_ARTICLES } from '@/lib/data'
import { formatRelativeTime, cn } from '@/lib/utils'
import { useT } from '@/lib/i18n'

// Categories and regions are now defined inside the component to use t()

const WEEKLY_BRIEFING = {
  date: 'Week of March 3–7, 2026',
  headline: "Salmon Tightens, Shrimp Surges, EU Raises Compliance Bar",
  summary: `This week's seafood intelligence briefing brings you the key signals every professional needs to know — delivered with the precision of a Bloomberg terminal and the warmth of a fishmonger who actually likes you.

🐟 **Salmon:** Norwegian volumes are under pressure from sea lice and regulation. Expect +5-8% price increase through Q2. Our recommendation: secure Q2-Q3 positions now if you're a regular salmon buyer.

🦐 **Shrimp:** Ecuador broke another export record. Supply is robust, prices soft. This is a buyer's market — negotiate aggressively, volume discounts are available.

🇪🇺 **EU Regulation:** Digital catch certificates become mandatory in July 2026. Exporters: start implementing now. Buyers: verify your supplier readiness before placing H2 orders.

🐠 **Tuna:** Bluefin farm breakthrough in Japan could reshape premium supply chains within 3-5 years. Watch this space — it's the most exciting development in high-end seafood since sushi went global.

💡 **This week's alpha move:** Shrimp from Ecuador at current prices + EU regulatory premium for certified suppliers = smart positioning for H2 profitability.`,
  tone: "Smart · Professional · Slightly Witty",
}

const SENTIMENT_ICONS: Record<string, { icon: typeof AlertCircle; color: string; label: string }> = {
  positive: { icon: CheckCircle, color: 'text-emerald-500', label: 'Opportunity' },
  alert: { icon: AlertCircle, color: 'text-amber-500', label: 'Alert' },
  neutral: { icon: Globe2, color: 'text-slate-500', label: 'Industry' },
}

function NewsCard({ article, featured = false }: { article: typeof NEWS_ARTICLES[0]; featured?: boolean }) {
  const t = useT()
  const sentiment = SENTIMENT_ICONS[article.sentiment] || SENTIMENT_ICONS.neutral
  const Icon = sentiment.icon

  return (
    <Card className={cn('overflow-hidden', featured ? 'lg:col-span-2' : '')} hover>
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className={cn(
            'p-2 rounded-lg flex-shrink-0',
            article.sentiment === 'positive' ? 'bg-emerald-50' :
            article.sentiment === 'alert' ? 'bg-amber-50' : 'bg-slate-50'
          )}>
            <Icon className={cn('w-4 h-4', sentiment.color)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              <Badge variant={
                article.sentiment === 'positive' ? 'success' :
                article.sentiment === 'alert' ? 'warning' : 'default'
              }>
                {article.category}
              </Badge>
              {article.species.slice(0, 2).map(s => (
                <Badge key={s} variant="ocean">{s}</Badge>
              ))}
              {article.country.slice(0, 1).map(c => (
                <Badge key={c} variant="outline">{c}</Badge>
              ))}
            </div>
            <h3 className={cn(
              'font-semibold text-slate-900 leading-snug',
              featured ? 'text-base' : 'text-sm line-clamp-2'
            )}>
              {article.title}
            </h3>
          </div>
          <span className="text-xl flex-shrink-0">{article.image}</span>
        </div>

        <p className={cn(
          'text-slate-600 text-sm leading-relaxed mb-3',
          featured ? '' : 'line-clamp-2'
        )}>
          {article.summary}
        </p>

        {/* AI Insight Box */}
        {article.aiSummary && (
          <div className="p-3 bg-gradient-to-r from-ocean-50 to-sky-50 rounded-xl border border-ocean-100 mb-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Bot className="w-3.5 h-3.5 text-ocean-600" />
              <span className="text-xs font-semibold text-ocean-700">{t('page.news.aiSummary')}</span>
            </div>
            <p className="text-xs text-ocean-700 leading-relaxed">{article.aiSummary}</p>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-medium text-slate-600">{article.source}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime} {t('page.news.readTime')}
            </span>
            <span>{formatRelativeTime(article.publishedAt)}</span>
          </div>
          <button className="flex items-center gap-1 text-ocean-600 hover:text-ocean-700 font-medium">
            {t('page.news.readMore')} <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </Card>
  )
}

export default function NewsPage() {
  const t = useT()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedRegion, setSelectedRegion] = useState('All')
  const [showBriefing, setShowBriefing] = useState(false)

  const CATEGORIES = [
    t('page.news.filter.all'), t('page.news.filter.prices'), t('page.news.filter.production'),
    t('page.news.filter.regulation'), t('page.news.filter.aquaculture'), t('page.news.filter.logistics'),
    t('page.news.filter.sustainability'), t('page.news.filter.technology')
  ]

  const REGIONS = [
    t('page.news.region.all'), t('page.news.region.europe'), t('page.news.region.asia'),
    t('page.news.region.americas'), t('page.news.region.me'), t('page.news.region.africa')
  ]

  const filteredArticles = useMemo(() => {
    return NEWS_ARTICLES.filter(a => {
      if (search && !a.title.toLowerCase().includes(search.toLowerCase()) &&
          !a.summary.toLowerCase().includes(search.toLowerCase())) return false
      if (selectedCategory !== t('page.news.filter.all') && a.category !== selectedCategory) return false
      return true
    })
  }, [search, selectedCategory, selectedRegion, t])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('page.news.title')}</h1>
          <p className="text-slate-500 text-sm mt-1">
            {t('page.news.subtitle')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Bell className="w-4 h-4" />
            {t('page.news.alerts')}
          </Button>
          <Button variant="primary" size="sm" onClick={() => setShowBriefing(!showBriefing)}>
            <Sparkles className="w-4 h-4" />
            {t('page.news.weeklyBriefing')}
          </Button>
        </div>
      </div>

      {/* Weekly AI Briefing */}
      {showBriefing && (
        <Card className="overflow-hidden border-ocean-200">
          <div className="bg-ocean-gradient p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span className="text-white/80 text-xs font-medium uppercase tracking-wide">AI Weekly Briefing</span>
                </div>
                <h2 className="text-lg font-bold text-white">{WEEKLY_BRIEFING.headline}</h2>
                <p className="text-ocean-200 text-sm mt-0.5">{WEEKLY_BRIEFING.date}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-white border border-white/30 hover:bg-white/10">
                  <Mail className="w-4 h-4" />
                  Email
                </Button>
                <Button variant="ghost" size="sm" className="text-white border border-white/30 hover:bg-white/10">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="prose prose-sm max-w-none">
              {WEEKLY_BRIEFING.summary.split('\n\n').map((para, i) => (
                <div key={i} className="mb-4">
                  {para.split('\n').map((line, j) => (
                    <p key={j} className={cn(
                      'text-sm leading-relaxed',
                      line.startsWith('🐟') || line.startsWith('🦐') || line.startsWith('🇪🇺') || line.startsWith('🐠') || line.startsWith('💡')
                        ? 'font-semibold text-slate-900 text-base mt-3 mb-1'
                        : 'text-slate-600'
                    )}>
                      {line.replace(/\*\*(.*?)\*\*/g, '$1')}
                    </p>
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
              <Bot className="w-3.5 h-3.5 text-ocean-500" />
              Generated by SeaHub AI • Tone: {WEEKLY_BRIEFING.tone} • Verified sources only
            </div>
          </div>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('page.news.search')}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ocean-300"
          />
        </div>
        <select
          value={selectedRegion}
          onChange={e => setSelectedRegion(e.target.value)}
          className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none"
        >
          {REGIONS.map(r => <option key={r}>{r}</option>)}
        </select>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
              selectedCategory === cat
                ? 'bg-ocean-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-ocean-300 hover:text-ocean-600'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: t('page.news.todayArticles'), value: '24', icon: Newspaper, color: 'text-ocean-600' },
          { label: t('page.news.aiInsights'), value: '18', icon: Bot, color: 'text-purple-600' },
          { label: t('page.news.priceAlerts'), value: '3', icon: AlertCircle, color: 'text-amber-600' },
        ].map(stat => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="p-3 flex items-center gap-3">
              <Icon className={cn('w-5 h-5', stat.color)} />
              <div>
                <p className="font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Featured + News Grid */}
      <div className="space-y-4">
        {/* Featured article */}
        <NewsCard article={filteredArticles[0]} featured />

        {/* Regular grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredArticles.slice(1).map(article => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-16">
            <Newspaper className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400">No articles match your filters</p>
          </div>
        )}
      </div>

      {/* Subscribe to Intelligence */}
      <Card className="p-6 bg-gradient-to-br from-slate-900 to-ocean-900 text-center">
        <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-white mb-2">{t('page.news.subscribe.title')}</h3>
        <p className="text-slate-400 text-sm mb-4 max-w-md mx-auto">
          Personalized AI briefings delivered to your inbox every morning.
          Smart. Professional. Slightly witty. Always data-driven.
        </p>
        <div className="flex gap-2 max-w-sm mx-auto">
          <input
            type="email"
            placeholder="your@company.com"
            className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-ocean-400"
          />
          <Button variant="primary" className="bg-ocean-500 hover:bg-ocean-400">
            {t('page.news.subscribe.btn')}
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-2">No spam. Unsubscribe anytime. 12,000+ subscribers.</p>
      </Card>
    </div>
  )
}
