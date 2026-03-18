'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ShoppingCart, TrendingUp, Users, BarChart3, ArrowRight,
  Search, Bot, Bell, FileText, Package, CheckCircle, Star, Shield,
  Upload, Eye, MessageSquare, Zap, Layers, Globe, Building2, Award,
  ChevronRight, Sparkles, BookOpen, RefreshCw, Clock, Handshake, BadgePercent, Truck, X,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────
interface Step {
  num: number
  title: string
  desc: string
  icon: React.ElementType
  color: string
  bg: string
  sub?: string[]
}

// ── Buyer Steps ───────────────────────────────────────────────────────
const BUYER_STEPS: Step[] = [
  {
    num: 1,
    title: 'Register & Set Up',
    desc: 'Create your buyer account and set your country, language and company profile.',
    icon: Building2,
    color: 'text-ocean-700',
    bg: 'bg-ocean-50 border-ocean-200',
    sub: ['Choose country & language', 'Set up company profile', 'Verify email'],
  },
  {
    num: 2,
    title: 'Browse the Marketplace',
    desc: 'Navigate to Marketplace → Buy. Filter by species, origin, certifications, price range and availability.',
    icon: Search,
    color: 'text-violet-700',
    bg: 'bg-violet-50 border-violet-200',
    sub: ['Search by species or keyword', 'Filter: origin, certifications, freezing method', 'Sort by price, rating or availability', 'Browse by category (Frozen / Fresh / Value Added / Specials)'],
  },
  {
    num: 3,
    title: 'Check Live Market Prices',
    desc: 'Visit the Prices page to see live wholesale rates from 15+ global sources before you commit.',
    icon: BarChart3,
    color: 'text-purple-700',
    bg: 'bg-purple-50 border-purple-200',
    sub: ['38+ price items across all categories', 'Source comparison (GLOBEFISH, EUMOFA, Urner Barry…)', '6-month price history charts', 'Set price alerts for target thresholds'],
  },
  {
    num: 4,
    title: 'Use the AI Buyer Assistant',
    desc: 'Let the AI analyse your purchase history, detect savings opportunities, and build you an optimised Q2 purchasing plan.',
    icon: Bot,
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-200',
    sub: ['Dashboard: volume & profit charts, waste analysis', 'AI Chat: 5-step guided purchasing plan', 'Opportunities: oversupply alerts, group-buy windows', 'Auto-Order triggers: set target price → AI executes'],
  },
  {
    num: 5,
    title: 'Request a Quote',
    desc: 'Click "Get Quote" on any product card to submit your quantity, target price and delivery requirements.',
    icon: MessageSquare,
    color: 'text-sky-700',
    bg: 'bg-sky-50 border-sky-200',
    sub: ['Quantity & target price $/kg', 'Delivery date & destination port', 'Special requirements', 'Protected by SeaHub Trade Guarantee'],
  },
  {
    num: 6,
    title: 'Post a Buy Request (Optional)',
    desc: 'Publish your buying requirements so verified suppliers can find and approach you.',
    icon: FileText,
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
    sub: ['Category, quantity (MT/kg)', 'Target price & certifications needed', 'Destination port & deadline', 'Visible to all verified suppliers'],
  },
  {
    num: 7,
    title: 'Join a Group Buy (Optional)',
    desc: 'Combine purchasing power with other buyers to unlock volume discounts on bulk orders.',
    icon: Users,
    color: 'text-pink-700',
    bg: 'bg-pink-50 border-pink-200',
    sub: ['Browse active group buys by species', 'Set your allocation quantity', 'Confirm participation before deadline', 'Consolidated shipping to your port'],
  },
  {
    num: 8,
    title: 'Track Orders & Manage Dashboard',
    desc: 'Monitor all orders, inquiries, saved products and price alerts from your personal dashboard.',
    icon: Eye,
    color: 'text-teal-700',
    bg: 'bg-teal-50 border-teal-200',
    sub: ['Order ID, status & delivery timeline', 'Saved products & favourite suppliers', 'Active price alerts & notifications', 'Customisable widget layout'],
  },
]

// ── Seller Steps ──────────────────────────────────────────────────────
const SELLER_STEPS: Step[] = [
  {
    num: 1,
    title: 'Register as a Producer',
    desc: 'Complete the 12-section producer onboarding to build a verified supplier profile.',
    icon: Building2,
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-200',
    sub: ['Company identity & facilities', 'Product portfolio & annual volumes', 'Certifications (MSC, ASC, HALAL, BAP…)', 'Export experience & commercial terms'],
  },
  {
    num: 2,
    title: 'Get Verified',
    desc: 'Submit your business documents for platform verification to unlock 5× more buyer visibility.',
    icon: Shield,
    color: 'text-ocean-700',
    bg: 'bg-ocean-50 border-ocean-200',
    sub: ['Upload business registration & bank references', 'Verification review within 2 hours', 'Earn the verified supplier badge', 'Access premium buyer accounts'],
  },
  {
    num: 3,
    title: 'Navigate to Marketplace → Sell',
    desc: 'Open your seller dashboard to see stats, manage listings and spot buyer demand signals.',
    icon: TrendingUp,
    color: 'text-violet-700',
    bg: 'bg-violet-50 border-violet-200',
    sub: ['Active listings count', 'Total inquiries & volume sold', 'Revenue (month-to-date)', 'Near-expiry stock alerts'],
  },
  {
    num: 4,
    title: 'Create a New Listing',
    desc: 'Use the 4-step listing form to publish your product to all verified buyers globally.',
    icon: Upload,
    color: 'text-purple-700',
    bg: 'bg-purple-50 border-purple-200',
    sub: [
      'Step 1 – Product info: name, category, sub-type, origin, processing',
      'Step 2 – Pricing: $/kg, stock, min/max order, AI price suggestion, margin calculator',
      'Step 3 – Certifications: upload PDFs, select standards',
      'Step 4 – Review & publish (anonymous or public)',
    ],
  },
  {
    num: 5,
    title: 'Use AI Pricing Suggestion',
    desc: 'Let the AI recommend the optimal price based on market lows, demand signals and your target margin.',
    icon: Sparkles,
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
    sub: ['Market Low / AI Recommended / Premium Cap', 'Justification shown (e.g. "Norwegian salmon prices +EU demand")', 'Built-in profit margin calculator', 'Cost price → margin % displayed in real time'],
  },
  {
    num: 6,
    title: 'Design Product Packaging (Optional)',
    desc: 'Use the AI Packaging Designer to generate country-specific label mockups for your target markets.',
    icon: Layers,
    color: 'text-sky-700',
    bg: 'bg-sky-50 border-sky-200',
    sub: ['Select target market (US, EU, Japan, China…)', 'Auto-generate front/back/side label mockups', 'Country-specific regulatory requirements', 'Download ready-to-print label files'],
  },
  {
    num: 7,
    title: 'Manage Near-Expiry Stock',
    desc: 'Get alerted to expiring inventory and instantly list it for buyout to processors at a reduced price.',
    icon: RefreshCw,
    color: 'text-orange-700',
    bg: 'bg-orange-50 border-orange-200',
    sub: ['Auto-alert when stock expires within 14 days', '"List for Buyout" connects with processors directly', 'Reduced listing price for fast clearance', 'Prevents waste & recovers value'],
  },
  {
    num: 8,
    title: 'Respond to Inquiries & Build Reputation',
    desc: 'Reply to buyer quote requests promptly, fulfil orders, and grow your verified rating on the platform.',
    icon: Star,
    color: 'text-pink-700',
    bg: 'bg-pink-50 border-pink-200',
    sub: ['Target < 2 hour response time', 'Buyer ratings & reviews are public', 'Track views & inquiries per listing', 'Top-rated sellers receive featured placement'],
  },
]

// ── Group Buy Steps ───────────────────────────────────────────────────
const GROUP_BUY_STEPS: Step[] = [
  {
    num: 1,
    title: 'Register & Set Up Your Profile',
    desc: 'Create a buyer account and complete your company profile to access group buy opportunities.',
    icon: Building2,
    color: 'text-violet-700',
    bg: 'bg-violet-50 border-violet-200',
    sub: ['Company name, country & contact details', 'Set purchasing preferences & species of interest', 'Verify email to unlock full access'],
  },
  {
    num: 2,
    title: 'Browse Active Group Buys',
    desc: 'Navigate to Marketplace → Group Buy to see all open group purchase opportunities by species and category.',
    icon: Search,
    color: 'text-pink-700',
    bg: 'bg-pink-50 border-pink-200',
    sub: ['Filter by species, category & destination port', 'See current participants & quantities', 'View target price vs current market price', 'Check deadline & minimum fill threshold'],
  },
  {
    num: 3,
    title: 'Check the Group Price vs Market',
    desc: 'Compare the group discount price against live market rates on the Prices page to validate the saving.',
    icon: BarChart3,
    color: 'text-purple-700',
    bg: 'bg-purple-50 border-purple-200',
    sub: ['Group price vs 15+ global market sources', 'Estimated saving per kg and per order', 'Historical price trend for the species', 'Confidence level based on number of sources'],
  },
  {
    num: 4,
    title: 'Join & Set Your Allocation',
    desc: 'Click "Join Group Buy" and use the quantity slider to set how many kg or MT you want to commit.',
    icon: Users,
    color: 'text-violet-700',
    bg: 'bg-violet-50 border-violet-200',
    sub: ['Minimum and maximum allocation per participant', 'Real-time total quantity bar shows fill %', 'Your estimated cost shown instantly', 'Allocation locked once you confirm'],
  },
  {
    num: 5,
    title: 'Confirm Participation Before Deadline',
    desc: 'Submit your allocation before the group buy closes. Once the minimum threshold is reached the order is activated.',
    icon: Clock,
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
    sub: ['Countdown timer per group buy', 'Email notification when threshold is met', 'Order auto-cancelled if minimum not reached', 'Refund within 48h if group buy fails'],
  },
  {
    num: 6,
    title: 'Order Consolidated & Dispatched',
    desc: 'Once the group buy closes successfully, all allocations are merged into one consolidated shipment per destination port.',
    icon: Package,
    color: 'text-sky-700',
    bg: 'bg-sky-50 border-sky-200',
    sub: ['Single consolidated ship date for all participants', 'Shared container cost reduces freight per kg', 'QC & inspection before loading', 'Bill of lading issued per buyer'],
  },
  {
    num: 7,
    title: 'Track Shipment in Real Time',
    desc: 'Follow your order through every logistics stage — from production to your port of destination.',
    icon: Truck,
    color: 'text-teal-700',
    bg: 'bg-teal-50 border-teal-200',
    sub: ['Visual timeline: Confirmed → Production → QC → Loading → Shipping → Delivered', 'ETA updates per stage', 'Document downloads (COA, health cert, invoice)', 'Direct messaging with supplier if needed'],
  },
  {
    num: 8,
    title: 'Receive, Inspect & Rate',
    desc: 'Take delivery at your port, inspect the goods, and leave a rating for the supplier to build platform trust.',
    icon: Star,
    color: 'text-pink-700',
    bg: 'bg-pink-50 border-pink-200',
    sub: ['Match delivery against specifications & certifications', 'Lodge any quality claims within 72h', 'Rate supplier on quality, accuracy & response time', 'Saved order history for future reference'],
  },
]

// ── Step Card ─────────────────────────────────────────────────────────
function StepCard({ step, last }: { step: Step; last: boolean }) {
  const Icon = step.icon
  return (
    <div className="relative flex gap-4">
      {/* Connector line */}
      {!last && (
        <div className="absolute left-[22px] top-12 bottom-0 w-0.5 bg-slate-200 z-0" />
      )}

      {/* Circle number */}
      <div className={`relative z-10 flex-shrink-0 w-11 h-11 rounded-full border-2 flex items-center justify-center font-bold text-sm ${step.bg} ${step.color}`}>
        {step.num}
      </div>

      {/* Content */}
      <div className={`flex-1 mb-6 rounded-2xl border p-5 ${step.bg}`}>
        <div className="flex items-start gap-3 mb-2">
          <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${step.color}`} />
          <div>
            <h3 className={`font-bold text-base ${step.color}`}>{step.title}</h3>
            <p className="text-slate-600 text-sm mt-1 leading-relaxed">{step.desc}</p>
          </div>
        </div>
        {step.sub && (
          <ul className="mt-3 space-y-1.5 ml-8">
            {step.sub.map(s => (
              <li key={s} className="flex items-start gap-2 text-sm text-slate-600">
                <ChevronRight className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${step.color}`} />
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

// ── Shared Modal Shell ────────────────────────────────────────────────
function Modal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  )
}

// ── Buy Modal ─────────────────────────────────────────────────────────
function BuyModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ category: '', quantity: '', unit: 'MT', targetPrice: '', port: '' })
  const [done, setDone] = useState(false)
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  const inputCls = 'w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-400'

  if (done) return (
    <Modal onClose={onClose}>
      <div className="text-center py-4">
        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800 mb-1">Buy Request Submitted!</h3>
        <p className="text-sm text-slate-500 mb-6">Verified suppliers will contact you shortly.</p>
        <Link href="/marketplace/buy" onClick={onClose} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ocean-600 text-white text-sm font-semibold hover:bg-ocean-700 transition-colors">
          <ShoppingCart className="w-4 h-4" /> Browse All Products
        </Link>
      </div>
    </Modal>
  )

  return (
    <Modal onClose={onClose}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-ocean-100"><ShoppingCart className="w-5 h-5 text-ocean-600" /></div>
        <div>
          <h3 className="font-bold text-slate-800">Post a Buy Request</h3>
          <p className="text-xs text-slate-500">Let 48,200+ suppliers come to you</p>
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1 block">Product Category *</label>
          <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls}>
            <option value="">Select category…</option>
            {['Atlantic Salmon','Shrimp','Tuna','Cod','Tilapia','Sea Bass','Crab','Lobster','Squid','Oysters'].map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Quantity *</label>
            <input type="number" placeholder="e.g. 10" value={form.quantity} onChange={e => set('quantity', e.target.value)} className={inputCls} />
          </div>
          <div className="w-24">
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Unit</label>
            <select value={form.unit} onChange={e => set('unit', e.target.value)} className={inputCls}>
              <option>MT</option><option>kg</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1 block">Target Price ($/kg)</label>
          <input type="number" step="0.01" placeholder="e.g. 4.50" value={form.targetPrice} onChange={e => set('targetPrice', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1 block">Destination Port</label>
          <input placeholder="e.g. Rotterdam, Hamburg, Dubai" value={form.port} onChange={e => set('port', e.target.value)} className={inputCls} />
        </div>
      </div>
      <button
        disabled={!form.category || !form.quantity}
        onClick={() => setDone(true)}
        className="mt-6 w-full py-3 rounded-xl bg-ocean-600 text-white font-semibold text-sm hover:bg-ocean-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Submit Buy Request
      </button>
    </Modal>
  )
}

// ── Sell Modal ────────────────────────────────────────────────────────
function SellModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: '', category: '', price: '', quantity: '', port: '' })
  const [done, setDone] = useState(false)
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  const inputCls = 'w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400'

  if (done) return (
    <Modal onClose={onClose}>
      <div className="text-center py-4">
        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800 mb-1">Listing Created!</h3>
        <p className="text-sm text-slate-500 mb-6">Your product is now visible to verified buyers worldwide.</p>
        <Link href="/marketplace/sell" onClick={onClose} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors">
          <TrendingUp className="w-4 h-4" /> Manage My Listings
        </Link>
      </div>
    </Modal>
  )

  return (
    <Modal onClose={onClose}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-emerald-100"><TrendingUp className="w-5 h-5 text-emerald-600" /></div>
        <div>
          <h3 className="font-bold text-slate-800">Create a Listing</h3>
          <p className="text-xs text-slate-500">Reach buyers in 40+ countries instantly</p>
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1 block">Product Name *</label>
          <input placeholder="e.g. Norwegian Atlantic Salmon HOG" value={form.name} onChange={e => set('name', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1 block">Category *</label>
          <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls}>
            <option value="">Select category…</option>
            {['Frozen Fish','Fresh Fish','Shrimp & Prawns','Crab & Lobster','Squid & Octopus','Value Added','Live Seafood'].map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Price ($/kg) *</label>
            <input type="number" step="0.01" placeholder="e.g. 5.80" value={form.price} onChange={e => set('price', e.target.value)} className={inputCls} />
          </div>
          <div className="flex-1">
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Stock (MT)</label>
            <input type="number" placeholder="e.g. 20" value={form.quantity} onChange={e => set('quantity', e.target.value)} className={inputCls} />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1 block">Origin / Port of Loading</label>
          <input placeholder="e.g. Bergen, Norway" value={form.port} onChange={e => set('port', e.target.value)} className={inputCls} />
        </div>
      </div>
      <button
        disabled={!form.name || !form.category || !form.price}
        onClick={() => setDone(true)}
        className="mt-6 w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Publish Listing
      </button>
    </Modal>
  )
}

// ── Group Buy Modal ───────────────────────────────────────────────────
function GroupBuyModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ species: '', quantity: '', port: '', company: '' })
  const [done, setDone] = useState(false)
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  const inputCls = 'w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400'

  if (done) return (
    <Modal onClose={onClose}>
      <div className="text-center py-4">
        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800 mb-1">You're In!</h3>
        <p className="text-sm text-slate-500 mb-6">Your allocation has been reserved. You'll be notified when the group buy reaches its threshold.</p>
        <Link href="/marketplace/group-buy" onClick={onClose} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors">
          <Users className="w-4 h-4" /> View All Group Buys
        </Link>
      </div>
    </Modal>
  )

  return (
    <Modal onClose={onClose}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-violet-100"><Users className="w-5 h-5 text-violet-600" /></div>
        <div>
          <h3 className="font-bold text-slate-800">Join a Group Buy</h3>
          <p className="text-xs text-slate-500">Combine orders for bulk pricing discounts</p>
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1 block">Species / Product *</label>
          <select value={form.species} onChange={e => set('species', e.target.value)} className={inputCls}>
            <option value="">Select species…</option>
            {['Atlantic Salmon','Vannamei Shrimp','Yellowfin Tuna','Cod Loins','Tilapia Fillets','Sea Bass','Snow Crab','Squid Rings'].map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1 block">Your Allocation (MT) *</label>
          <input type="number" placeholder="e.g. 5" value={form.quantity} onChange={e => set('quantity', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1 block">Destination Port</label>
          <input placeholder="e.g. Rotterdam, Dubai, Tokyo" value={form.port} onChange={e => set('port', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1 block">Company Name</label>
          <input placeholder="Your company name" value={form.company} onChange={e => set('company', e.target.value)} className={inputCls} />
        </div>
      </div>
      <button
        disabled={!form.species || !form.quantity}
        onClick={() => setDone(true)}
        className="mt-6 w-full py-3 rounded-xl bg-violet-600 text-white font-semibold text-sm hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Reserve My Allocation
      </button>
    </Modal>
  )
}

// ── Page ──────────────────────────────────────────────────────────────
export default function PlatformGuidePage() {
  const [modal, setModal] = useState<'buy' | 'sell' | 'group-buy' | null>(null)

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Modals */}
      {modal === 'buy'       && <BuyModal      onClose={() => setModal(null)} />}
      {modal === 'sell'      && <SellModal     onClose={() => setModal(null)} />}
      {modal === 'group-buy' && <GroupBuyModal onClose={() => setModal(null)} />}

      {/* Header */}
      <div className="bg-gradient-to-br from-ocean-900 via-ocean-800 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <Link href="/" className="inline-flex items-center gap-2 text-ocean-200 hover:text-white text-sm mb-8 transition-colors">
            <ArrowRight className="w-4 h-4 rotate-180" /> Back to Platform
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-sm">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <span className="text-ocean-200 text-sm font-semibold uppercase tracking-widest">SeaHub Platform Guide</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            How to Buy & Sell<br />
            <span className="text-ocean-200">Seafood on SeaHub</span>
          </h1>
          <p className="text-ocean-100 text-lg max-w-2xl leading-relaxed">
            A complete A-to-Z walkthrough of every step — from registration to fulfilled order — for both buyers and sellers on the platform.
          </p>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {[
              { label: 'Product Categories', value: '4' },
              { label: 'Price Sources', value: '15+' },
              { label: 'Supported Countries', value: '40+' },
              { label: 'Certifications', value: '10+' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15">
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-ocean-200 text-sm mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* What is SeaHub */}
        <section className="mb-14">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-ocean-600" /> What is SeaHub?
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              SeaHub is a <strong>global B2B seafood trading platform</strong> — combining a marketplace, live price intelligence, AI-powered purchasing tools, group buying, and supplier verification in one place. Think of it as the Bloomberg + Alibaba + LinkedIn of the seafood world.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              {[
                { icon: ShoppingCart, title: 'Buy',       desc: 'Browse 38+ products, compare prices from 15 sources, request quotes, or let the AI build your purchasing plan.', color: 'text-ocean-600',   bg: 'bg-ocean-50',   border: 'border-ocean-200',   action: 'buy'       as const, cta: 'Post a Buy Request'    },
                { icon: TrendingUp,   title: 'Sell',      desc: 'List products in 4 steps, get AI pricing recommendations, manage certifications, and respond to buyer inquiries.', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', action: 'sell'      as const, cta: 'Create a Listing'       },
                { icon: Users,        title: 'Group Buy', desc: 'Join forces with other buyers to reach volume thresholds and unlock bulk pricing discounts.',                       color: 'text-violet-600',  bg: 'bg-violet-50',  border: 'border-violet-200',  action: 'group-buy' as const, cta: 'Join a Group Buy'      },
              ].map(card => {
                const Icon = card.icon
                return (
                  <button key={card.title} onClick={() => setModal(card.action)} className={`text-left rounded-2xl p-5 border ${card.bg} ${card.border} hover:shadow-md transition-shadow group w-full`}>
                    <Icon className={`w-6 h-6 ${card.color} mb-3`} />
                    <div className="font-bold text-slate-800 mb-1">{card.title}</div>
                    <p className="text-sm text-slate-600 leading-relaxed mb-3">{card.desc}</p>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${card.color} group-hover:underline`}>
                      {card.cta} <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* Three-column flows */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Buyer Flow ── */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-ocean-600 text-white">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Buyer Flow</h2>
                <p className="text-sm text-slate-500">From registration to fulfilled order</p>
              </div>
            </div>
            <div>
              {BUYER_STEPS.map((step, i) => (
                <StepCard key={step.num} step={step} last={i === BUYER_STEPS.length - 1} />
              ))}
            </div>
            <button onClick={() => setModal('buy')}
              className="mt-2 flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-ocean-600 text-white font-semibold text-sm hover:bg-ocean-700 transition-colors">
              <ShoppingCart className="w-4 h-4" /> Start Buying
            </button>
          </section>

          {/* ── Group Buy Flow ── */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-violet-600 text-white">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Group Buy Flow</h2>
                <p className="text-sm text-slate-500">From joining to consolidated delivery</p>
              </div>
            </div>
            <div>
              {GROUP_BUY_STEPS.map((step, i) => (
                <StepCard key={step.num} step={step} last={i === GROUP_BUY_STEPS.length - 1} />
              ))}
            </div>
            <button onClick={() => setModal('group-buy')}
              className="mt-2 flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-violet-600 text-white font-semibold text-sm hover:bg-violet-700 transition-colors">
              <Users className="w-4 h-4" /> Join a Group Buy
            </button>
          </section>

          {/* ── Seller Flow ── */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-emerald-600 text-white">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Seller Flow</h2>
                <p className="text-sm text-slate-500">From onboarding to fulfilled listing</p>
              </div>
            </div>
            <div>
              {SELLER_STEPS.map((step, i) => (
                <StepCard key={step.num} step={step} last={i === SELLER_STEPS.length - 1} />
              ))}
            </div>
            <button onClick={() => setModal('sell')}
              className="mt-2 flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-colors">
              <TrendingUp className="w-4 h-4" /> Start Selling
            </button>
          </section>

        </div>

        {/* Key platform features */}
        <section className="mt-14">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" /> Key Platform Features
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: Bot,       title: 'AI Buyer Assistant',    desc: 'Detects buying opportunities, builds purchasing plans and sets auto-order triggers.',           color: 'text-violet-600', bg: 'bg-violet-50 border-violet-200' },
              { icon: BarChart3, title: 'Live Price Intelligence',desc: '38+ product prices from 15 global sources with 6-month history and alert notifications.',    color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
              { icon: Users,     title: 'Group Buying',          desc: 'Combine orders with other buyers to hit volume thresholds and unlock lower per-kg prices.',    color: 'text-pink-600',   bg: 'bg-pink-50 border-pink-200' },
              { icon: Sparkles,  title: 'AI Pricing for Sellers',desc: 'Recommends optimal listing price with margin calculator and market justification.',           color: 'text-amber-600',  bg: 'bg-amber-50 border-amber-200' },
              { icon: Layers,    title: 'AI Packaging Designer', desc: 'Generates country-specific label mockups with regulatory compliance for 10+ target markets.', color: 'text-sky-600',    bg: 'bg-sky-50 border-sky-200' },
              { icon: Award,     title: 'Certification Hub',     desc: 'MSC, ASC, GlobalG.A.P., BAP, HALAL, KOSHER and more — upload, verify and display with ease.', color: 'text-emerald-600',bg: 'bg-emerald-50 border-emerald-200' },
            ].map(f => {
              const Icon = f.icon
              return (
                <div key={f.title} className={`rounded-2xl border p-5 ${f.bg}`}>
                  <Icon className={`w-5 h-5 ${f.color} mb-3`} />
                  <div className={`font-bold text-sm mb-1 ${f.color}`}>{f.title}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Footer CTA */}
        <div className="mt-14 rounded-3xl bg-gradient-to-br from-ocean-900 to-teal-700 text-white p-10 text-center">
          <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Ready to get started?</h2>
          <p className="text-ocean-200 mb-8 max-w-md mx-auto">
            Join thousands of seafood professionals trading smarter with AI-powered tools and live market intelligence.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => setModal('buy')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-ocean-700 font-semibold hover:bg-ocean-50 transition-colors">
              <ShoppingCart className="w-4 h-4" /> Start Buying
            </button>
            <button onClick={() => setModal('sell')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/15 text-white border border-white/25 font-semibold hover:bg-white/25 transition-colors">
              <TrendingUp className="w-4 h-4" /> Start Selling
            </button>
            <button onClick={() => setModal('group-buy')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/15 text-white border border-white/25 font-semibold hover:bg-white/25 transition-colors">
              <Users className="w-4 h-4" /> Join a Group Buy
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
