'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Plus, Search, Edit2, Trash2, ChevronDown, ChevronRight,
  Shield, Star, Package, Users, TrendingUp, Filter,
  Download, RefreshCw, X, CheckCircle, AlertCircle, Info,
  Globe, Award, Layers, Database, Zap, BarChart3, Eye, ExternalLink,
} from 'lucide-react'
import {
  getAllStaticProducts, PRODUCERS, PLATFORM_CATEGORIES, PLATFORM_SUPPLY_CAP,
  type Product, type Producer, type PlatformCategory,
} from '@/lib/data'
import {
  getAdminProducts, saveAdminProduct, deleteAdminProduct, generateProductId,
} from '@/lib/product-store'
import { ProducerCertification } from '@/components/ProducerCertification'

// ─── Price Intelligence Sources (Worldwide Seafood Price Sources Coverage Map) ───
const PRICE_SOURCES = [
  {
    name: 'FAO GLOBEFISH – European Price Dashboard',
    org: 'FAO / GLOBEFISH',
    url: 'https://www.fao.org/in-action/globefish/prices/en',
    species: ['Salmon', 'Shrimp', 'Tuna', 'Tilapia', 'Cod', 'Squid', 'Herring'],
    coverage: 'Europe (first-sale + wholesale)',
    freq: 'Weekly',
    free: true,
    stage: 'First-sale / Wholesale',
    usedFor: ['Salmon', 'Tuna', 'Tilapia', 'Shrimp', 'Lobster', 'Hamachi'],
  },
  {
    name: 'EUMOFA',
    org: 'European Commission',
    url: 'https://eumofa.eu/',
    species: ['Salmon', 'Shrimp', 'Tuna', 'Cod', 'Herring', 'Sardines'],
    coverage: 'EU + Norway, Iceland, Faroe Is., UK',
    freq: 'Daily',
    free: true,
    stage: 'First-sale → Retail + Import/Export',
    usedFor: ['Salmon', 'Tuna', 'Tilapia', 'Shrimp', 'Lobster', 'Hamachi'],
  },
  {
    name: 'Statistics Norway (SSB) – Salmon Export Price',
    org: 'Statistics Norway',
    url: 'https://www.ssb.no/en/utenriksokonomi/utenrikshandel/statistikk/eksport-av-laks',
    species: ['Salmon'],
    coverage: 'Norway (FOB export)',
    freq: 'Weekly',
    free: true,
    stage: 'Export border price',
    usedFor: ['Salmon'],
  },
  {
    name: 'Norwegian Seafood Council – Market Insight',
    org: 'Norwegian Seafood Council',
    url: 'https://en.seafood.no/market-insight/',
    species: ['Salmon'],
    coverage: 'Norway exports (global)',
    freq: 'Daily',
    free: false,
    stage: 'Export statistics',
    usedFor: ['Salmon'],
  },
  {
    name: 'NOAA Fisheries – Market News & Trade Data',
    org: 'NOAA / NMFS (US)',
    url: 'https://www.fisheries.noaa.gov/national/sustainable-fisheries/fishery-market-news',
    species: ['Lobster', 'Tuna', 'Tilapia', 'Shrimp', 'Groundfish'],
    coverage: 'United States (auction + wholesale)',
    freq: 'Weekly',
    free: true,
    stage: 'Auction / Wholesale',
    usedFor: ['Tuna', 'Tilapia', 'Shrimp', 'Lobster'],
  },
  {
    name: 'Tokyo Metropolitan Central Wholesale Market',
    org: 'Tokyo Metropolitan Government',
    url: 'https://www.shijou.metro.tokyo.lg.jp/torihiki/geppo/',
    species: ['Hamachi / Yellowtail', 'Tuna', 'Salmon', 'Squid'],
    coverage: 'Japan (central wholesale/auction)',
    freq: 'Monthly',
    free: true,
    stage: 'Wholesale / Auction',
    usedFor: ['Hamachi'],
  },
  {
    name: 'VNF – Vest-Norges Fiskesalslag (min. prices)',
    org: 'VNF Norway',
    url: 'https://www.vnf.no/',
    species: ['Lobster', 'Demersal fish'],
    coverage: 'Norway (West) – first-hand',
    freq: 'Ad hoc',
    free: true,
    stage: 'First-sale minimum prices',
    usedFor: ['Lobster'],
  },
  {
    name: 'Urner Barry (COMTELL)',
    org: 'Urner Barry',
    url: 'https://www.urnerbarry.com/Markets',
    species: ['Salmon', 'Shrimp', 'Lobster', 'Tilapia', 'Scallops', 'Crab'],
    coverage: 'Global (US-centric wholesale)',
    freq: 'Biweekly',
    free: false,
    stage: 'Wholesale benchmark',
    usedFor: ['Salmon', 'Tuna', 'Tilapia', 'Shrimp', 'Lobster', 'Hamachi'],
  },
  {
    name: 'SeafoodSource – Pricing Portal',
    org: 'SeafoodSource',
    url: 'https://www.seafoodsource.com/pricing',
    species: ['Salmon', 'Shrimp', 'Cod', 'Tuna', 'Lobster'],
    coverage: 'Global (major markets)',
    freq: 'Weekly',
    free: false,
    stage: 'Price assessments',
    usedFor: ['Salmon', 'Tuna', 'Shrimp', 'Lobster'],
  },
  {
    name: 'Expana – Seafood Price Index',
    org: 'Expana (fmr. Mintec)',
    url: 'https://www.expanamarkets.com/markets/protein/seafood/',
    species: ['Salmon', 'Shrimp', 'Cod', 'Haddock', 'Lobster'],
    coverage: 'Global',
    freq: 'Varies',
    free: false,
    stage: 'Benchmark / Procurement',
    usedFor: ['Salmon', 'Shrimp', 'Lobster'],
  },
  {
    name: 'Mintec – Fish & Seafood Price Data',
    org: 'Mintec (part of Expana)',
    url: 'https://www.mintecglobal.com/global-fishing-seafood-industries',
    species: ['Cod', 'Pollock', 'Prawns', 'Tuna', 'Salmon', 'Haddock', 'Squid'],
    coverage: 'Global (750+ types)',
    freq: 'Varies',
    free: false,
    stage: 'Commodity price data',
    usedFor: ['Tuna', 'Shrimp'],
  },
  {
    name: 'Tridge – Domestic Price Data',
    org: 'Tridge',
    url: 'https://www.tridge.com/about/data-analytics/price',
    species: ['Multi-species (400+ sources)'],
    coverage: 'Global (farmgate + wholesale)',
    freq: 'Varies',
    free: false,
    stage: 'Farmgate / Wholesale',
    usedFor: ['Tilapia', 'Hamachi'],
  },
  {
    name: 'Undercurrent News – Prices Portal',
    org: 'Undercurrent News',
    url: 'https://www.undercurrentnews.com/prices-landing/',
    species: ['Salmon', 'Shrimp', 'Cod', 'Tuna'],
    coverage: 'Global',
    freq: 'Varies',
    free: false,
    stage: 'Market price tracking',
    usedFor: ['Salmon'],
  },
]

// ─── Types ───────────────────────────────────────────────────
type CategoryId = PlatformCategory | 'all'

const CATEGORY_LABEL: Record<PlatformCategory, string> = {
  'frozen-seafood':     'Frozen Seafood',
  'frozen-value-added': 'Frozen Value Added',
  'seafood-specials':   'Seafood Specials',
  'fresh-seafood':      'Fresh Seafood',
}

const CATEGORY_COLOR: Record<PlatformCategory, string> = {
  'frozen-seafood':     'bg-sky-100 text-sky-800 border-sky-200',
  'frozen-value-added': 'bg-violet-100 text-violet-800 border-violet-200',
  'seafood-specials':   'bg-orange-100 text-orange-800 border-orange-200',
  'fresh-seafood':      'bg-emerald-100 text-emerald-800 border-emerald-200',
}

const CATEGORY_BG: Record<PlatformCategory, string> = {
  'frozen-seafood':     'from-sky-500 to-sky-700',
  'frozen-value-added': 'from-violet-500 to-violet-700',
  'seafood-specials':   'from-orange-500 to-orange-700',
  'fresh-seafood':      'from-emerald-500 to-emerald-700',
}

const ALL_CERTS = ['MSC','ASC','BAP','GlobalG.A.P','HALAL','KOSHER','BRC','HACCP','CITES','DOP']
const ALL_PROCESSING = ['Fresh Chilled','Fresh Frozen','Frozen','IQF','Cooked Frozen','Smoked','Super Frozen (-60°C)','Chilled Specialty','Cured Specialty','Ready-to-Eat Chilled','Cured Chilled']
const ALL_FREEZING = ['IQF','Block Frozen','Super Frozen (-60°C)','Chilled','N/A']
const ALL_SPECIES_GROUPS = [
  'Atlantic Salmon','Yellowfin Tuna','Bluefin Tuna','King Salmon','Tilapia',
  'Shrimp','Lobster','Yellowtail / Hamachi','King Crab','Octopus','Sea Bass',
  'Sea Bream','Halibut','Cod','Grouper','Red Snapper','Mahi-Mahi','Swordfish',
  'Mackerel','Caviar','Bottarga','Seafood Specials','Value Added',
]

const EMPTY_PRODUCT: Partial<Product> = {
  name: '', species: '', category: 'Fresh Seafood', origin: 'Norway',
  price: 0, unit: 'kg', minOrder: 1000, maxOrder: 50000,
  certification: [], processingType: 'Fresh Chilled', freezingMethod: 'N/A',
  size: '', supplierId: '', supplierName: '', supplierRating: 4.5,
  supplierVerified: true, image: '🐟', description: '',
  availability: 'In Stock', stockQty: 0, expiryDate: '2026-12-31',
  tags: [], priceHistory: [], competitorPrices: [],
  newCategory: 'fresh-seafood', producerIds: [], speciesGroup: '', supplyCapacityMT: 0,
  isAdminAdded: true,
}

// ─── Helpers ─────────────────────────────────────────────────
function getProducersForProduct(product: Product, producers: Producer[]): Producer[] {
  if (!product.producerIds?.length) {
    const byName = producers.find(p => p.name === product.supplierName)
    return byName ? [byName] : []
  }
  return product.producerIds.map(id => producers.find(p => p.id === id)).filter(Boolean) as Producer[]
}

function getTotalSupply(product: Product, producers: Producer[]): number {
  if (product.supplyCapacityMT) return product.supplyCapacityMT
  const prods = getProducersForProduct(product, producers)
  return prods.reduce((sum, p) => sum + p.supplyCapacityMT, 0)
}

function formatMT(mt: number): string {
  if (mt >= 1000) return `${(mt / 1000).toFixed(1)}K MT`
  return `${mt} MT`
}

function formatPrice(p: number): string {
  if (p >= 1000) return `$${p.toLocaleString()}/kg`
  return `$${p.toFixed(2)}/kg`
}

// ─── Sub-components ──────────────────────────────────────────
function CertBadge({ cert }: { cert: string }) {
  const colors: Record<string, string> = {
    MSC: 'bg-blue-100 text-blue-700', ASC: 'bg-teal-100 text-teal-700',
    BAP: 'bg-green-100 text-green-700', HALAL: 'bg-emerald-100 text-emerald-700',
    KOSHER: 'bg-indigo-100 text-indigo-700', BRC: 'bg-purple-100 text-purple-700',
    HACCP: 'bg-gray-100 text-gray-700', 'GlobalG.A.P': 'bg-lime-100 text-lime-700',
    CITES: 'bg-red-100 text-red-700', DOP: 'bg-amber-100 text-amber-700',
  }
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${colors[cert] ?? 'bg-gray-100 text-gray-600'}`}>
      {cert}
    </span>
  )
}

function AvailBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'In Stock': 'bg-green-100 text-green-700 border border-green-200',
    'Limited Stock': 'bg-amber-100 text-amber-700 border border-amber-200',
    'Seasonal': 'bg-blue-100 text-blue-700 border border-blue-200',
    'Out of Stock': 'bg-red-100 text-red-600 border border-red-200',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${map[status] ?? map['In Stock']}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}

// ─── Add/Edit Modal ───────────────────────────────────────────
function ProductModal({
  initial, producers, onSave, onClose,
}: {
  initial: Partial<Product>
  producers: Producer[]
  onSave: (p: Product) => void
  onClose: () => void
}) {
  const [form, setForm] = useState<Partial<Product>>(initial)
  const [certInput, setCertInput] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState<string[]>([])

  const set = (field: keyof Product, value: unknown) => setForm(f => ({ ...f, [field]: value }))

  const toggleCert = (c: string) => {
    const certs = form.certification ?? []
    set('certification', certs.includes(c) ? certs.filter(x => x !== c) : [...certs, c])
  }

  const toggleProducer = (id: string) => {
    const ids = form.producerIds ?? []
    set('producerIds', ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id])
  }

  const validate = (): boolean => {
    const errs: string[] = []
    if (!form.name?.trim()) errs.push('Product name is required')
    if (!form.speciesGroup?.trim()) errs.push('Species group is required')
    if (!form.price || form.price <= 0) errs.push('Price must be greater than 0')
    if (!form.newCategory) errs.push('Category is required')
    setErrors(errs)
    return errs.length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    const id = form.id ?? generateProductId(form.newCategory ?? 'frozen-seafood')
    const product: Product = {
      id,
      name: form.name!,
      species: form.speciesGroup ?? form.species ?? '',
      category: form.category ?? 'Fresh Seafood',
      origin: form.origin ?? 'Unknown',
      price: form.price ?? 0,
      unit: 'kg',
      minOrder: form.minOrder ?? 1000,
      maxOrder: form.maxOrder ?? 50000,
      certification: form.certification ?? [],
      processingType: form.processingType ?? '',
      freezingMethod: form.freezingMethod ?? 'N/A',
      size: form.size ?? '',
      supplierId: form.supplierId ?? (form.producerIds?.[0] ?? ''),
      supplierName: form.supplierName ?? (
        producers.find(p => p.id === form.producerIds?.[0])?.name ?? ''
      ),
      supplierRating: form.supplierRating ?? 4.5,
      supplierVerified: form.supplierVerified ?? true,
      image: form.image ?? '🐟',
      description: form.description ?? '',
      availability: form.availability ?? 'In Stock',
      stockQty: form.stockQty ?? 0,
      expiryDate: form.expiryDate ?? '2026-12-31',
      tags: form.tags ?? [],
      priceHistory: [form.price ?? 0],
      competitorPrices: [],
      newCategory: form.newCategory ?? 'frozen-seafood',
      producerIds: form.producerIds ?? [],
      speciesGroup: form.speciesGroup ?? '',
      supplyCapacityMT: form.supplyCapacityMT ?? 0,
      isAdminAdded: true,
    }
    onSave(product)
  }

  const filteredProducers = useMemo(() =>
    producers.filter(p =>
      !form.newCategory ||
      p.speciesGroups.some(s => s.toLowerCase().includes((form.speciesGroup ?? '').toLowerCase())) ||
      form.producerIds?.includes(p.id)
    ), [producers, form.newCategory, form.speciesGroup, form.producerIds])

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto py-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-ocean-700 to-ocean-900 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">{form.id ? 'Edit Product' : 'Add New Product'}</h2>
            <p className="text-ocean-200 text-sm mt-0.5">Fill in all product details — will propagate to all platform sections</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errors.length > 0 && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">
              {errors.map((e, i) => <div key={i}>{e}</div>)}
            </div>
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Section 1: Basic Info */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-ocean-600" /> Product Identity
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Product Name *</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-400"
                  placeholder="e.g. Norwegian Atlantic Salmon — Fillet IQF Skin-On"
                  value={form.name ?? ''}
                  onChange={e => set('name', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Platform Category *</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-400"
                  value={form.newCategory ?? 'frozen-seafood'}
                  onChange={e => set('newCategory', e.target.value as PlatformCategory)}
                >
                  {PLATFORM_CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Species Group *</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-400"
                  value={form.speciesGroup ?? ''}
                  onChange={e => set('speciesGroup', e.target.value)}
                >
                  <option value="">Select species group...</option>
                  {ALL_SPECIES_GROUPS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Origin Country</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-400"
                  placeholder="e.g. Norway, Iceland, Japan"
                  value={form.origin ?? ''}
                  onChange={e => set('origin', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Availability</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-400"
                  value={form.availability ?? 'In Stock'}
                  onChange={e => set('availability', e.target.value)}
                >
                  {['In Stock','Limited Stock','Seasonal','Out of Stock'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Processing */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-violet-600" /> Processing & Specifications
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Processing Type</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-400"
                  value={form.processingType ?? ''}
                  onChange={e => set('processingType', e.target.value)}
                >
                  {ALL_PROCESSING.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Freezing Method</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-400"
                  value={form.freezingMethod ?? 'N/A'}
                  onChange={e => set('freezingMethod', e.target.value)}
                >
                  {ALL_FREEZING.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Size / Grade</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-400"
                  placeholder="e.g. 200-300g / 21-25ct"
                  value={form.size ?? ''}
                  onChange={e => set('size', e.target.value)}
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">Product Description</label>
              <textarea
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-400 resize-none"
                rows={3}
                placeholder="Detailed product description for buyers..."
                value={form.description ?? ''}
                onChange={e => set('description', e.target.value)}
              />
            </div>
          </div>

          {/* Section 3: Pricing & Volume */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" /> Pricing & Volume
            </h3>
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Price (USD/kg) *</label>
                <input
                  type="number" min={0} step={0.01}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-400"
                  value={form.price ?? ''}
                  onChange={e => set('price', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Min Order (kg)</label>
                <input
                  type="number" min={0}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-400"
                  value={form.minOrder ?? ''}
                  onChange={e => set('minOrder', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Max Order (kg)</label>
                <input
                  type="number" min={0}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-400"
                  value={form.maxOrder ?? ''}
                  onChange={e => set('maxOrder', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Supply Capacity (MT/yr)</label>
                <input
                  type="number" min={0}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-400"
                  value={form.supplyCapacityMT ?? ''}
                  onChange={e => set('supplyCapacityMT', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Stock Qty (kg)</label>
                <input
                  type="number" min={0}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-400"
                  value={form.stockQty ?? ''}
                  onChange={e => set('stockQty', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Expiry / BBD</label>
                <input
                  type="date"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-400"
                  value={form.expiryDate ?? ''}
                  onChange={e => set('expiryDate', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Certifications */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" /> Certifications
            </h3>
            <div className="flex flex-wrap gap-2">
              {ALL_CERTS.map(cert => {
                const active = (form.certification ?? []).includes(cert)
                return (
                  <button
                    key={cert}
                    onClick={() => toggleCert(cert)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      active ? 'bg-ocean-600 text-white border-ocean-600' : 'bg-white text-gray-600 border-gray-200 hover:border-ocean-300'
                    }`}
                  >
                    {cert}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Section 5: Producers */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-600" /> Producers / Suppliers
            </h3>
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
              {PRODUCERS.map(prod => {
                const selected = (form.producerIds ?? []).includes(prod.id)
                return (
                  <label key={prod.id} className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors ${selected ? 'bg-ocean-50' : ''}`}>
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleProducer(prod.id)}
                      className="rounded border-gray-300 text-ocean-600 focus:ring-ocean-400"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 truncate">{prod.name}</div>
                      <div className="text-xs text-gray-500">{prod.country} · {formatMT(prod.supplyCapacityMT)}/yr · ★ {prod.rating}</div>
                    </div>
                    <div className="flex gap-1 flex-wrap justify-end">
                      {prod.certifications.slice(0, 3).map(c => <CertBadge key={c} cert={c} />)}
                    </div>
                  </label>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-lg bg-ocean-600 hover:bg-ocean-700 text-white text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            {form.id ? 'Save Changes' : 'Add to Platform'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Admin Page ─────────────────────────────────────────
export default function AdminPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all')
  const [search, setSearch] = useState('')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState<Partial<Product>>(EMPTY_PRODUCT)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [sortCol, setSortCol] = useState<string>('newCategory')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [certProducer, setCertProducer] = useState<Producer | null>(null)
  const [openTables, setOpenTables] = useState<Set<string>>(new Set())

  const toggleTable = (id: string) =>
    setOpenTables(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

  // Load all products (static + admin-added)
  const refreshProducts = () => {
    const staticProds = getAllStaticProducts()
    const adminProds = getAdminProducts()
    setAllProducts([...staticProds, ...adminProds])
  }

  useEffect(() => {
    refreshProducts()
    const handler = () => refreshProducts()
    window.addEventListener('seahub_products_updated', handler)
    return () => window.removeEventListener('seahub_products_updated', handler)
  }, [])

  // Category stats
  const categoryStats = useMemo(() => {
    const stats: Record<string, { count: number; totalMT: number; producerSet: Set<string> }> = {
      'frozen-seafood':     { count: 0, totalMT: 0, producerSet: new Set() },
      'frozen-value-added': { count: 0, totalMT: 0, producerSet: new Set() },
      'seafood-specials':   { count: 0, totalMT: 0, producerSet: new Set() },
      'fresh-seafood':      { count: 0, totalMT: 0, producerSet: new Set() },
    }
    allProducts.forEach(p => {
      const cat = p.newCategory ?? 'frozen-seafood'
      if (stats[cat]) {
        stats[cat].count++
        stats[cat].totalMT += getTotalSupply(p, PRODUCERS)
        ;(p.producerIds ?? []).forEach(id => stats[cat].producerSet.add(id))
        if (!p.producerIds?.length && p.supplierName) stats[cat].producerSet.add(p.supplierName)
      }
    })
    return stats
  }, [allProducts])

  const totalStats = useMemo(() => {
    const totalProducerCapacity = PRODUCERS.reduce((s, p) => s + p.supplyCapacityMT, 0)
    const capLimit = Math.round(totalProducerCapacity * PLATFORM_SUPPLY_CAP)
    // Mock: platform orders = 61% of total capacity (realistic usage)
    const platformOrdersMT = Math.round(totalProducerCapacity * 0.61)
    const usagePct = Math.round((platformOrdersMT / totalProducerCapacity) * 100)
    const capPct = Math.round(PLATFORM_SUPPLY_CAP * 100)
    return {
      products: allProducts.length,
      producers: PRODUCERS.length,
      totalMT: allProducts.reduce((s, p) => s + getTotalSupply(p, PRODUCERS), 0),
      categories: 4,
      totalProducerCapacity,
      platformOrdersMT,
      capLimit,
      usagePct,
      capPct,
    }
  }, [allProducts])

  // Filtered & sorted products
  const displayed = useMemo(() => {
    let list = allProducts
    if (activeCategory !== 'all') {
      list = list.filter(p => (p.newCategory ?? 'frozen-seafood') === activeCategory)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.species.toLowerCase().includes(q) ||
        p.origin.toLowerCase().includes(q) ||
        (p.speciesGroup ?? '').toLowerCase().includes(q) ||
        p.supplierName.toLowerCase().includes(q)
      )
    }
    return [...list].sort((a, b) => {
      let av: string | number = '', bv: string | number = ''
      if (sortCol === 'name') { av = a.name; bv = b.name }
      else if (sortCol === 'price') { av = a.price; bv = b.price }
      else if (sortCol === 'stock') { av = a.stockQty; bv = b.stockQty }
      else if (sortCol === 'supply') { av = getTotalSupply(a, PRODUCERS); bv = getTotalSupply(b, PRODUCERS) }
      else { av = a.newCategory ?? ''; bv = b.newCategory ?? '' }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [allProducts, activeCategory, search, sortCol, sortDir])

  const toggleSort = (col: string) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
  }

  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleSave = (product: Product) => {
    saveAdminProduct(product)
    refreshProducts()
    setShowModal(false)
    setEditProduct(EMPTY_PRODUCT)
    showToast('Product saved and propagated to all platform sections', 'success')
  }

  const handleDelete = (id: string) => {
    deleteAdminProduct(id)
    refreshProducts()
    setDeleteConfirm(null)
    showToast('Product removed from platform', 'success')
  }

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }

  const openAdd = () => {
    setEditProduct({ ...EMPTY_PRODUCT })
    setShowModal(true)
  }

  const openEdit = (p: Product) => {
    setEditProduct(p)
    setShowModal(true)
  }

  const SortIcon = ({ col }: { col: string }) => (
    <span className={`ml-1 text-[10px] ${sortCol === col ? 'text-ocean-300' : 'text-white/30'}`}>
      {sortCol === col ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
    </span>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-ocean-800 via-ocean-700 to-ocean-900 text-white">
        <div className="max-w-screen-2xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Product Catalog Management</h1>
                  <p className="text-ocean-200 text-sm">Central product table — changes propagate instantly to all platform sections</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={refreshProducts}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
              <button
                onClick={openAdd}
                className="flex items-center gap-2 px-5 py-2 bg-white text-ocean-800 hover:bg-ocean-50 rounded-xl text-sm font-semibold transition-colors shadow-lg"
              >
                <Plus className="w-4 h-4" /> Add New Item
              </button>
            </div>
          </div>

          {/* Platform-wide stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            {[
              { label: 'Total Products', value: totalStats.products, icon: Package, color: 'from-sky-400 to-sky-600' },
              { label: 'Verified Producers', value: totalStats.producers, icon: Shield, color: 'from-emerald-400 to-emerald-600' },
              { label: 'Total Supply Capacity', value: formatMT(totalStats.totalMT), icon: BarChart3, color: 'from-violet-400 to-violet-600' },
              { label: 'Active Categories', value: totalStats.categories, icon: Layers, color: 'from-amber-400 to-amber-600' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{value}</div>
                  <div className="text-ocean-200 text-xs">{label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Platform Supply Cap Indicator */}
          <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-white/80" />
                <span className="text-white font-semibold text-sm">Platform Supply Cap</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 font-medium border border-amber-400/30">
                  Max {totalStats.capPct}% of Total Producer Capacity
                </span>
              </div>
              <div className="text-right">
                <span className={`text-sm font-bold ${totalStats.usagePct >= 80 ? 'text-red-300' : totalStats.usagePct >= 65 ? 'text-amber-300' : 'text-emerald-300'}`}>
                  {totalStats.usagePct}% used
                </span>
                <span className="text-ocean-300 text-xs ml-2">
                  {formatMT(totalStats.platformOrdersMT)} / {formatMT(totalStats.capLimit)} cap
                </span>
              </div>
            </div>
            <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
              {/* Cap line at 80% */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-20"
                style={{ left: `${totalStats.capPct}%` }}
                title={`${totalStats.capPct}% cap`}
              />
              {/* Usage bar */}
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  totalStats.usagePct >= 80 ? 'bg-gradient-to-r from-red-400 to-red-500' :
                  totalStats.usagePct >= 65 ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                  'bg-gradient-to-r from-emerald-400 to-emerald-500'
                }`}
                style={{ width: `${Math.min(totalStats.usagePct, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-[10px] text-ocean-300">
              <span>0</span>
              <span className="text-amber-300">↑ {totalStats.capPct}% Cap ({formatMT(totalStats.capLimit)})</span>
              <span>{formatMT(totalStats.totalProducerCapacity)} total capacity</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 py-6 space-y-6">
        {/* ── Category Summary Cards ── */}
        <div className="grid grid-cols-4 gap-4">
          {PLATFORM_CATEGORIES.map(cat => {
            const st = categoryStats[cat.id]
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as PlatformCategory)}
                className={`bg-white rounded-2xl p-5 border-2 text-left transition-all hover:shadow-md ${
                  activeCategory === cat.id ? 'border-ocean-500 shadow-md' : 'border-transparent'
                }`}
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${CATEGORY_BG[cat.id as PlatformCategory]} text-white text-xl mb-3`}>
                  {cat.icon}
                </div>
                <div className="font-bold text-gray-800 text-sm mb-1">{cat.name}</div>
                <div className="text-xs text-gray-500 mb-3 line-clamp-1">{cat.description}</div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-gray-800">{st?.count ?? 0}</div>
                    <div className="text-[10px] text-gray-500">products</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-800">{st?.producerSet.size ?? 0}</div>
                    <div className="text-[10px] text-gray-500">producers</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-800">{formatMT(st?.totalMT ?? 0)}</div>
                    <div className="text-[10px] text-gray-500">capacity</div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* ── Table Controls ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Collapsible header */}
          <button
            onClick={() => toggleTable('products')}
            className="w-full flex items-center justify-between px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-ocean-600" />
              <span className="font-bold text-gray-800">Product Catalog</span>
              <span className="text-sm text-gray-400 font-normal">({allProducts.length} products)</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openTables.has('products') ? 'rotate-180' : ''}`} />
          </button>

          {openTables.has('products') && <><div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            {/* Category Tabs */}
            <div className="flex items-center gap-1">
              {[
                { id: 'all', label: 'All Products', count: allProducts.length },
                ...PLATFORM_CATEGORIES.map(c => ({ id: c.id, label: c.name, count: categoryStats[c.id]?.count ?? 0 })),
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as CategoryId)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    activeCategory === tab.id
                      ? 'bg-ocean-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeCategory === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean-400"
                placeholder="Search products, species, origin..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* ── Table ── */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ocean-800 text-white">
                  <th className="w-8 px-3 py-3"></th>
                  <th className="px-3 py-3 text-left font-semibold cursor-pointer select-none" onClick={() => toggleSort('name')}>
                    Product <SortIcon col="name" />
                  </th>
                  <th className="px-3 py-3 text-left font-semibold cursor-pointer select-none" onClick={() => toggleSort('newCategory')}>
                    Category <SortIcon col="newCategory" />
                  </th>
                  <th className="px-3 py-3 text-left font-semibold">Species Group</th>
                  <th className="px-3 py-3 text-left font-semibold">Origin</th>
                  <th className="px-3 py-3 text-left font-semibold">Producers</th>
                  <th className="px-3 py-3 text-right font-semibold cursor-pointer select-none" onClick={() => toggleSort('supply')}>
                    Supply/yr <SortIcon col="supply" />
                  </th>
                  <th className="px-3 py-3 text-right font-semibold cursor-pointer select-none" onClick={() => toggleSort('stock')}>
                    Stock (kg) <SortIcon col="stock" />
                  </th>
                  <th className="px-3 py-3 text-right font-semibold cursor-pointer select-none" onClick={() => toggleSort('price')}>
                    Price <SortIcon col="price" />
                  </th>
                  <th className="px-3 py-3 text-left font-semibold">Certifications</th>
                  <th className="px-3 py-3 text-left font-semibold">Status</th>
                  <th className="px-3 py-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayed.map((product, idx) => {
                  const cat = product.newCategory ?? 'frozen-seafood'
                  const prodList = getProducersForProduct(product, PRODUCERS)
                  const supply = getTotalSupply(product, PRODUCERS)
                  const isExpanded = expandedRows.has(product.id)
                  const isAdmin = product.isAdminAdded

                  return (
                    <>
                      <tr
                        key={product.id}
                        className={`hover:bg-gray-50 transition-colors ${isAdmin ? 'bg-amber-50/30' : ''}`}
                      >
                        {/* Expand button */}
                        <td className="px-3 py-3">
                          <button
                            onClick={() => toggleRow(product.id)}
                            className="p-1 rounded hover:bg-gray-200 transition-colors text-gray-400"
                          >
                            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                          </button>
                        </td>

                        {/* Product */}
                        <td className="px-3 py-3 max-w-xs">
                          <div className="flex items-start gap-2">
                            <span className="text-xl shrink-0 mt-0.5">{product.image}</span>
                            <div className="min-w-0">
                              <div className="font-medium text-gray-800 text-xs leading-tight line-clamp-2">{product.name}</div>
                              <div className="text-[10px] text-gray-400 mt-0.5 font-mono">{product.id}</div>
                              {isAdmin && <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-600 font-medium"><Zap className="w-2.5 h-2.5" />Admin Added</span>}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-3 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-lg border text-[11px] font-semibold whitespace-nowrap ${CATEGORY_COLOR[cat]}`}>
                            {PLATFORM_CATEGORIES.find(c => c.id === cat)?.icon} {CATEGORY_LABEL[cat]}
                          </span>
                        </td>

                        {/* Species */}
                        <td className="px-3 py-3 text-xs text-gray-700 whitespace-nowrap">
                          {product.speciesGroup || product.species}
                        </td>

                        {/* Origin */}
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1 text-xs text-gray-700 whitespace-nowrap">
                            <Globe className="w-3 h-3 text-gray-400" />
                            {product.origin}
                          </div>
                        </td>

                        {/* Producers */}
                        <td className="px-3 py-3">
                          {prodList.length > 0 ? (
                            <div className="space-y-0.5">
                              {prodList.slice(0, 2).map(p => (
                                <div key={p.id} className="flex items-center gap-1">
                                  {p.verified && <Shield className="w-2.5 h-2.5 text-blue-500 shrink-0" />}
                                  <span className="text-[11px] text-gray-700 truncate max-w-[120px]">{p.name}</span>
                                </div>
                              ))}
                              {prodList.length > 2 && (
                                <span className="text-[10px] text-gray-400">+{prodList.length - 2} more</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-[11px] text-gray-700">{product.supplierName}</span>
                          )}
                        </td>

                        {/* Supply */}
                        <td className="px-3 py-3 text-right">
                          <span className="text-xs font-semibold text-ocean-700 whitespace-nowrap">
                            {formatMT(supply)}
                          </span>
                        </td>

                        {/* Stock */}
                        <td className="px-3 py-3 text-right">
                          <span className="text-xs text-gray-700 whitespace-nowrap">
                            {product.stockQty.toLocaleString()} kg
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-3 py-3 text-right">
                          <span className="text-xs font-bold text-gray-800 whitespace-nowrap">
                            {formatPrice(product.price)}
                          </span>
                        </td>

                        {/* Certifications */}
                        <td className="px-3 py-3">
                          <div className="flex flex-wrap gap-1 max-w-[120px]">
                            {product.certification.slice(0, 4).map(c => <CertBadge key={c} cert={c} />)}
                            {product.certification.length > 4 && (
                              <span className="text-[10px] text-gray-400">+{product.certification.length - 4}</span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          <AvailBadge status={product.availability} />
                        </td>

                        {/* Actions */}
                        <td className="px-3 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => openEdit(product)}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-ocean-600 hover:bg-ocean-50 transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() => setDeleteConfirm(product.id)}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* ── Expanded Row ── */}
                      {isExpanded && (
                        <tr key={`${product.id}-expanded`} className="bg-ocean-50/40">
                          <td colSpan={12} className="px-8 py-4">
                            <div className="grid grid-cols-3 gap-6">
                              {/* Description */}
                              <div>
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                  <Info className="w-3 h-3" /> Description
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed">{product.description || '—'}</p>
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {product.tags.map(tag => (
                                    <span key={tag} className="px-2 py-0.5 bg-white border border-gray-200 rounded-full text-[10px] text-gray-600">{tag}</span>
                                  ))}
                                </div>
                              </div>

                              {/* Producer Details */}
                              <div>
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                  <Users className="w-3 h-3" /> Producer Details
                                </div>
                                {prodList.length > 0 ? prodList.map(p => (
                                  <div key={p.id} className="mb-3 bg-white rounded-xl p-3 border border-gray-100">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-xs font-semibold text-gray-800">{p.name}</span>
                                      {p.verified && <span className="flex items-center gap-0.5 text-[10px] text-blue-600"><Shield className="w-2.5 h-2.5" /> Verified</span>}
                                    </div>
                                    <div className="text-[11px] text-gray-500 mb-1.5">
                                      {p.country}{p.region ? ` · ${p.region}` : ''} · Founded {p.yearFounded} · ★ {p.rating}
                                    </div>
                                    <div className="text-[11px] text-emerald-700 font-medium mb-1.5">
                                      Supply Capacity: {formatMT(p.supplyCapacityMT)}/year
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                      {p.certifications.map(c => <CertBadge key={c} cert={c} />)}
                                    </div>
                                  </div>
                                )) : (
                                  <div className="bg-white rounded-xl p-3 border border-gray-100">
                                    <div className="text-xs font-semibold text-gray-800">{product.supplierName}</div>
                                    <div className="flex items-center gap-1 mt-1">
                                      {product.supplierVerified && <span className="flex items-center gap-0.5 text-[10px] text-blue-600"><Shield className="w-2.5 h-2.5" /> Verified</span>}
                                      <span className="text-[10px] text-gray-500">★ {product.supplierRating}</span>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Trade Details */}
                              <div>
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                  <TrendingUp className="w-3 h-3" /> Trade Details
                                </div>
                                <div className="bg-white rounded-xl p-3 border border-gray-100 space-y-2">
                                  {[
                                    ['Processing', product.processingType],
                                    ['Freezing', product.freezingMethod],
                                    ['Size / Grade', product.size || '—'],
                                    ['Min Order', `${product.minOrder.toLocaleString()} kg`],
                                    ['Max Order', `${product.maxOrder.toLocaleString()} kg`],
                                    ['Expiry / BBD', product.expiryDate],
                                    ['Total Supply', formatMT(supply) + '/year'],
                                  ].map(([k, v]) => (
                                    <div key={k} className="flex justify-between text-[11px]">
                                      <span className="text-gray-500">{k}</span>
                                      <span className="text-gray-800 font-medium text-right max-w-[140px]">{v}</span>
                                    </div>
                                  ))}
                                  {product.competitorPrices?.length > 0 && (
                                    <>
                                      <div className="border-t border-gray-100 pt-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Competitor Prices</div>
                                      {product.competitorPrices.map(cp => (
                                        <div key={cp.supplier} className="flex justify-between text-[11px]">
                                          <span className="text-gray-500">{cp.supplier}</span>
                                          <span className="text-red-600 font-medium">{formatPrice(cp.price)}</span>
                                        </div>
                                      ))}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })}

                {displayed.length === 0 && (
                  <tr>
                    <td colSpan={12} className="py-16 text-center text-gray-400">
                      <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <div className="font-medium">No products found</div>
                      <div className="text-sm mt-1">Try adjusting your search or category filter</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Showing {displayed.length} of {allProducts.length} products</span>
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" />
              <span className="text-amber-600 font-medium">{getAdminProducts().length} admin-added</span>
              {' · '}
              {allProducts.length - getAdminProducts().length} static catalog items
            </span>
          </div>
          </>}
        </div>

        {/* ── Producers Registry ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button
            onClick={() => toggleTable('producers')}
            className="w-full px-5 py-4 border-b border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Verified Producer Registry
              <span className="text-sm font-normal text-gray-500">({PRODUCERS.length} producers across {new Set(PRODUCERS.map(p => p.country)).size} countries)</span>
            </h2>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openTables.has('producers') ? 'rotate-180' : ''}`} />
          </button>
          {openTables.has('producers') && <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Producer Name','Country','Species Groups','Supply Capacity','Certifications','Rating','Document'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {PRODUCERS.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {p.verified && <Shield className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                        <span className="font-medium text-gray-800 text-xs">{p.name}</span>
                      </div>
                      <div className="text-[10px] text-gray-400 ml-5">{p.region ? `${p.region}, ` : ''}{p.country}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Globe className="w-3 h-3 text-gray-400" /> {p.country}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {p.speciesGroups.map(s => (
                          <span key={s} className="px-1.5 py-0.5 bg-ocean-50 text-ocean-700 rounded text-[10px] font-medium">{s}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold text-emerald-700">{formatMT(p.supplyCapacityMT)}/yr</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {p.certifications.map(c => <CertBadge key={c} cert={c} />)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-bold text-gray-700">{p.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setCertProducer(p)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B1E3F] hover:bg-[#162D5A] text-white rounded-lg text-[11px] font-semibold transition-colors shadow-sm whitespace-nowrap"
                      >
                        <Award className="w-3.5 h-3.5 text-yellow-400" />
                        View Certificate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>}
        </div>

        {/* ── Price Intelligence Sources ── */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <button
            onClick={() => toggleTable('prices')}
            className="w-full px-6 py-4 border-b border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="text-left">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-ocean-600" />
                Price Intelligence Sources
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                All external sources used to build the live price benchmarks shown to buyers
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-xs bg-ocean-50 text-ocean-700 border border-ocean-200 rounded-full px-3 py-1 font-semibold">
                {PRICE_SOURCES.length} sources
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openTables.has('prices') ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {openTables.has('prices') && <><div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ocean-800 text-white text-xs uppercase tracking-wide">
                  <th className="px-4 py-3 text-left">Source</th>
                  <th className="px-4 py-3 text-left">Species / Items Covered</th>
                  <th className="px-4 py-3 text-left">Coverage</th>
                  <th className="px-4 py-3 text-left">Update Freq.</th>
                  <th className="px-4 py-3 text-left">Access</th>
                  <th className="px-4 py-3 text-left">Market Stage</th>
                  <th className="px-4 py-3 text-left">Used For</th>
                  <th className="px-4 py-3 text-center">Website</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {PRICE_SOURCES.map((s, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800 text-sm">{s.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{s.org}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {s.species.map(sp => (
                          <span key={sp} className="text-xs bg-sky-50 text-sky-700 border border-sky-100 rounded-full px-2 py-0.5">
                            {sp}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{s.coverage}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                        s.freq === 'Daily'     ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        s.freq === 'Weekly'    ? 'bg-sky-50 text-sky-700 border-sky-200'             :
                        s.freq === 'Biweekly'  ? 'bg-violet-50 text-violet-700 border-violet-200'    :
                        s.freq === 'Monthly'   ? 'bg-amber-50 text-amber-700 border-amber-200'        :
                                                 'bg-gray-50 text-gray-600 border-gray-200'
                      }`}>
                        {s.freq}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                        s.free
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-violet-50 text-violet-700 border-violet-200'
                      }`}>
                        {s.free ? 'Free' : 'Paid'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{s.stage}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {s.usedFor.map(u => (
                          <span key={u} className="text-xs bg-orange-50 text-orange-700 border border-orange-100 rounded-full px-2 py-0.5">
                            {u}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ocean-50 hover:bg-ocean-100 text-ocean-700 text-xs font-semibold border border-ocean-200 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Visit
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
            Sources follow the Worldwide Seafood Price Sources Coverage Map. Prices shown to buyers are averaged across applicable sources per species + production form.
          </div>
          </>}
        </div>
      </div>

      {/* ── Producer Certification ── */}
      {certProducer && (
        <ProducerCertification producer={certProducer} onClose={() => setCertProducer(null)} />
      )}

      {/* ── Modal ── */}
      {showModal && (
        <ProductModal
          initial={editProduct}
          producers={PRODUCERS}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditProduct(EMPTY_PRODUCT) }}
        />
      )}

      {/* ── Delete Confirm ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-xl">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="font-bold text-gray-800">Remove Product</div>
                <div className="text-sm text-gray-500">This will remove it from all platform sections</div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors">Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-white text-sm font-medium transition-all ${
          toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}
    </div>
  )
}
