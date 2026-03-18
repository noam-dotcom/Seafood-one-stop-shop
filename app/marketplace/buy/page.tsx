'use client'

import { useState, useMemo } from 'react'
import {
  Search, SlidersHorizontal, Star, CheckCircle, Mic, Heart,
  MessageSquare, ShoppingCart, Zap, Bot, MapPin, Package,
  Clock, TrendingDown, X, Eye, ArrowUpDown, Fish,
  Plus, Send, FileText, Trash2, ArrowRight
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getAllStaticProducts, CERTIFICATIONS, SPECIES, PLATFORM_CATEGORIES, type Product } from '@/lib/data'
import { getAdminProducts } from '@/lib/product-store'
import { PlatformCategoryBar } from '@/components/PlatformCategoryBar'
import { formatPrice, cn } from '@/lib/utils'
import { useT } from '@/lib/i18n'
import AIBuyer from '@/components/AIBuyer'
import AIPackagingDesigner from '@/components/AIPackagingDesigner'

const PROCESSING_TYPES = ['All', 'Fresh', 'Fresh Chilled', 'Fresh Frozen', 'Frozen', 'Cooked Frozen',
  'Smoked', 'Breaded Frozen', 'Marinated Frozen', 'Formed Frozen', 'Frozen Mix', 'Super Frozen (-60°C)', 'Live',
  'Ready-to-Eat Chilled', 'Chilled Specialty', 'Cured Specialty', 'Cured Chilled']

const ORIGIN_COUNTRIES = ['All', 'Norway', 'Chile', 'Ecuador', 'USA', 'Canada', 'Maldives', 'Indonesia',
  'Vietnam', 'Thailand', 'India', 'China', 'Bangladesh', 'Egypt', 'Israel', 'Spain', 'Scotland', 'Japan',
  'Nicaragua', 'Greece', 'Turkey', 'Italy', 'Malta', 'France', 'Iceland', 'Ireland', 'Mexico', 'Peru', 'Australia']

const SORT_OPTIONS = ['Best Match', 'Price: Low to High', 'Price: High to Low', 'Rating', 'Availability', 'Stock Volume']

// ─── Sub-type maps per new category ───────────────────────────
const SUBTYPES: Record<string, string[]> = {
  'frozen-seafood':     ['Atlantic Salmon', 'Yellowfin Tuna', 'Tilapia', 'Shrimp', 'Lobster', 'Yellowtail / Hamachi'],
  'frozen-value-added': ['Breaded', 'Marinated', 'Smoked', 'Burgers & Patties', 'Seafood Mix', 'Calamari'],
  'seafood-specials':   ['Caviar', 'Bottarga', 'Carpaccio', 'Ceviche', 'Seafood Salad', 'Gravlax', 'King Crab', 'Octopus'],
  'fresh-seafood':      ['Atlantic Salmon', 'Bluefin Tuna', 'Yellowfin Tuna', 'Hamachi', 'Sea Bass', 'Sea Bream', 'Halibut', 'Cod', 'Grouper', 'Red Snapper', 'Mahi-Mahi', 'Swordfish', 'Mackerel', 'King Salmon'],
}

function SubTypeFilter({ category, selected, onSelect }: { category: string; selected: string; onSelect: (s: string) => void }) {
  const types = category !== 'all' ? SUBTYPES[category] : []
  if (!types || types.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1.5 py-2 border-t border-slate-100 mt-1">
      <button
        onClick={() => onSelect('all')}
        className={cn('px-2.5 py-1 rounded-full text-xs font-medium transition-all',
          selected === 'all' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}
      >
        All types
      </button>
      {types.map(t => (
        <button
          key={t}
          onClick={() => onSelect(t)}
          className={cn('px-2.5 py-1 rounded-full text-xs font-medium transition-all',
            selected === t ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}
        >
          {t}
        </button>
      ))}
    </div>
  )
}

function ProductCard({ product, onContact }: { product: Product; onContact: (p: Product) => void }) {
  const [saved, setSaved] = useState(false)
  const priceChange = product.priceHistory[product.priceHistory.length - 1] - product.priceHistory[0]
  const priceChangePercent = (priceChange / product.priceHistory[0] * 100).toFixed(1)
  const isDown = priceChange < 0

  const catColor: Record<string, string> = {
    'frozen-seafood':     'bg-sky-50 border-sky-200',
    'frozen-value-added': 'bg-violet-50 border-violet-200',
    'seafood-specials':   'bg-orange-50 border-orange-200',
    'fresh-seafood':      'bg-emerald-50 border-emerald-200',
  }
  const productCat = product.newCategory ?? 'frozen-seafood'

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border', catColor[productCat] || 'bg-slate-50 border-slate-100')}>
              {product.image}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 text-sm leading-tight mb-0.5 line-clamp-2">{product.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
                <MapPin className="w-3 h-3" />{product.origin}
                <span>·</span><span>{product.processingType}</span>
                <span>·</span><span>{product.size}</span>
              </div>
            </div>
          </div>
          <button onClick={() => setSaved(!saved)} className="p-1.5 hover:bg-slate-100 rounded-lg flex-shrink-0">
            <Heart className={cn('w-4 h-4', saved ? 'fill-red-500 text-red-500' : 'text-slate-300')} />
          </button>
        </div>

        {/* Category + Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          <Badge variant="ocean">{product.category}</Badge>
          {product.tags.slice(0, 2).map(tag => (
            <Badge key={tag} variant={tag === 'Best Seller' ? 'success' : tag === 'Limited' ? 'warning' : 'default'}>
              {tag}
            </Badge>
          ))}
        </div>

        {/* Certifications */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.certification.slice(0, 4).map(cert => {
            const ci = CERTIFICATIONS.find(c => c.code === cert)
            return (
              <span key={cert} title={ci?.name || cert}
                className="inline-flex items-center gap-1 text-xs bg-slate-50 border border-slate-200 rounded-md px-1.5 py-0.5 text-slate-600 font-medium">
                {ci?.icon} {cert}
              </span>
            )
          })}
        </div>

        {/* Price */}
        <div className="bg-gradient-to-br from-slate-50 to-ocean-50/30 rounded-xl p-3 mb-3">
          <div className="flex items-end justify-between mb-1">
            <div>
              <span className="text-2xl font-bold text-slate-900">{formatPrice(product.price)}</span>
              <span className="text-slate-500 text-sm ml-1">/{product.unit}</span>
            </div>
            <div className={cn('flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full',
              isDown ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600')}>
              {isDown ? '▼' : '▲'} {Math.abs(Number(priceChangePercent))}%
            </div>
          </div>
          {product.competitorPrices.map(cp => (
            <div key={cp.supplier} className="flex items-center justify-between text-xs mt-0.5">
              <span className="text-slate-400">{cp.supplier}</span>
              <span className={cn('font-semibold', cp.price > product.price ? 'text-emerald-600' : 'text-red-500')}>
                {formatPrice(cp.price)} {cp.price > product.price ? '▲ Higher' : '▼ Cheaper'}
              </span>
            </div>
          ))}
        </div>

        {/* Order info */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5"><Package className="w-3.5 h-3.5 text-slate-400" />Min: {product.minOrder.toLocaleString()} kg</div>
          <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" />{product.availability}</div>
        </div>

        {/* Supplier */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-ocean-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {product.supplierName[0]}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-700 truncate max-w-[120px]">{product.supplierName}</span>
                {product.supplierVerified && <CheckCircle className="w-3 h-3 text-emerald-500" />}
              </div>
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-xs text-slate-500">{product.supplierRating}</span>
              </div>
            </div>
          </div>
          <Badge variant={product.supplierVerified ? 'success' : 'default'}>
            {product.supplierVerified ? '✓ Verified' : 'Unverified'}
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="primary" size="sm" className="flex-1">
            <ShoppingCart className="w-4 h-4" />Get Quote
          </Button>
          <Button variant="secondary" size="sm" onClick={() => onContact(product)}>
            <MessageSquare className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

function FilterSidebar({ filters, setFilters }: {
  filters: Record<string, string>
  setFilters: (f: Record<string, string>) => void
}) {
  const t = useT()
  return (
    <div className="space-y-5">
      <h3 className="font-semibold text-slate-900">{t('page.buy.filters')}</h3>

      {[
        { label: t('page.buy.origin'), key: 'origin', options: ORIGIN_COUNTRIES },
        { label: t('page.buy.processingType'), key: 'processing', options: PROCESSING_TYPES },
      ].map(({ label, key, options }) => (
        <div key={key}>
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">{label}</p>
          <select
            value={filters[key] || 'All'}
            onChange={e => setFilters({ ...filters, [key]: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ocean-300"
          >
            {options.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      ))}

      <div>
        <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Certifications</p>
        <div className="grid grid-cols-2 gap-1.5">
          {CERTIFICATIONS.map(cert => (
            <button key={cert.code}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors text-left">
              <span>{cert.icon}</span>{cert.code}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Price Range ($/kg)</p>
        <div className="flex items-center gap-2">
          <input type="number" placeholder="Min" className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs" />
          <span className="text-slate-400">—</span>
          <input type="number" placeholder="Max" className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs" />
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Availability</p>
        <div className="space-y-1.5">
          {['In Stock', 'Limited Stock', 'Seasonal', 'Pre-Order'].map(opt => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300" />
              <span className="text-xs text-slate-600">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Freezing Method</p>
        <div className="space-y-1.5">
          {['IQF', 'Block Frozen', 'Super Frozen (-60°C)', 'N/A (Fresh/Live)'].map(opt => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300" />
              <span className="text-xs text-slate-600">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      <Button variant="primary" size="sm" className="w-full">Apply Filters</Button>
      <button
        onClick={() => setFilters({})}
        className="w-full text-xs text-slate-400 hover:text-slate-600 transition-colors"
      >
        Clear all filters
      </button>
    </div>
  )
}

// ─── Types ─────────────────────────────────────────────────────────────────
interface BuyRequest {
  id: string; category: string; subtype: string; quantity: string
  unit: string; targetPrice: string; port: string; deadline: string
  certs: string[]; notes: string; createdAt: string
}

// ─── Post Buy Request Modal ─────────────────────────────────────────────────
const BUY_UNITS = ['MT', 'kg']
const CERT_OPTIONS = ['MSC', 'ASC', 'GlobalG.A.P.', 'BRC', 'IFS', 'HALAL', 'KOSHER', 'BAP', 'Friend of the Sea']
const DEST_PORTS = ['Rotterdam', 'Hamburg', 'Antwerp', 'Le Havre', 'Amsterdam', 'Bremerhaven',
  'Dubai Jebel Ali', 'Miami', 'Los Angeles', 'New York', 'Tokyo', 'Singapore', 'Shanghai', 'Other']

function BuyRequestModal({ onClose, onSubmit }: {
  onClose: () => void
  onSubmit: (r: BuyRequest) => void
}) {
  const [form, setForm] = useState({
    category: '', subtype: '', quantity: '', unit: 'MT',
    targetPrice: '', port: '', deadline: '', notes: '',
    certs: [] as string[],
  })
  const [submitted, setSubmitted] = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  const toggleCert = (c: string) => setForm(f => ({
    ...f, certs: f.certs.includes(c) ? f.certs.filter(x => x !== c) : [...f.certs, c]
  }))

  const handleSubmit = () => {
    if (!form.category || !form.quantity) return
    onSubmit({
      id: `BR-${Date.now()}`,
      ...form,
      createdAt: new Date().toISOString().split('T')[0],
    })
    setSubmitted(true)
    setTimeout(() => { onClose() }, 1800)
  }

  const inputCls = 'w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ocean-300 bg-white'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="bg-gradient-to-r from-ocean-600 to-ocean-800 rounded-t-2xl p-5 flex-shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Post a Buy Request</h2>
              <p className="text-ocean-100 text-xs">Let 48,200+ verified suppliers find you</p>
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-9 h-9 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Request Posted!</h3>
            <p className="text-sm text-slate-500 text-center">Your buy request is now visible to all matching suppliers.</p>
          </div>
        ) : (
          <>
            <div className="overflow-y-auto flex-1 p-5 space-y-4">
              {/* Product */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Category *</label>
                  <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls}>
                    <option value="">Select category…</option>
                    {['Atlantic Salmon', 'Yellowfin Tuna', 'Tilapia', 'Shrimp', 'Lobster', 'Yellowtail / Hamachi', 'Value Added Seafood'].map(c =>
                      <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Product / Sub-type</label>
                  <input value={form.subtype} onChange={e => set('subtype', e.target.value)}
                    placeholder="e.g. Fillet Skin-On IQF" className={inputCls} />
                </div>
              </div>

              {/* Quantity + unit */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Required Quantity *</label>
                  <input type="number" value={form.quantity} onChange={e => set('quantity', e.target.value)}
                    placeholder="e.g. 20" className={inputCls} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Unit</label>
                  <select value={form.unit} onChange={e => set('unit', e.target.value)} className={inputCls}>
                    {BUY_UNITS.map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              {/* Price + port */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Target Price ($/kg)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                    <input type="number" step="0.01" value={form.targetPrice} onChange={e => set('targetPrice', e.target.value)}
                      placeholder="0.00" className={cn(inputCls, 'pl-7')} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Delivery Deadline</label>
                  <input type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} className={inputCls} />
                </div>
              </div>

              {/* Destination port */}
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Destination Port</label>
                <select value={form.port} onChange={e => set('port', e.target.value)} className={inputCls}>
                  <option value="">Select port…</option>
                  {DEST_PORTS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>

              {/* Certifications */}
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-2 block">Required Certifications</label>
                <div className="flex flex-wrap gap-1.5">
                  {CERT_OPTIONS.map(c => (
                    <button key={c} type="button" onClick={() => toggleCert(c)}
                      className={cn('px-2.5 py-1 rounded-full text-xs font-medium transition-all border',
                        form.certs.includes(c)
                          ? 'bg-ocean-600 text-white border-ocean-600'
                          : 'border-slate-200 text-slate-600 hover:border-ocean-300')}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Additional Requirements</label>
                <textarea rows={2} value={form.notes} onChange={e => set('notes', e.target.value)}
                  placeholder="Halal / Kosher, specific packaging, labelling, Incoterms preference…"
                  className={cn(inputCls, 'resize-none')} />
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-slate-100 flex-shrink-0 flex gap-2">
              <Button variant="secondary" onClick={onClose}>Cancel</Button>
              <Button variant="primary" className="flex-1" onClick={handleSubmit}
                disabled={!form.category || !form.quantity}>
                <Send className="w-4 h-4" />Post Buy Request
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function BuyPage() {
  const t = useT()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeSubType, setActiveSubType] = useState('all')
  const [sort, setSort] = useState('Best Match')
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [showFilters, setShowFilters] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showBuyRequest, setShowBuyRequest] = useState(false)
  const [myRequests, setMyRequests] = useState<BuyRequest[]>([])

  // Merge static + admin-added products
  const allProducts = useMemo(() => {
    const staticProds = getAllStaticProducts()
    const adminProds = typeof window !== 'undefined' ? getAdminProducts() : []
    return [...staticProds, ...adminProds]
  }, [])

  const filteredProducts = useMemo(() => {
    let result = allProducts.filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
          !p.species.toLowerCase().includes(search.toLowerCase()) &&
          !p.origin.toLowerCase().includes(search.toLowerCase()) &&
          !(p.speciesGroup ?? '').toLowerCase().includes(search.toLowerCase())) return false
      if (activeCategory !== 'all' && (p.newCategory ?? 'frozen-seafood') !== activeCategory) return false
      if (filters.origin && filters.origin !== 'All' && p.origin !== filters.origin) return false
      if (filters.processing && filters.processing !== 'All' && p.processingType !== filters.processing) return false
      return true
    })
    if (sort === 'Price: Low to High') result = [...result].sort((a, b) => a.price - b.price)
    if (sort === 'Price: High to Low') result = [...result].sort((a, b) => b.price - a.price)
    if (sort === 'Rating') result = [...result].sort((a, b) => b.supplierRating - a.supplierRating)
    if (sort === 'Stock Volume') result = [...result].sort((a, b) => b.stockQty - a.stockQty)
    return result
  }, [allProducts, search, activeCategory, activeSubType, sort, filters])

  const handleContact = (product: Product) => {
    setSelectedProduct(product)
    setShowContactModal(true)
  }

  // Category stats
  const catCount = (id: string) => id === 'all' ? allProducts.length : allProducts.filter(p => (p.newCategory ?? 'frozen-seafood') === id).length

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('page.buy.title')}</h1>
          <p className="text-slate-500 text-sm mt-1">
            {t('page.buy.subtitle')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Zap className="w-4 h-4 text-amber-500" />Near-Expiry Deals
          </Button>
          <Button variant="secondary" size="sm">
            <Bot className="w-4 h-4" />AI Sourcing
          </Button>
          <Button variant="primary" size="sm" onClick={() => setShowBuyRequest(true)}>
            <Plus className="w-4 h-4" />Post Buy Request
          </Button>
        </div>
      </div>

      {/* AI Buyer */}
      <AIBuyer />

      {/* AI Packaging Designer */}
      <AIPackagingDesigner />

      {/* My Buy Requests */}
      {myRequests.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-ocean-600" />My Buy Requests
              <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{myRequests.length}</span>
            </h2>
            <button onClick={() => setShowBuyRequest(true)}
              className="text-xs text-ocean-600 font-semibold hover:underline flex items-center gap-1">
              <Plus className="w-3 h-3" />Add Another
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {myRequests.map(req => (
              <Card key={req.id} className="p-4 border-ocean-100 bg-ocean-50/40">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs font-bold text-ocean-700 uppercase tracking-wide">{req.category}</p>
                    {req.subtype && <p className="text-xs text-slate-600">{req.subtype}</p>}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Active</span>
                    <button onClick={() => setMyRequests(r => r.filter(x => x.id !== req.id))}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-slate-600 mb-2">
                  <span className="flex items-center gap-1"><Package className="w-3 h-3 text-ocean-400" />{req.quantity} {req.unit}</span>
                  {req.targetPrice && <span className="flex items-center gap-1"><ArrowRight className="w-3 h-3 text-ocean-400" />Target ${req.targetPrice}/kg</span>}
                  {req.port && <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-ocean-400" />{req.port}</span>}
                  {req.deadline && <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-ocean-400" />{req.deadline}</span>}
                </div>
                {req.certs.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {req.certs.map(c => <span key={c} className="text-xs bg-white border border-ocean-200 text-ocean-700 px-1.5 py-0.5 rounded">{c}</span>)}
                  </div>
                )}
                <p className="text-xs text-slate-400 mt-2">Posted {req.createdAt} · ID: {req.id}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No requests CTA */}
      {myRequests.length === 0 && (
        <Card className="p-4 border-dashed border-2 border-ocean-200 bg-ocean-50/30 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Can&apos;t find what you need?</p>
            <p className="text-xs text-slate-500 mt-0.5">Post a buy request and let suppliers come to you</p>
          </div>
          <Button variant="primary" size="sm" onClick={() => setShowBuyRequest(true)}>
            <Plus className="w-4 h-4" />Post Buy Request
          </Button>
        </Card>
      )}

      {/* Search Row */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('page.buy.search')}
            className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ocean-300 bg-white"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-9 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
          <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-md" title="Voice search">
            <Mic className="w-4 h-4 text-slate-400" />
          </button>
        </div>
        <Button
          variant="secondary"
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? 'border-ocean-300 text-ocean-600 bg-ocean-50' : ''}
        >
          <SlidersHorizontal className="w-4 h-4" />{t('page.buy.filters')}
        </Button>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none hidden md:block"
        >
          {SORT_OPTIONS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Category Bar */}
      <PlatformCategoryBar
        selected={activeCategory}
        onSelect={(id) => { setActiveCategory(id); setActiveSubType('all') }}
        counts={Object.fromEntries(['all','frozen-seafood','frozen-value-added','seafood-specials','fresh-seafood'].map(id => [id, catCount(id)]))}
      />

      {/* Sub-type filter */}
      {activeCategory !== 'all' && (
        <SubTypeFilter category={activeCategory} selected={activeSubType} onSelect={setActiveSubType} />
      )}

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="hidden lg:block w-60 flex-shrink-0">
            <Card className="p-5 sticky top-20">
              <FilterSidebar filters={filters} setFilters={setFilters} />
            </Card>
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-slate-900">{filteredProducts.length}</span> products found
              {activeCategory !== 'all' && <span> in <span className="font-semibold text-ocean-600">{activeCategory}</span></span>}
            </p>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 bg-white md:hidden"
            >
              {SORT_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <Fish className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-lg font-medium">No products found</p>
              <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or search terms</p>
              <Button variant="secondary" className="mt-4" onClick={() => { setSearch(''); setActiveCategory('all'); setFilters({}) }}>
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onContact={handleContact} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Buy Request Modal */}
      {showBuyRequest && (
        <BuyRequestModal
          onClose={() => setShowBuyRequest(false)}
          onSubmit={(req) => { setMyRequests(r => [req, ...r]); setShowBuyRequest(false) }}
        />
      )}

      {/* Contact / Quote Modal */}
      {showContactModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowContactModal(false)} />
          <Card className="relative w-full max-w-md p-6 z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Request a Quote</h3>
              <button onClick={() => setShowContactModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 rounded-xl">
              <span className="text-2xl">{selectedProduct.image}</span>
              <div>
                <p className="text-sm font-semibold text-slate-900">{selectedProduct.name}</p>
                <p className="text-xs text-slate-500">{selectedProduct.supplierName} · {formatPrice(selectedProduct.price)}/kg</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-700 mb-1 block">Required Quantity (kg)</label>
                <input type="number" placeholder={`Min: ${selectedProduct.minOrder.toLocaleString()} kg`}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 mb-1 block">Target Price ($/kg)</label>
                <input type="number" step="0.01" placeholder={`Current: ${selectedProduct.price}`}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 mb-1 block">Required Delivery Date</label>
                <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 mb-1 block">Destination Port</label>
                <input type="text" placeholder="e.g. Rotterdam, Hamburg, Miami" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 mb-1 block">Additional Requirements</label>
                <textarea rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none"
                  placeholder="Special certifications, packaging, labelling, Halal/Kosher requirements..." />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="primary" className="flex-1">Send Inquiry</Button>
              <Button variant="secondary" onClick={() => setShowContactModal(false)}>Cancel</Button>
            </div>
            <p className="text-xs text-slate-400 text-center mt-3">🔒 Protected by SeaHub Trade Guarantee</p>
          </Card>
        </div>
      )}
    </div>
  )
}
