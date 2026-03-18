'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Bot, Brain, TrendingUp, TrendingDown, ShoppingCart, AlertTriangle,
  CheckCircle, ChevronRight, BarChart3, Zap, Target, Clock, DollarSign,
  Package, Leaf, Star, ArrowUp, ArrowDown, RefreshCw, Download,
  Play, Pause, SkipForward, Settings, Bell, Shield, Sparkles,
  PieChart, Activity, Users, Globe, Filter, ChevronDown, X,
  ThumbsUp, AlertCircle, Info, Send, Loader2,
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// ─── Mock customer history database ──────────────────────────────────────────
const PURCHASE_HISTORY = [
  { month: 'Sep', salmon: 18500, tuna: 12000, shrimp: 22000, tilapia: 8000, lobster: 1200, valueAdded: 5500, waste: 1820, revenue: 198400 },
  { month: 'Oct', salmon: 21000, tuna: 14500, shrimp: 19500, tilapia: 9500, lobster: 1400, valueAdded: 6200, waste: 1950, revenue: 221800 },
  { month: 'Nov', salmon: 24500, tuna: 11000, shrimp: 25000, tilapia: 7800, lobster: 2100, valueAdded: 8800, waste: 2280, revenue: 258600 },
  { month: 'Dec', salmon: 28000, tuna: 9500,  shrimp: 31000, tilapia: 6500, lobster: 3200, valueAdded: 12000, waste: 3080, revenue: 312400 },
  { month: 'Jan', salmon: 19000, tuna: 13000, shrimp: 20000, tilapia: 9000, lobster: 1100, valueAdded: 5800, waste: 1780, revenue: 206200 },
  { month: 'Feb', salmon: 22000, tuna: 15500, shrimp: 21500, tilapia: 10500, lobster: 1600, valueAdded: 7200, waste: 2010, revenue: 238800 },
]

const PROFIT_BY_PRODUCT = [
  { name: 'Lobster Cold Tails', margin: 34.2, volume: 8600, trend: 'up', risk: 'low', sku: 'lob-003' },
  { name: 'Hamachi Super Frozen', margin: 28.7, volume: 4200, trend: 'up', risk: 'low', sku: 'ham-002' },
  { name: 'Salmon Fillet IQF', margin: 22.1, volume: 45000, trend: 'stable', risk: 'low', sku: 'sal-002' },
  { name: 'YFT Loins IQF', margin: 19.8, volume: 31000, trend: 'up', risk: 'medium', sku: 'yft-002' },
  { name: 'Breaded Shrimp', margin: 18.4, volume: 12000, trend: 'up', risk: 'low', sku: 'va-001' },
  { name: 'Vannamei HLSO 21/25', margin: 15.2, volume: 72000, trend: 'down', risk: 'medium', sku: 'shr-001' },
  { name: 'Tilapia Fillet IQF', margin: 12.8, volume: 38000, trend: 'down', risk: 'high', sku: 'til-002' },
  { name: 'Smoked Salmon', margin: 11.4, volume: 8200, trend: 'stable', risk: 'low', sku: 'va-002' },
]

const WASTE_ANALYSIS = [
  { name: 'Tilapia Fillet', waste: 8.4, avg: 3.2, color: '#ef4444' },
  { name: 'Shrimp HLSO', waste: 4.1, avg: 3.2, color: '#f97316' },
  { name: 'YFT Loins', waste: 3.8, avg: 3.2, color: '#eab308' },
  { name: 'Salmon Fillet', waste: 2.1, avg: 3.2, color: '#22c55e' },
  { name: 'Lobster Tails', waste: 1.2, avg: 3.2, color: '#10b981' },
  { name: 'Hamachi', waste: 0.8, avg: 3.2, color: '#06b6d4' },
]

const OPPORTUNITIES = [
  {
    id: 'opp1', type: 'PRICE_DIP', icon: '📉', urgency: 'HIGH',
    title: 'YFT Loins — Maldives Fleet Oversupply',
    desc: 'Current price $6.40/kg — 14% below 90-day avg. Oversupply from Maldivian fleet coincides with your peak Q2 YFT demand. Lock 18 MT at this price to save ~$16,200 vs next-month forecast.',
    saving: 16200, action: 'Buy 18 MT now', expires: '4 days', confidence: 92,
  },
  {
    id: 'opp2', type: 'SEASONAL', icon: '🗓️', urgency: 'MEDIUM',
    title: 'Pre-Holiday Lobster Buying Window',
    desc: 'Based on your Dec 2024 pattern (+167% lobster volume) and current Maine prices $28.50/kg, recommend forward-buying 3.5 MT for Nov delivery. Last year you paid $31/kg in Oct.',
    saving: 8750, action: 'Forward buy 3.5 MT', expires: '18 days', confidence: 87,
  },
  {
    id: 'opp3', type: 'SWAP', icon: '🔄', urgency: 'MEDIUM',
    title: 'Tilapia → Vietnamese Sea Bass Upgrade',
    desc: 'Your tilapia waste is 8.4% (vs 3.2% platform avg) — costing you $4,120/month. Vietnamese Sea Bass at $8.90/kg has 1.8% waste rate. Switch 20% of tilapia volume to unlock $2,800/mo net gain.',
    saving: 2800, action: 'View substitution plan', expires: 'Ongoing', confidence: 78,
  },
  {
    id: 'opp4', type: 'VOLUME', icon: '📦', urgency: 'LOW',
    title: 'Salmon Group Buy — 8 buyers combining',
    desc: 'Nordic Seas AS Group Buy opens in 6 days: 120 MT IQF Fillet at $5.20/kg (vs your current $5.85). Your typical monthly volume qualifies for 12 MT allocation. Save $7,800/month ongoing.',
    saving: 7800, action: 'Join group buy', expires: '6 days', confidence: 95,
  },
]

const AUTO_ORDER_PRODUCTS = [
  { name: 'Salmon Fillet IQF', sku: 'sal-002', currentTP: 5.85, suggestedTP: 5.45, minOrder: 2000, autoEnabled: true },
  { name: 'Vannamei HLSO 21/25', sku: 'shr-001', currentTP: 7.20, suggestedTP: 6.90, minOrder: 5000, autoEnabled: true },
  { name: 'YFT Loins IQF', sku: 'yft-002', currentTP: 6.40, suggestedTP: 6.10, minOrder: 1500, autoEnabled: false },
  { name: 'Tilapia Fillet IQF', sku: 'til-002', currentTP: 2.85, suggestedTP: 2.65, minOrder: 3000, autoEnabled: false },
]

type ChatMsg = { role: 'ai' | 'user'; text: string }

const GUIDED_FLOW: ChatMsg[][] = [
  [{ role: 'ai', text: "👋 Hello! I'm your **AI Buying Assistant**. I've analyzed your last 6 months of purchasing data across 8 product categories.\n\n📊 Here's what I found:\n• Total spend: **$1.44M** over 6 months\n• Avg waste cost: **$2,153/month** — 38% above platform average\n• 3 products dragging your margin down\n• 4 high-confidence opportunities identified\n\nWould you like me to walk you through a step-by-step optimized purchasing plan? Or would you prefer to jump straight to the AI-generated plan?" }],
  [{ role: 'user', text: "Walk me through it step by step please" }, { role: 'ai', text: "Great choice. Let's build your plan properly.\n\n**Step 1 of 5 — Business Profile**\n\nBased on your transaction history, I see you operate as a **seafood importer / distributor** primarily serving the food service and retail segments.\n\n📍 Your top 3 customer segments appear to be:\n1. **HoReCa** (Hotels, Restaurants, Catering) — 52% of volume\n2. **Retail / Supermarkets** — 31%\n3. **Food processors** — 17%\n\nIs this correct? And what's your typical delivery lead time to customers?" }],
  [{ role: 'user', text: "Yes, that's correct. Lead time is 3-5 days." }, { role: 'ai', text: "Perfect. **Step 2 of 5 — Inventory & Cash Flow**\n\nWith a 3–5 day lead time, here's your optimal inventory model:\n\n• **Salmon:** Hold 8–10 days stock (high velocity, price-stable)\n• **Shrimp:** Hold 14–18 days (Ecuador shipping cycle)\n• **Lobster:** Hold 5–7 days only (live/fresh sensitivity)\n• **Tilapia:** ⚠️ Reduce to 7 days — your current 14-day hold is creating the 8.4% waste\n\nWhat's your current cold storage capacity in MT?" }],
  [{ role: 'user', text: "We have 180 MT cold storage capacity." }, { role: 'ai', text: "**Step 3 of 5 — Risk Profile**\n\n180 MT is healthy. You're currently using ~68% of capacity.\n\nNow let me assess your **price risk exposure**:\n\n🔴 **HIGH risk:** Tilapia (China-dependent, high waste, margin compression)\n🟡 **MEDIUM risk:** Vannamei Shrimp (Ecuador FX + El Niño cycle)\n🟢 **LOW risk:** Salmon, Lobster, Hamachi (stable certified sources)\n\n**Recommendation:** Reduce tilapia exposure by 25% and reallocate to Sea Bass (lower waste, better margin, same customer satisfaction).\n\nHow important is product variety vs margin optimization for you?" }],
  [{ role: 'user', text: "Margin is priority, but I need at least 6 product types." }, { role: 'ai', text: "**Step 4 of 5 — Optimized Product Mix**\n\nBased on your margin priority + 6 product minimum, here's your **AI-recommended portfolio:**\n\n✅ **Keep & Grow:** Lobster (+15%), Hamachi (+20%), Salmon (stable)\n🔄 **Adjust:** Shrimp (-10% volume, upgrade to Black Tiger for better margin)\n📉 **Reduce:** Tilapia (-25%, 7-day max hold)\n🆕 **Add:** Sea Bass (Greece/Turkey, 22% margin, low waste)\n\nThis mix is projected to increase your **gross margin by 4.2%** and reduce waste costs by **$1,680/month**.\n\nReady to see the final purchasing plan with exact quantities, target prices, and auto-order triggers?" }],
  [{ role: 'user', text: "Yes, show me the full plan!" }, { role: 'ai', text: "**Step 5 of 5 — Your AI Purchasing Plan is Ready! 🎉**\n\nI've generated your complete **Q2 2026 Purchasing Plan** with:\n\n📋 **8 products** with exact quantities and target prices\n⚡ **4 auto-order triggers** set at optimal TP levels\n🎯 **4 special opportunities** to act on in the next 18 days\n📈 **Projected improvement:** +$8,240/month net margin\n\nThe plan is displayed below. You can export it as PDF or activate auto-order triggers directly from the platform. Shall I also set up weekly price alerts for your key products?" }],
]

const PLAN_ROWS = [
  { product: 'Atlantic Salmon Fillet IQF', qty: '8,000 kg', freq: 'Weekly', tp: '$5.45', current: '$5.85', save: '$3,200', status: 'auto', priority: 1 },
  { product: 'Vannamei HLSO 21/25', qty: '12,000 kg', freq: 'Bi-weekly', tp: '$6.90', current: '$7.20', save: '$3,600', status: 'auto', priority: 2 },
  { product: 'Lobster Cold Water Tails', qty: '800 kg', freq: 'Weekly', tp: '$37.00', current: '$38.50', save: '$1,200', status: 'alert', priority: 3 },
  { product: 'Yellowtail Hamachi SF', qty: '600 kg', freq: 'Weekly', tp: '$21.50', current: '$22.50', save: '$600', status: 'alert', priority: 4 },
  { product: 'YFT Loins IQF', qty: '5,000 kg', freq: 'Bi-weekly', tp: '$6.10', current: '$6.40', save: '$1,500', status: 'auto', priority: 5 },
  { product: 'Sea Bass (NEW)', qty: '2,000 kg', freq: 'Weekly', tp: '$8.50', current: '—', save: 'New line', status: 'new', priority: 6 },
  { product: 'Black Tiger HLSO 8/12', qty: '3,000 kg', freq: 'Monthly', tp: '$13.80', current: '$14.50', save: '$2,160', status: 'alert', priority: 7 },
  { product: 'Tilapia Fillet IQF', qty: '4,000 kg', freq: 'Bi-weekly', tp: '$2.65', current: '$2.85', save: '$800', status: 'reduce', priority: 8 },
]

export default function AIBuyer() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat' | 'plan' | 'autoorder'>('dashboard')
  const [chatStep, setChatStep] = useState(0)
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [inputVal, setInputVal] = useState('')
  const [planGenerated, setPlanGenerated] = useState(false)
  const [autoOrderItems, setAutoOrderItems] = useState(AUTO_ORDER_PRODUCTS)
  const [dismissedOpps, setDismissedOpps] = useState<string[]>([])
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (activeTab === 'chat' && messages.length === 0) triggerNextStep(0)
  }, [activeTab])

  const triggerNextStep = (step: number) => {
    if (step >= GUIDED_FLOW.length) { setPlanGenerated(true); return }
    const stepMsgs = GUIDED_FLOW[step]
    let delay = 0
    stepMsgs.forEach((msg, i) => {
      if (msg.role === 'ai') {
        setTimeout(() => setIsTyping(true), delay)
        delay += 800
        setTimeout(() => {
          setIsTyping(false)
          setMessages(prev => [...prev, msg])
          if (i === stepMsgs.length - 1 && step === GUIDED_FLOW.length - 1) setPlanGenerated(true)
        }, delay + 1200)
        delay += 1400
      } else {
        setTimeout(() => setMessages(prev => [...prev, msg]), delay)
        delay += 200
      }
    })
  }

  const handleSend = () => {
    if (!inputVal.trim() || isTyping) return
    const next = chatStep + 1
    setMessages(prev => [...prev, { role: 'user', text: inputVal }])
    setInputVal('')
    if (next < GUIDED_FLOW.length) {
      const aiMsgs = GUIDED_FLOW[next].filter(m => m.role === 'ai')
      setTimeout(() => setIsTyping(true), 400)
      setTimeout(() => {
        setIsTyping(false)
        aiMsgs.forEach(msg => setMessages(prev => [...prev, msg]))
        if (next === GUIDED_FLOW.length - 1) setPlanGenerated(true)
      }, 1600)
      setChatStep(next)
    }
  }

  const handleQuickReply = (text: string) => { setInputVal(text); setTimeout(() => handleSend(), 50) }

  const QUICK_REPLIES: Record<number, string[]> = {
    0: ["Walk me through it step by step please", "Show me the AI-generated plan directly"],
    1: ["Yes, that's correct. Lead time is 3-5 days.", "Lead time varies by product"],
    2: ["We have 180 MT cold storage capacity.", "Around 120 MT capacity"],
    3: ["Margin is priority, but I need at least 6 product types.", "Variety is equally important"],
    4: ["Yes, show me the full plan!", "Can you adjust the quantities?"],
  }

  const renderMarkdown = (text: string) =>
    text.split('\n').map((line, i) => {
      const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      if (line.startsWith('•')) return <li key={i} className="ml-4 list-disc" dangerouslySetInnerHTML={{ __html: bold.slice(1) }} />
      if (line.match(/^\d+\./)) return <li key={i} className="ml-4 list-decimal" dangerouslySetInnerHTML={{ __html: bold }} />
      if (line === '') return <br key={i} />
      return <p key={i} dangerouslySetInnerHTML={{ __html: bold }} />
    })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B1E3F] via-[#1a3a6b] to-[#0f2d54] text-white p-8">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 40%)' }} />
        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-violet-600 flex items-center justify-center shadow-xl">
              <Brain className="w-9 h-9 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 bg-blue-500/30 border border-blue-400/40 rounded-full text-blue-200 text-xs font-bold tracking-wide">AI POWERED</span>
                <span className="px-2.5 py-0.5 bg-emerald-500/30 border border-emerald-400/40 rounded-full text-emerald-200 text-xs font-bold">BETA</span>
              </div>
              <h2 className="text-3xl font-bold">AI Trading Assistant</h2>
              <p className="text-blue-200 mt-1">Your intelligent seafood procurement co-pilot — analyzes history, predicts demand, builds optimal buying plans</p>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-blue-300 text-xs">Connected to</p>
            <p className="text-white font-bold text-sm mt-0.5">Your Purchase Database</p>
            <p className="text-emerald-400 text-xs mt-1 flex items-center justify-end gap-1"><span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> Live sync</p>
          </div>
        </div>
        <div className="relative mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: '6-Month Spend', value: '$1.44M', icon: DollarSign, color: 'text-yellow-400' },
            { label: 'Avg Waste Cost', value: '$2,153/mo', icon: AlertTriangle, color: 'text-red-400' },
            { label: 'Opportunities', value: '4 Active', icon: Zap, color: 'text-emerald-400' },
            { label: 'Projected Saving', value: '+$8,240/mo', icon: TrendingUp, color: 'text-blue-300' },
          ].map(s => (
            <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
              <div className="flex items-center gap-2 mb-1"><s.icon className={cn('w-4 h-4', s.color)} /><span className="text-white/60 text-xs">{s.label}</span></div>
              <p className={cn('text-xl font-bold', s.color)}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm w-full overflow-x-auto">
        {[
          { key: 'dashboard', label: 'Analytics Dashboard', icon: BarChart3 },
          { key: 'chat', label: 'AI Step-by-Step', icon: Bot },
          { key: 'plan', label: 'Purchasing Plan', icon: Target },
          { key: 'autoorder', label: 'Auto-Order & TP', icon: Zap },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={cn('flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap flex-1 justify-center',
              activeTab === tab.key ? 'bg-[#0B1E3F] text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50')}>
            <tab.icon className="w-4 h-4" />{tab.label}
          </button>
        ))}
      </div>

      {/* DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-slate-900 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-blue-600" /> 6-Month Purchase Volume by Category</h2>
                <p className="text-sm text-slate-500 mt-0.5">kg purchased per month · Hover for breakdown</p>
              </div>
              <Badge>Sep 2025 — Feb 2026</Badge>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={PURCHASE_HISTORY} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={v => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number | undefined) => [v != null ? `${v.toLocaleString()} kg` : '-', '']} contentStyle={{ borderRadius: '10px' }} />
                <Legend />
                <Bar dataKey="salmon" fill="#f97316" name="Salmon" radius={[2,2,0,0]} />
                <Bar dataKey="shrimp" fill="#f43f5e" name="Shrimp" radius={[2,2,0,0]} />
                <Bar dataKey="tuna" fill="#0ea5e9" name="Tuna" radius={[2,2,0,0]} />
                <Bar dataKey="tilapia" fill="#22c55e" name="Tilapia" radius={[2,2,0,0]} />
                <Bar dataKey="lobster" fill="#dc2626" name="Lobster" radius={[2,2,0,0]} />
                <Bar dataKey="valueAdded" fill="#8b5cf6" name="Value Added" radius={[2,2,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-emerald-600" /> Profit Margin by Product</h2>
              <div className="space-y-3">
                {PROFIT_BY_PRODUCT.map(p => (
                  <div key={p.name} className="flex items-center gap-3">
                    <div className="w-36 shrink-0">
                      <p className="text-xs font-medium text-slate-700 truncate">{p.name}</p>
                      <p className="text-[10px] text-slate-400">{(p.volume/1000).toFixed(1)}K kg/6mo</p>
                    </div>
                    <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${(p.margin / 35) * 100}%`, background: p.margin > 25 ? '#10b981' : p.margin > 18 ? '#f97316' : '#ef4444' }} />
                    </div>
                    <div className="flex items-center gap-1.5 w-20 justify-end shrink-0">
                      <span className="text-sm font-bold text-slate-800">{p.margin}%</span>
                      {p.trend === 'up' ? <ArrowUp className="w-3 h-3 text-emerald-500" /> : p.trend === 'down' ? <ArrowDown className="w-3 h-3 text-red-500" /> : <span className="w-3 h-3 text-slate-400">—</span>}
                    </div>
                    <span className={cn('text-[10px] px-1.5 py-0.5 rounded font-medium', p.risk === 'low' ? 'bg-emerald-100 text-emerald-700' : p.risk === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700')}>{p.risk.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="font-bold text-slate-900 mb-1 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" /> Waste & Loss Analysis</h2>
              <p className="text-xs text-slate-500 mb-4">% waste by product vs platform average (3.2%)</p>
              <div className="space-y-3">
                {WASTE_ANALYSIS.map(w => (
                  <div key={w.name} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-700">{w.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">avg {w.avg}%</span>
                        <span className={cn('text-xs font-bold', w.waste > w.avg ? 'text-red-600' : 'text-emerald-600')}>{w.waste}%</span>
                      </div>
                    </div>
                    <div className="relative bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="absolute top-0 left-0 h-full rounded-full" style={{ width: `${(w.waste / 10) * 100}%`, backgroundColor: w.color }} />
                      <div className="absolute top-0 h-full w-0.5 bg-slate-400" style={{ left: `${(w.avg / 10) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-xs font-semibold text-amber-800 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Tilapia waste is 162% above platform average — costing you $4,120/month</p>
              </div>
            </Card>
          </div>

          <div>
            <h2 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-500" /> AI-Detected Special Opportunities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {OPPORTUNITIES.filter(o => !dismissedOpps.includes(o.id)).map(opp => (
                <Card key={opp.id} className={cn('p-5 border-2 transition-all hover:shadow-md',
                  opp.urgency === 'HIGH' ? 'border-red-200 bg-red-50/30' : opp.urgency === 'MEDIUM' ? 'border-amber-200 bg-amber-50/30' : 'border-blue-200 bg-blue-50/30')}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{opp.icon}</span>
                        <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full',
                          opp.urgency === 'HIGH' ? 'bg-red-100 text-red-700' : opp.urgency === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700')}>
                          {opp.urgency} PRIORITY
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{opp.expires}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm mb-1">{opp.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{opp.desc}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-emerald-700 font-bold text-sm">+${opp.saving.toLocaleString()}/mo</span>
                        <span className="text-xs text-slate-400">AI confidence: {opp.confidence}%</span>
                      </div>
                    </div>
                    <button onClick={() => setDismissedOpps(p => [...p, opp.id])} className="text-slate-300 hover:text-slate-500 shrink-0"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                    <button onClick={() => setActiveTab('plan')} className="flex-1 py-1.5 bg-[#0B1E3F] hover:bg-[#162D5A] text-white text-xs font-semibold rounded-lg transition-colors">{opp.action}</button>
                    <button onClick={() => setDismissedOpps(p => [...p, opp.id])} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-500 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">Dismiss</button>
                  </div>
                </Card>
              ))}
              {dismissedOpps.length === OPPORTUNITIES.length && (
                <div className="col-span-2 text-center py-8 text-slate-400">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                  <p className="text-sm">All opportunities reviewed. New ones will appear as market conditions change.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI CHAT */}
      {activeTab === 'chat' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
            <Bot className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-900">AI Step-by-Step Purchasing Plan Builder</p>
              <p className="text-xs text-blue-700 mt-0.5">The AI will ask you targeted questions based on your history to build the most profitable, risk-limited purchasing plan for your business. Takes about 3 minutes.</p>
            </div>
          </div>

          <Card className="overflow-hidden">
            <div className="bg-[#0B1E3F] px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center"><Brain className="w-4 h-4 text-white" /></div>
              <div>
                <p className="text-white text-sm font-semibold">SeaHub AI Buying Assistant</p>
                <p className="text-blue-300 text-xs flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Analyzing your purchase history…</p>
              </div>
            </div>
            <div className="h-[460px] overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg, i) => (
                <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                  {msg.role === 'ai' && <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center mr-2 mt-1 shrink-0"><Brain className="w-3.5 h-3.5 text-white" /></div>}
                  <div className={cn('max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm',
                    msg.role === 'ai' ? 'bg-white text-slate-800 rounded-tl-sm border border-slate-100' : 'bg-[#0B1E3F] text-white rounded-tr-sm')}>
                    <div className="space-y-1">{renderMarkdown(msg.text)}</div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start">
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center mr-2 shrink-0"><Brain className="w-3.5 h-3.5 text-white" /></div>
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-slate-100">
                    <div className="flex gap-1 items-center h-4">
                      {[0,1,2].map(i => <span key={i} className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />)}
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            {!isTyping && QUICK_REPLIES[chatStep] && (
              <div className="px-4 py-2 bg-white border-t border-slate-100 flex flex-wrap gap-2">
                {QUICK_REPLIES[chatStep].map(reply => (
                  <button key={reply} onClick={() => handleQuickReply(reply)}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-full border border-blue-200 transition-colors">{reply}</button>
                ))}
              </div>
            )}
            <div className="border-t border-slate-100 bg-white px-4 py-3 flex items-center gap-3">
              <input value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type your response or use a quick reply above…"
                className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300" />
              <button onClick={handleSend} disabled={isTyping || !inputVal.trim()}
                className="p-2.5 bg-[#0B1E3F] hover:bg-[#162D5A] disabled:opacity-40 text-white rounded-xl transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </Card>

          {planGenerated && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-semibold text-emerald-900 text-sm">Your AI Purchasing Plan is ready!</p>
                  <p className="text-xs text-emerald-700">Projected monthly saving: +$8,240 · 8 products optimized</p>
                </div>
              </div>
              <button onClick={() => setActiveTab('plan')} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors">
                View Plan <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* PURCHASING PLAN */}
      {activeTab === 'plan' && (
        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-r from-[#0B1E3F] to-[#1a3a6b] text-white">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2"><Target className="w-5 h-5 text-yellow-400" /><span className="text-yellow-400 text-xs font-bold tracking-widest uppercase">AI Generated · Q2 2026</span></div>
                <h2 className="text-2xl font-bold">Optimized Purchasing Plan</h2>
                <p className="text-blue-200 text-sm mt-1">Generated March 9, 2026 · Based on 6-month history analysis</p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-semibold transition-colors">
                <Download className="w-4 h-4" /> Export PDF
              </button>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {[{ l:'Total Monthly Budget', v:'$148,200' }, { l:'Projected Saving', v:'+$8,240/mo' }, { l:'Margin Improvement', v:'+4.2%' }, { l:'Waste Reduction', v:'-$1,680/mo' }].map(s => (
                <div key={s.l} className="bg-white/10 rounded-xl px-3 py-2.5 text-center">
                  <p className="text-blue-200 text-xs">{s.l}</p>
                  <p className="text-white font-bold text-lg mt-0.5">{s.v}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2"><Package className="w-5 h-5 text-blue-600" /> Product Purchasing Schedule</h3>
              <div className="flex gap-2 text-xs">
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">⚡ Auto-Order Active</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">🔔 Price Alert</span>
                <span className="px-2 py-1 bg-violet-100 text-violet-700 rounded-full font-medium">🆕 New Product</span>
                <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full font-medium">📉 Reduce</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['#','Product','Qty / Order','Frequency','Target Price','Current Price','Monthly Saving','Status'].map(h => (
                      <th key={h} className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PLAN_ROWS.map(row => (
                    <tr key={row.product} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-3 py-3.5 text-slate-400 font-mono text-xs">{row.priority}</td>
                      <td className="px-3 py-3.5 font-semibold text-slate-900">{row.product}</td>
                      <td className="px-3 py-3.5 text-slate-700">{row.qty}</td>
                      <td className="px-3 py-3.5 text-slate-500">{row.freq}</td>
                      <td className="px-3 py-3.5 font-bold text-emerald-700">{row.tp}</td>
                      <td className="px-3 py-3.5 text-slate-500">{row.current}</td>
                      <td className="px-3 py-3.5 font-bold text-blue-700">{row.save}</td>
                      <td className="px-3 py-3.5">
                        <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold',
                          row.status === 'auto' ? 'bg-emerald-100 text-emerald-700' : row.status === 'alert' ? 'bg-blue-100 text-blue-700' : row.status === 'new' ? 'bg-violet-100 text-violet-700' : 'bg-amber-100 text-amber-700')}>
                          {row.status === 'auto' ? '⚡ Auto-Order' : row.status === 'alert' ? '🔔 Alert Set' : row.status === 'new' ? '🆕 New' : '📉 Reduce'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              <strong>AI Note:</strong> This plan is based on your historical patterns and current market conditions. Auto-order triggers will execute automatically when prices hit TP levels. You can adjust any parameter in the Auto-Order tab, and the AI will recalculate savings projections in real-time.
            </p>
          </div>
        </div>
      )}

      {/* AUTO-ORDER */}
      {activeTab === 'autoorder' && (
        <div className="space-y-6">
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl flex items-start gap-3">
            <Zap className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-900 text-sm">Auto-Order Trigger System</p>
              <p className="text-xs text-emerald-700 mt-0.5">Set Target Prices (TP) per product. When market price hits or beats your TP, the system will automatically place an order with your pre-approved supplier. You receive a notification and can cancel within 2 hours.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {autoOrderItems.map((item, i) => (
              <Card key={item.sku} className={cn('p-5 border-2', item.autoEnabled ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200')}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{item.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">{item.sku}</p>
                  </div>
                  <button onClick={() => setAutoOrderItems(prev => prev.map((p, j) => j === i ? { ...p, autoEnabled: !p.autoEnabled } : p))}
                    className={cn('relative inline-flex h-6 w-11 items-center rounded-full transition-colors', item.autoEnabled ? 'bg-emerald-500' : 'bg-slate-200')}>
                    <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform', item.autoEnabled ? 'translate-x-6' : 'translate-x-1')} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div><label className="text-xs text-slate-500 font-medium">Current Market Price</label><p className="text-lg font-bold text-slate-900 mt-0.5">${item.currentTP}/kg</p></div>
                  <div><label className="text-xs text-slate-500 font-medium">AI Suggested TP</label><p className="text-lg font-bold text-emerald-700 mt-0.5">${item.suggestedTP}/kg</p></div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 flex items-center justify-between">Your Target Price (TP)<span className="text-emerald-600 font-bold">${item.suggestedTP}/kg</span></label>
                  <input type="range" min={item.suggestedTP * 0.9} max={item.currentTP * 1.05} step={0.05} value={item.suggestedTP}
                    onChange={e => setAutoOrderItems(prev => prev.map((p, j) => j === i ? { ...p, suggestedTP: parseFloat(e.target.value) } : p))}
                    className="w-full accent-emerald-600" />
                  <div className="flex justify-between text-[10px] text-slate-400"><span>Aggressive (low)</span><span>Conservative (high)</span></div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div><p className="text-xs text-slate-500">Min order qty</p><p className="text-sm font-bold text-slate-700">{item.minOrder.toLocaleString()} kg</p></div>
                  <div className="text-right"><p className="text-xs text-slate-500">Est. trigger frequency</p><p className="text-sm font-bold text-blue-700">{item.autoEnabled ? `${Math.round(2 + Math.random() * 3)}× / month` : 'Inactive'}</p></div>
                  {item.autoEnabled && <span className="flex items-center gap-1 text-xs text-emerald-700 font-bold bg-emerald-100 px-2 py-1 rounded-full"><Zap className="w-3 h-3" /> ACTIVE</span>}
                </div>
              </Card>
            ))}
          </div>
          <Card className="p-5 bg-slate-50">
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Bell className="w-4 h-4 text-blue-600" /> Price Alert Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              {[{ label:'Alert when price drops >', value:'5%', desc:'from 30-day avg' }, { label:'Alert when supply drops >', value:'20%', desc:'from normal levels' }, { label:'Auto-cancel window', value:'2 hours', desc:'after order triggered' }].map(s => (
                <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-3">
                  <p className="text-xs text-slate-500">{s.label}</p>
                  <p className="font-bold text-blue-700 text-lg">{s.value}</p>
                  <p className="text-xs text-slate-400">{s.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
