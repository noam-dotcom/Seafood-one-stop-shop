'use client'

import { useState } from 'react'
import {
  TrendingUp, Eye, EyeOff, Zap, Bot, Plus, Package, DollarSign,
  Clock, CheckCircle, Upload, Info, Star, Users, ArrowRight,
  Shield, BarChart3, AlertTriangle, X, ChevronDown, Sparkles
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CERTIFICATIONS } from '@/lib/data'
import { saveAdminProduct, generateProductId } from '@/lib/product-store'
import { PlatformCategoryBar } from '@/components/PlatformCategoryBar'
import { formatPrice, cn } from '@/lib/utils'
import { useT } from '@/lib/i18n'

// ─── Category → sub-type mapping (new 4-category taxonomy) ─────────────
const SELL_SUBTYPES: Record<string, { label: string; options: string[] }[]> = {
  'frozen-seafood': [
    { label: '🐟 Atlantic Salmon', options: ['Whole HOG Fresh','Fillet IQF Skin-On','Fillet IQF Skinless','Portions Skin-On','Trim & Belly Flaps'] },
    { label: '🐠 Yellowfin Tuna',  options: ['Whole Round Fresh','Loins IQF Frozen','Steaks IQF','Sashimi Grade Super Frozen (-60°C)','Belly Flaps (Toro)'] },
    { label: '🐟 Tilapia',         options: ['Whole Round Frozen','Fillet Skinless IQF','Fillet Skin-On IQF','Portions IQF','Smoked Fillet'] },
    { label: '🦐 Shrimp',          options: ['Vannamei HLSO 16/20','Vannamei HLSO 21/25','Vannamei HLSO 31/40','Vannamei HLSO 41/50','Vannamei PD Raw IQF','Vannamei PD Cooked IQF','Black Tiger HLSO','Butterfly 26/30','Indian White HLSO'] },
    { label: '🦞 Lobster',         options: ['Live Hard-Shell','Whole Cooked Frozen','Cold Water Tails Raw IQF','Spiny Tails Warm Water','Knuckle & Claw Meat'] },
    { label: '🐡 Yellowtail / Hamachi', options: ['Whole Fresh','Collar (Kama) IQF','Sashimi Grade Super Frozen','Loin Fillet Skinless IQF'] },
  ],
  'frozen-value-added': [
    { label: '⭐ Breaded', options: ['Breaded Shrimp Panko Butterfly','Breaded Tilapia Fillet','Breaded Calamari Rings','Breaded Fish Portions','Tempura Shrimp'] },
    { label: '⭐ Marinated', options: ['Tuna Herb Marinated Steaks','Salmon Teriyaki','Shrimp Garlic Butter'] },
    { label: '⭐ Burgers & Formed', options: ['Salmon Burger Patty','Fish Burger Patty','Shrimp Cake'] },
    { label: '⭐ Mixed & Other', options: ['Seafood Mix (Calamari/Shrimp/Octopus)','Calamari Tubes & Tentacles','Smoked Salmon Flakes'] },
  ],
  'seafood-specials': [
    { label: '🍽️ Caviar', options: ['Beluga Caviar','Osetra Caviar','Sevruga Caviar','Salmon Roe (Ikura)','Trout Roe'] },
    { label: '🍽️ Bottarga', options: ['Bottarga di Muggine (Mullet Roe)','Bottarga di Tonno (Tuna Roe)'] },
    { label: '🍽️ Carpaccio & Salads', options: ['Salmon Carpaccio','Octopus Carpaccio','Seafood Salad','Nordic Gravlax'] },
    { label: '🍽️ Ceviche & Ready', options: ['Shrimp Ceviche Ready-to-Eat','Mixed Seafood Ceviche'] },
    { label: '🍽️ Premium Crustacean', options: ['King Crab Legs Sections','King Crab Whole Cooked','Snow Crab Clusters'] },
  ],
  'fresh-seafood': [
    { label: '🐟 Premium Tuna', options: ['Bluefin Tuna Sashimi Grade (-60°C)','Bluefin Tuna Fresh Loin','Yellowfin Tuna Whole Fresh'] },
    { label: '🐟 Premium Salmon', options: ['Atlantic Salmon Fresh HOG','King Salmon / Chinook Fresh','Hamachi / Yellowtail Fresh Whole'] },
    { label: '🐟 Mediterranean', options: ['Sea Bass / Branzino Fresh','Sea Bream / Dorade Fresh','Swordfish Fresh Steaks'] },
    { label: '🐟 North Atlantic', options: ['Atlantic Halibut Fresh H&G','Atlantic Cod Fresh Fillet','Atlantic Mackerel Fresh'] },
    { label: '🐟 Tropical & Warm Water', options: ['Red Grouper Fresh','Red Snapper Fresh','Mahi-Mahi / Dorado Fillet'] },
  ],
}

const LISTING_STEPS = [
  { id: 1, titleKey: 'page.sell.step1', icon: Package },
  { id: 2, titleKey: 'page.sell.step2', icon: DollarSign },
  { id: 3, titleKey: 'page.sell.step3', icon: Shield },
  { id: 4, titleKey: 'page.sell.step4', icon: CheckCircle },
]

const MY_LISTINGS = [
  {
    id: 'L1', name: 'Atlantic Salmon Fillet G-2/3', species: 'Salmon', price: 5.85,
    stock: 45000, sold: 12000, status: 'Active', views: 1840, inquiries: 23,
    image: '🐟', origin: 'Norway'
  },
  {
    id: 'L2', name: 'Vannamei Shrimp HLSO 21/25', species: 'Shrimp', price: 7.20,
    stock: 18000, sold: 82000, status: 'Active', views: 3210, inquiries: 47,
    image: '🦐', origin: 'Ecuador'
  },
  {
    id: 'L3', name: 'Cod Loins IQF 170-220g', species: 'Cod', price: 8.95,
    stock: 0, sold: 28000, status: 'Out of Stock', views: 920, inquiries: 11,
    image: '🐟', origin: 'Iceland'
  },
]

function AIPricingSuggestion({ visible, t }: { visible: boolean; t: ReturnType<typeof useT> }) {
  if (!visible) return null
  return (
    <div className="p-4 bg-gradient-to-r from-ocean-50 to-teal-50 border border-ocean-200 rounded-xl">
      <div className="flex items-center gap-2 mb-3">
        <Bot className="w-4 h-4 text-ocean-600" />
        <span className="text-sm font-semibold text-ocean-900">{t('page.sell.aiPricing')}</span>
        <Badge variant="ocean">Live</Badge>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="text-center p-2 bg-white rounded-lg border border-ocean-100">
          <p className="text-xs text-slate-500 mb-1">{t('page.sell.marketLow')}</p>
          <p className="font-bold text-slate-900 text-sm">$5.50/kg</p>
        </div>
        <div className="text-center p-2 bg-ocean-600 rounded-lg">
          <p className="text-xs text-ocean-100 mb-1">{t('page.sell.aiRecommended')}</p>
          <p className="font-bold text-white text-sm">$5.85/kg</p>
        </div>
        <div className="text-center p-2 bg-white rounded-lg border border-ocean-100">
          <p className="text-xs text-slate-500 mb-1">{t('page.sell.premiumCap')}</p>
          <p className="font-bold text-slate-900 text-sm">$6.40/kg</p>
        </div>
      </div>
      <p className="text-xs text-ocean-700 leading-relaxed">
        💡 Based on current Norwegian salmon prices, demand signals from EU buyers,
        and your supplier rating, <strong>$5.85/kg</strong> maximizes sell probability
        while maintaining 12% above market average margin.
      </p>
    </div>
  )
}

function ListingForm() {
  const t = useT()
  const [step, setStep] = useState(1)
  const [anonymous, setAnonymous] = useState(false)
  const [nearExpiry, setNearExpiry] = useState(false)
  const [showAIPrice, setShowAIPrice] = useState(false)
  const [published, setPublished] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('frozen-seafood')
  const [formData, setFormData] = useState({
    productName: '', subtype: '', origin: '', quantity: '',
    price: '', processingType: '', size: '', description: '',
    expiryDate: '', certifications: [] as string[],
  })

  const updateField = (key: string, value: string) =>
    setFormData(prev => ({ ...prev, [key]: value }))

  const handlePublish = () => {
    const price = parseFloat(formData.price) || 0
    const newProduct = {
      id: generateProductId(selectedCategory),
      name: formData.productName || formData.subtype || 'New Listing',
      species: formData.subtype || selectedCategory,
      category: 'Fresh Seafood' as const,
      origin: formData.origin || 'Unknown',
      price,
      unit: 'kg',
      minOrder: parseInt(formData.quantity) || 1000,
      maxOrder: 500000,
      certification: formData.certifications,
      processingType: formData.processingType || 'Frozen',
      freezingMethod: 'IQF',
      size: formData.size || '',
      supplierId: 'seller-new',
      supplierName: anonymous ? 'Anonymous Supplier' : 'Your Company',
      supplierRating: 4.5,
      supplierVerified: false,
      image: selectedCategory === 'fresh-seafood' ? '🐟' : selectedCategory === 'seafood-specials' ? '🍽️' : selectedCategory === 'frozen-value-added' ? '⭐' : '🧊',
      description: formData.description || '',
      availability: nearExpiry ? 'Limited Stock' : 'In Stock',
      stockQty: parseInt(formData.quantity) || 0,
      expiryDate: formData.expiryDate || '2026-12-31',
      tags: [nearExpiry ? 'Near-Expiry Deal' : 'New Listing', anonymous ? 'Anonymous' : 'Verified Seller'],
      priceHistory: [price],
      competitorPrices: [] as { supplier: string; price: number }[],
      newCategory: selectedCategory as import('@/lib/data').PlatformCategory,
      producerIds: [] as string[],
      speciesGroup: formData.subtype || '',
      supplyCapacityMT: 0,
      isAdminAdded: true,
    }
    saveAdminProduct(newProduct)
    setPublished(true)
  }

  if (published) {
    return (
      <Card className="overflow-hidden p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Listing Published!</h2>
        <p className="text-gray-500 text-sm mb-4">Your product is now live and has been added to the platform catalog. It will appear in the marketplace, admin table, and all category views.</p>
        <button onClick={() => { setPublished(false); setStep(1); setFormData({ productName:'',subtype:'',origin:'',quantity:'',price:'',processingType:'',size:'',description:'',expiryDate:'',certifications:[] }) }} className="px-6 py-2 bg-ocean-600 text-white rounded-xl text-sm font-semibold hover:bg-ocean-700 transition-colors">
          Add Another Listing
        </button>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      {/* Step indicator */}
      <div className="flex border-b border-slate-100">
        {LISTING_STEPS.map((s) => {
          const Icon = s.icon
          const isActive = s.id === step
          const isDone = s.id < step
          return (
            <button
              key={s.id}
              onClick={() => s.id < step && setStep(s.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-all border-b-2',
                isActive ? 'border-ocean-600 text-ocean-600 bg-ocean-50' :
                isDone ? 'border-emerald-500 text-emerald-600' :
                'border-transparent text-slate-400'
              )}
            >
              {isDone ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Icon className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">{t(s.titleKey)}</span>
            </button>
          )
        })}
      </div>

      <div className="p-6">
        {/* Anonymous Toggle */}
        <div className="flex items-center justify-between mb-5 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2">
            {anonymous ? <EyeOff className="w-4 h-4 text-slate-600" /> : <Eye className="w-4 h-4 text-slate-600" />}
            <div>
              <p className="text-sm font-semibold text-slate-900">{t('page.sell.anonymous')}</p>
              <p className="text-xs text-slate-500">{t('page.sell.anonymousSub')}</p>
            </div>
          </div>
          <button
            onClick={() => setAnonymous(!anonymous)}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              anonymous ? 'bg-ocean-600' : 'bg-slate-300'
            )}
          >
            <span className={cn(
              'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
              anonymous ? 'translate-x-6' : 'translate-x-1'
            )} />
          </button>
        </div>

        {/* Near Expiry Toggle */}
        <div className="flex items-center justify-between mb-5 p-3 bg-amber-50 rounded-xl border border-amber-200">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600" />
            <div>
              <p className="text-sm font-semibold text-slate-900">{t('page.sell.nearExpiry')}</p>
              <p className="text-xs text-slate-500">{t('page.sell.nearExpirySub')}</p>
            </div>
          </div>
          <button
            onClick={() => setNearExpiry(!nearExpiry)}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              nearExpiry ? 'bg-amber-500' : 'bg-slate-300'
            )}
          >
            <span className={cn(
              'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
              nearExpiry ? 'translate-x-6' : 'translate-x-1'
            )} />
          </button>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">{t('page.sell.productName')} *</label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={e => updateField('productName', e.target.value)}
                  placeholder="e.g. Yellowfin Tuna Loins IQF"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ocean-300"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-2">{t('page.sell.category')} * — Select the platform category</label>
                <PlatformCategoryBar
                  selected={selectedCategory}
                  onSelect={setSelectedCategory}
                  variant="tabs"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">{t('page.sell.subtype')} *</label>
                <select
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ocean-300"
                  value={formData.subtype}
                  onChange={e => updateField('subtype', e.target.value)}
                >
                  <option value="">Select product type within category...</option>
                  {(SELL_SUBTYPES[selectedCategory] ?? []).map(group => (
                    <optgroup key={group.label} label={group.label}>
                      {group.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">{t('page.sell.originCountry')} *</label>
                <select
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ocean-300"
                  value={formData.origin}
                  onChange={e => updateField('origin', e.target.value)}
                >
                  <option value="">Select country...</option>
                  {['Norway','Chile','Ecuador','USA','Canada','Maldives','Indonesia','Vietnam','Thailand',
                    'India','China','Bangladesh','Egypt','Israel','Spain','Scotland','Japan','Nicaragua',
                    'Greece','Turkey','Italy','Malta','France','Iceland','Ireland','Mexico','Peru','Australia'].map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Processing Type *</label>
                <select className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ocean-300">
                  <option value="">Select type...</option>
                  {['Fresh', 'Fresh Chilled', 'Fresh Frozen', 'Frozen', 'Cooked Frozen', 'Smoked',
                    'Breaded Frozen', 'Marinated Frozen', 'Formed Frozen', 'Frozen Mix', 'Super Frozen (-60°C)', 'Live', 'Ready Meal', 'Dried', 'Canned'].map(t => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Size / Grade</label>
                <input type="text" placeholder="e.g. 2-3 kg, 21/25 count" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Freezing Method</label>
                <select className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white">
                  <option>IQF</option>
                  <option>Block Frozen</option>
                  <option>Super Frozen (-60°C)</option>
                  <option>N/A (Fresh/Live)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Product Description</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ocean-300"
                placeholder="Describe your product quality, special characteristics, harvesting method..."
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Product Photos</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-ocean-300 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Drop photos here or click to upload</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB each</p>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Price (USD/kg) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                  <input type="number" step="0.01" className="w-full pl-7 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm" placeholder="0.00" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Available Stock (kg) *</label>
                <input type="number" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" placeholder="e.g. 50000" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Minimum Order (kg)</label>
                <input type="number" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" placeholder="e.g. 5000" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Maximum Order (kg)</label>
                <input type="number" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" placeholder="e.g. 200000" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Expiry / Best Before</label>
                <input type="date" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Lead Time</label>
                <select className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white">
                  <option>Immediate (In Stock)</option>
                  <option>1-3 days</option>
                  <option>1 week</option>
                  <option>2-4 weeks</option>
                </select>
              </div>
            </div>

            {/* AI Price Button */}
            <Button
              variant="outline"
              className="w-full justify-center"
              onClick={() => setShowAIPrice(!showAIPrice)}
            >
              <Sparkles className="w-4 h-4 text-ocean-600" />
              {showAIPrice ? 'Hide' : 'Get'} AI Pricing Suggestion
            </Button>

            <AIPricingSuggestion visible={showAIPrice} t={t} />

            {/* Profit Calculator */}
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-900">Profit Margin Calculator</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Cost Price</p>
                  <input type="number" step="0.01" placeholder="$0.00/kg" className="w-full px-2 py-1.5 border border-emerald-200 rounded-lg text-xs" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Sell Price</p>
                  <input type="number" step="0.01" placeholder="$0.00/kg" className="w-full px-2 py-1.5 border border-emerald-200 rounded-lg text-xs" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Margin</p>
                  <div className="px-2 py-1.5 bg-emerald-100 rounded-lg text-xs font-bold text-emerald-700">
                    ~12.8%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-3">Select Your Certifications</p>
              <div className="grid grid-cols-2 gap-2">
                {CERTIFICATIONS.map(cert => (
                  <label
                    key={cert.code}
                    className="flex items-center gap-2.5 p-3 border border-slate-200 rounded-xl cursor-pointer hover:border-ocean-300 hover:bg-ocean-50 transition-all"
                  >
                    <input type="checkbox" className="rounded" />
                    <span className="text-lg">{cert.icon}</span>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{cert.code}</p>
                      <p className="text-xs text-slate-500 leading-tight">{cert.name}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-2">Upload Certificates</p>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center hover:border-ocean-300 cursor-pointer">
                <Upload className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                <p className="text-xs text-slate-500">Upload PDF certificates for verification</p>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="font-semibold text-emerald-900">Ready to Publish</span>
              </div>
              <p className="text-sm text-emerald-700">Your listing will be reviewed and live within 2 hours.</p>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Visibility', value: anonymous ? 'Anonymous (company hidden)' : 'Public' },
                { label: 'Listing Type', value: nearExpiry ? 'Near-Expiry Surplus Deal' : 'Standard Listing' },
                { label: 'Auto-renew', value: 'Every 30 days' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-600">{item.label}</span>
                  <span className="text-sm font-medium text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
          {step > 1 && (
            <Button variant="secondary" onClick={() => setStep(step - 1)}>
              {t('btn.back')}
            </Button>
          )}
          {step < 4 ? (
            <Button variant="primary" className="flex-1" onClick={() => setStep(step + 1)}>
              {t('btn.continue')}
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button variant="ocean" className="flex-1" onClick={handlePublish}>
              <CheckCircle className="w-4 h-4" />
              {t('page.sell.publish')}
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

export default function SellPage() {
  const t = useT()
  const [view, setView] = useState<'dashboard' | 'new'>('dashboard')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sell Seafood</h1>
          <p className="text-slate-500 text-sm mt-1">
            Reach 48,200+ verified buyers in 87 countries • AI-powered pricing
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === 'dashboard' ? 'primary' : 'secondary'}
            onClick={() => setView('dashboard')}
          >
            <BarChart3 className="w-4 h-4" />
            My Listings
          </Button>
          <Button
            variant={view === 'new' ? 'primary' : 'secondary'}
            onClick={() => setView('new')}
          >
            <Plus className="w-4 h-4" />
            New Listing
          </Button>
        </div>
      </div>

      {view === 'dashboard' ? (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Active Listings', value: '2', icon: Package, color: 'text-ocean-600', bg: 'bg-ocean-50' },
              { label: 'Total Inquiries', value: '81', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Volume Sold', value: '122MT', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Revenue (MTD)', value: '$890K', icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50' },
            ].map(stat => {
              const Icon = stat.icon
              return (
                <Card key={stat.label} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${stat.bg}`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                      <p className="text-xs text-slate-500">{stat.label}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Quick add product CTA */}
          <Card className="p-5 border-2 border-dashed border-emerald-200 bg-emerald-50/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Plus className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">Add a Product to Sell</p>
                <p className="text-xs text-slate-500 mt-0.5">List your stock and reach 48,200+ verified buyers worldwide</p>
              </div>
            </div>
            <Button variant="primary" className="bg-emerald-600 hover:bg-emerald-700 whitespace-nowrap flex-shrink-0" onClick={() => setView('new')}>
              <Plus className="w-4 h-4" />New Listing
            </Button>
          </Card>

          {/* Near-expiry alert */}
          <Card className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500 rounded-xl">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900 text-sm">Near-Expiry Stock Alert</p>
                <p className="text-xs text-slate-600 mt-0.5">You have 8.5 MT of Cod expiring in 12 days. Connect with processors for guaranteed buyout at 50% invoice value.</p>
              </div>
              <Button variant="primary" size="sm" className="bg-amber-500 hover:bg-amber-600 whitespace-nowrap">
                List for Buyout
              </Button>
            </div>
          </Card>

          {/* Listings */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">{t('page.sell.myListings')}</h2>
            <div className="space-y-3">
              {MY_LISTINGS.map(listing => (
                <Card key={listing.id} className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-ocean-50 rounded-xl flex items-center justify-center text-2xl border border-ocean-100 flex-shrink-0">
                      {listing.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-slate-900 text-sm">{listing.name}</h3>
                          <p className="text-xs text-slate-500">{listing.origin} • {listing.species}</p>
                        </div>
                        <Badge variant={listing.status === 'Active' ? 'success' : 'danger'}>
                          {listing.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-900">{formatPrice(listing.price)}/kg</span>
                        <span>{listing.stock.toLocaleString()} kg stock</span>
                        <span>👁 {listing.views.toLocaleString()} {t('page.sell.views')}</span>
                        <span>💬 {listing.inquiries} {t('page.sell.inquiries')}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="secondary" size="sm">Analytics</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full" onClick={() => setView('new')}>
                <Plus className="w-4 h-4" />
                Add New Listing
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ListingForm />
          </div>
          <div className="space-y-4">
            {/* Tips */}
            <Card className="p-5">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Listing Tips
              </h3>
              <div className="space-y-2.5">
                {[
                  'Include high-quality photos — listings with photos get 3x more inquiries',
                  'Add all valid certifications to appear in filtered searches',
                  'Set competitive pricing using our AI suggestion tool',
                  'Respond to inquiries within 2 hours to increase your trust score',
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-ocean-600 font-bold text-xs mt-0.5">{i + 1}.</span>
                    <p className="text-xs text-slate-600 leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5 bg-gradient-to-br from-ocean-50 to-teal-50 border-ocean-100">
              <h3 className="font-semibold text-slate-900 mb-2">Supplier Verification</h3>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Verified suppliers get 5x more visibility, a trust badge, and access to premium buyer accounts.
              </p>
              <Button variant="primary" size="sm" className="w-full">
                Get Verified →
              </Button>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
