'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  ShoppingCart, TrendingUp, Newspaper, BookOpen, ChefHat,
  Bell, Search, Globe, ChevronDown, Menu, X, User, Waves,
  BarChart3, UserPlus, Building2, Mail, Phone, Lock, Eye,
  EyeOff, MapPin, Globe2, CheckCircle, ArrowRight, ArrowLeft,
  Shield, Briefcase, Package, ChevronRight, Star, AlertCircle, Users, Database, Brain, Palette
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage, useT, SUPPORTED_LANGUAGES, type LangCode } from '@/lib/i18n'

const NAV_ITEMS = [
  { tKey: 'nav.buy',       href: '/marketplace/buy',       icon: ShoppingCart, color: 'text-ocean-600',   activeBg: 'bg-ocean-600' },
  { tKey: 'nav.sell',      href: '/marketplace/sell',      icon: TrendingUp,   color: 'text-emerald-600', activeBg: 'bg-emerald-600' },
  { tKey: 'nav.groupBuy',  href: '/marketplace/group-buy', icon: Users,        color: 'text-violet-600',  activeBg: 'bg-violet-600' },
  { tKey: 'nav.prices',    href: '/prices',                icon: BarChart3,    color: 'text-purple-600',  activeBg: 'bg-purple-600' },
  { tKey: 'nav.news',      href: '/news',                  icon: Newspaper,    color: 'text-amber-600',   activeBg: 'bg-amber-500' },
  { tKey: 'nav.knowledge', href: '/knowledge',             icon: BookOpen,     color: 'text-sky-600',     activeBg: 'bg-sky-600' },
]

const COUNTRIES = [
  'United States', 'United Kingdom', 'Norway', 'Chile', 'China', 'Japan', 'Canada',
  'Australia', 'Germany', 'France', 'Spain', 'Netherlands', 'Ecuador', 'Vietnam',
  'Indonesia', 'Thailand', 'India', 'Bangladesh', 'Egypt', 'Israel', 'Brazil',
  'Mexico', 'South Korea', 'Singapore', 'UAE', 'Saudi Arabia', 'South Africa',
  'Nigeria', 'Morocco', 'New Zealand', 'Ireland', 'Denmark', 'Sweden', 'Iceland',
  'Portugal', 'Italy', 'Greece', 'Turkey', 'Peru', 'Argentina', 'Other',
]

const COMPANY_TYPES = [
  'Importer', 'Exporter', 'Trader / Broker', 'Wholesaler / Distributor',
  'Retailer / Supermarket', 'Food Service / HoReCa', 'Processor / Manufacturer',
  'Fishing Company', 'Aquaculture Farm', 'Logistics / Cold Chain', 'Other',
]

const TRADE_VOLUMES = [
  'Under 50 MT/year', '50–200 MT/year', '200–500 MT/year',
  '500–2,000 MT/year', '2,000–10,000 MT/year', '10,000+ MT/year', 'Prefer not to say',
]

const REFERRAL_SOURCES = [
  'Google Search', 'LinkedIn', 'Industry Event / Trade Show', 'Colleague / Partner Referral',
  'Seafood Trade Magazine', 'Facebook / Instagram', 'Email Newsletter', 'Other',
]

const PRODUCT_CATEGORIES = [
  { id: 'salmon',      label: 'Atlantic Salmon',    icon: '🐟' },
  { id: 'yellowfin',   label: 'Yellowfin Tuna',     icon: '🐠' },
  { id: 'tilapia',     label: 'Tilapia',             icon: '🐡' },
  { id: 'shrimp',      label: 'Shrimp',              icon: '🦐' },
  { id: 'lobster',     label: 'Lobster',             icon: '🦞' },
  { id: 'hamachi',     label: 'Hamachi',             icon: '🐡' },
  { id: 'value-added', label: 'Value Added Seafood', icon: '⭐' },
]

const FRESH_SPECIES = [
  { id: 'salmon',    label: 'Atlantic Salmon',  icon: '🐟' },
  { id: 'tuna',      label: 'Yellowfin Tuna',   icon: '🐠' },
  { id: 'seabass',   label: 'Sea Bass',         icon: '🐟' },
  { id: 'seabream',  label: 'Sea Bream',        icon: '🐡' },
  { id: 'shrimp',    label: 'Fresh Shrimp',     icon: '🦐' },
  { id: 'lobster',   label: 'Live Lobster',     icon: '🦞' },
  { id: 'oyster',    label: 'Oysters',          icon: '🦪' },
  { id: 'halibut',   label: 'Halibut',          icon: '🐟' },
  { id: 'snapper',   label: 'Red Snapper',      icon: '🐠' },
  { id: 'hamachi',   label: 'Hamachi',          icon: '🐡' },
  { id: 'grouper',   label: 'Grouper',          icon: '🐟' },
  { id: 'other',     label: 'Other Species',    icon: '🌊' },
]

const FRESH_CERTIFICATIONS = [
  'GlobalGAP', 'BAP (Best Aquaculture Practices)', 'ASC (Aquaculture Stewardship Council)',
  'MSC (Marine Stewardship Council)', 'HACCP', 'ISO 22000',
  'EU Organic', 'USDA Organic', 'Friend of the Sea', 'None currently',
]

const DELIVERY_FREQUENCIES = [
  'Daily', '2× per week', '3× per week', 'Weekly', 'Bi-weekly', 'As needed / On demand',
]

const FRESHNESS_TRACKING_SYSTEMS = [
  'IoT temperature sensors', 'Manual temperature logs', 'Blockchain traceability',
  'ERP / inventory software', 'Paper-based records only', 'Not yet implemented',
]

const COLD_STORAGE_CAPACITIES = [
  'Under 5 MT', '5–20 MT', '20–50 MT', '50–200 MT', '200–500 MT', '500 MT+',
]

const PORT_PROXIMITY = [
  'Within 10 km', '10–30 km', '30–60 km', '60–100 km', '100–200 km', '200 km+',
]

const TRADE_REGIONS = ['Europe', 'Asia Pacific', 'North America', 'Latin America', 'Middle East & Africa']

// ─── Registration Modal ────────────────────────────────────────────────────────
function RegisterModal({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const t = useT()
  const [regType, setRegType] = useState<null | 'customer' | 'producer' | 'admin'>(null)
  const [buyerType, setBuyerType] = useState<null | 'frozen' | 'fresh' | 'both'>(null)
  const [step, setStep] = useState(1)
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [adminUser, setAdminUser] = useState('')
  const [adminPass, setAdminPass] = useState('')
  const [adminError, setAdminError] = useState('')
  const [adminShowPass, setAdminShowPass] = useState(false)

  const [form, setForm] = useState({
    // Personal
    firstName: '', lastName: '', email: '', phone: '',
    password: '', confirmPassword: '',
    // Company
    companyName: '', companyType: '', regNumber: '', website: '',
    country: '', city: '', yearsInIndustry: '', tradeVolume: '',
    // General preferences
    tradeRole: 'both',
    productCategories: [] as string[],
    tradeRegions: [] as string[],
    referral: '',
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false,
    // Fresh-specific fields
    deliveryFrequency: '',
    coldStorageCapacity: '',
    storageTemperature: '',
    portAirportProximity: '',
    freshSpecies: [] as string[],
    freshCertifications: [] as string[],
    haccpCompliant: '' as string,
    healthAuthApproval: false,
    staffTraining: '',
    freshnessTracking: '',
    maxDeliveryHours: '',
    hasRefrigeratedFleet: '',
    qualityControlProcess: '',
  })

  const set = (field: string, value: any) => {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => { const n = { ...e }; delete n[field]; return n })
  }

  const toggleArray = (field: 'productCategories' | 'tradeRegions' | 'freshSpecies' | 'freshCertifications', value: string) => {
    setForm(f => ({
      ...f,
      [field]: (f[field] as string[]).includes(value)
        ? (f[field] as string[]).filter((v: string) => v !== value)
        : [...(f[field] as string[]), value],
    }))
  }

  const isFresh  = buyerType === 'fresh'
  const isBoth   = buyerType === 'both'
  const totalSteps = 3

  const validateStep = () => {
    const errs: Record<string, string> = {}
    if (step === 1) {
      if (!form.firstName.trim())  errs.firstName = 'Required'
      if (!form.lastName.trim())   errs.lastName  = 'Required'
      if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Valid email required'
      if (!form.phone.trim())      errs.phone     = 'Required'
      if (form.password.length < 8) errs.password = 'Minimum 8 characters'
      if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    }
    if (step === 2) {
      if (!form.companyName.trim()) errs.companyName     = 'Required'
      if (!form.companyType)        errs.companyType     = 'Required'
      if (!form.country)            errs.country         = 'Required'
      if (!form.city.trim())        errs.city            = 'Required'
      if (!form.yearsInIndustry)    errs.yearsInIndustry = 'Required'
      if (!form.tradeVolume)        errs.tradeVolume     = 'Required'
      if ((isFresh || isBoth) && !form.deliveryFrequency)    errs.deliveryFrequency    = 'Required'
      if ((isFresh || isBoth) && !form.coldStorageCapacity)  errs.coldStorageCapacity  = 'Required'
      if ((isFresh || isBoth) && !form.portAirportProximity) errs.portAirportProximity = 'Required'
    }
    if (step === 3) {
      if (buyerType === 'frozen' && form.productCategories.length === 0) errs.productCategories = 'Select at least one category'
      if ((isFresh || isBoth) && form.freshSpecies.length === 0) errs.freshSpecies = 'Select at least one species'
      if (!form.agreeTerms)   errs.agreeTerms   = 'You must accept the Terms & Conditions'
      if (!form.agreePrivacy) errs.agreePrivacy = 'You must accept the Privacy Policy'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const next   = () => { if (validateStep()) setStep(s => s + 1) }
  const back   = () => {
    if (step === 1) { setBuyerType(null) }
    else { setStep(s => s - 1) }
  }
  const submit = () => { if (validateStep()) setSubmitted(true) }

  const STEPS = isFresh ? [
    { num: 1, label: 'Account',      icon: User },
    { num: 2, label: 'Operations',   icon: Building2 },
    { num: 3, label: 'Compliance',   icon: Shield },
  ] : isBoth ? [
    { num: 1, label: 'Account',      icon: User },
    { num: 2, label: 'Company',      icon: Building2 },
    { num: 3, label: 'Preferences',  icon: Package },
  ] : [
    { num: 1, label: t('reg.step.account'),  icon: User },
    { num: 2, label: t('reg.step.company'),  icon: Building2 },
    { num: 3, label: t('reg.step.prefs'),    icon: Package },
  ]

  const Field = ({ label, error, required, children }: {
    label: string; error?: string; required?: boolean; children: React.ReactNode
  }) => (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />{error}
        </p>
      )}
    </div>
  )

  const inputCls = (err?: string) => cn(
    'w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ocean-300 transition-colors bg-white',
    err ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'
  )

  const pwStrength = form.password.length < 4 ? t('reg.weak') : form.password.length < 8 ? t('reg.fair') : form.password.length < 10 ? t('reg.good') : t('reg.strong')

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="bg-gradient-to-r from-ocean-600 to-ocean-800 rounded-t-2xl p-6 flex-shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {regType === null ? t('reg.title') : regType === 'customer' ? t('reg.title') : 'Producer Registration'}
              </h2>
              <p className="text-ocean-100 text-xs">{t('reg.subtitle')}</p>
            </div>
          </div>

          {regType === 'customer' && buyerType !== null && !submitted && (
            <div className="flex items-center gap-1">
              {STEPS.map((s, idx) => {
                const Icon = s.icon
                const done   = step > s.num
                const active = step === s.num
                return (
                  <div key={s.num} className="flex items-center gap-1 flex-1">
                    <div className={cn(
                      'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex-1 justify-center',
                      done   ? 'bg-white/30 text-white' :
                      active ? 'bg-white text-ocean-700' :
                               'bg-white/10 text-white/50'
                    )}>
                      {done ? <CheckCircle className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                      {s.label}
                    </div>
                    {idx < STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-white/30 flex-shrink-0" />}
                  </div>
                )
              })}
            </div>
          )}
          {regType === 'customer' && buyerType !== null && !submitted && (
            <div className="mt-2 flex items-center gap-2">
              <span className={cn(
                'text-xs font-medium px-2.5 py-0.5 rounded-full',
                buyerType === 'frozen' ? 'bg-blue-400/30 text-blue-100' :
                buyerType === 'fresh'  ? 'bg-emerald-400/30 text-emerald-100' :
                                        'bg-violet-400/30 text-violet-100'
              )}>
                {buyerType === 'frozen' ? '❄️ Frozen Seafood Buyer' :
                 buyerType === 'fresh'  ? '🌊 Fresh Seafood Buyer' :
                                         '🔄 Frozen & Fresh Buyer'}
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6">

          {/* ── Account type selector ── */}
          {regType === null && (
            <div className="py-4">
              <p className="text-sm text-slate-500 text-center mb-6">
                Choose how you want to use SeaHub
              </p>

              {/* Admin — full width on top */}
              <button
                onClick={() => setRegType('admin')}
                className="group w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-slate-200 hover:border-gray-500 hover:bg-gray-50 transition-all mb-4"
              >
                <div className="w-12 h-12 bg-gray-100 group-hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
                  <Database className="w-6 h-6 text-gray-700" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold text-slate-900 mb-0.5">Admin</p>
                  <p className="text-xs text-slate-500">Platform administration — restricted access</p>
                </div>
                <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full border border-gray-300 flex items-center gap-1 flex-shrink-0">
                  <Lock className="w-3 h-3" />Restricted
                </span>
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Customer */}
                <button
                  onClick={() => setRegType('customer')}
                  className="group flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-slate-200 hover:border-ocean-400 hover:bg-ocean-50 transition-all text-left"
                >
                  <div className="w-14 h-14 bg-ocean-50 group-hover:bg-ocean-100 rounded-2xl flex items-center justify-center transition-colors">
                    <ShoppingCart className="w-7 h-7 text-ocean-600" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-slate-900 mb-1">I&apos;m a Buyer</p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Importer, distributor, retailer or food-service operator looking to source seafood
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-ocean-600 bg-ocean-50 px-3 py-1 rounded-full border border-ocean-200">
                    Customer Account
                  </span>
                </button>

                {/* Producer */}
                <button
                  onClick={() => { onClose(); router.push('/register/producer') }}
                  className="group flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all text-left"
                >
                  <div className="w-14 h-14 bg-emerald-50 group-hover:bg-emerald-100 rounded-2xl flex items-center justify-center transition-colors">
                    <Building2 className="w-7 h-7 text-emerald-600" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-slate-900 mb-1">I&apos;m a Producer</p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Seafood producer, processor, exporter or aquaculture farm wanting to sell globally
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <Shield className="w-3 h-3" />Verified Producer
                  </span>
                </button>
              </div>

              <p className="text-center text-xs text-slate-400 mt-6">
                Already have an account?{' '}
                <button onClick={onClose} className="text-ocean-600 font-semibold hover:underline">Sign in</button>
              </p>
            </div>
          )}

          {/* ── Admin login ── */}
          {regType === 'admin' && (
            <div className="py-4 max-w-sm mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Database className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Admin Access</p>
                  <p className="text-xs text-slate-500">Enter your credentials to continue</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Username</label>
                  <input
                    type="text"
                    value={adminUser}
                    onChange={e => { setAdminUser(e.target.value); setAdminError('') }}
                    placeholder="Enter username"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    autoComplete="off"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={adminShowPass ? 'text' : 'password'}
                      value={adminPass}
                      onChange={e => { setAdminPass(e.target.value); setAdminError('') }}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          if (adminUser === 'noam' && adminPass === 'noamlironws') {
                            onClose(); router.push('/admin')
                          } else {
                            setAdminError('Invalid username or password')
                          }
                        }
                      }}
                      placeholder="Enter password"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 pr-10"
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      onClick={() => setAdminShowPass(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {adminShowPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {adminError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <p className="text-xs text-red-600">{adminError}</p>
                  </div>
                )}

                <button
                  onClick={() => {
                    if (adminUser === 'noam' && adminPass === 'noamlironws') {
                      onClose(); router.push('/admin')
                    } else {
                      setAdminError('Invalid username or password')
                    }
                  }}
                  className="w-full py-2.5 bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />Enter Admin Panel
                </button>

                <button
                  onClick={() => { setRegType(null); setAdminUser(''); setAdminPass(''); setAdminError('') }}
                  className="w-full text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  ← Back
                </button>
              </div>
            </div>
          )}

          {regType === 'customer' && buyerType === null && (
            <div className="py-2">
              <p className="text-sm text-slate-500 text-center mb-5">
                What type of seafood are you looking to purchase?
              </p>
              <div className="space-y-3">
                {/* Frozen */}
                <button
                  onClick={() => setBuyerType('frozen')}
                  className="group w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
                >
                  <div className="w-12 h-12 bg-blue-50 group-hover:bg-blue-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-colors">
                    ❄️
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 mb-0.5">Frozen Seafood Buyer</p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Purchase IQF, block-frozen or blast-frozen seafood. Ideal for importers, distributors and processors.
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                </button>

                {/* Fresh */}
                <button
                  onClick={() => setBuyerType('fresh')}
                  className="group w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all text-left"
                >
                  <div className="w-12 h-12 bg-emerald-50 group-hover:bg-emerald-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-colors">
                    🌊
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 mb-0.5">Fresh Seafood Buyer</p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Source live, chilled or fresh-on-ice seafood. Restaurants, premium retailers, and HoReCa operators.
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
                </button>

                {/* Both */}
                <button
                  onClick={() => setBuyerType('both')}
                  className="group w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-200 hover:border-violet-400 hover:bg-violet-50 transition-all text-left"
                >
                  <div className="w-12 h-12 bg-violet-50 group-hover:bg-violet-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-colors">
                    🔄
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 mb-0.5">Frozen &amp; Fresh Seafood Buyer</p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Full spectrum sourcing — both frozen and fresh categories across multiple supply chains.
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-violet-400 transition-colors flex-shrink-0" />
                </button>
              </div>
              <button
                onClick={() => setRegType(null)}
                className="mt-4 w-full text-xs text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" /> Back to account type selection
              </button>
            </div>
          )}

          {regType === 'customer' && buyerType !== null && (submitted ? (
            <div className="flex flex-col items-center text-center py-8">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{t('reg.welcome')}</h3>
              <p className="text-slate-500 text-sm mb-1">
                Account created for <span className="font-semibold text-slate-700">{form.firstName} {form.lastName}</span>
              </p>
              <p className="text-slate-400 text-xs mb-6">
                {t('reg.success.sub')} <span className="text-ocean-600 font-medium">{form.email}</span>
              </p>
              <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                <div className="p-3 bg-ocean-50 rounded-xl text-center">
                  <Shield className="w-5 h-5 text-ocean-600 mx-auto mb-1" />
                  <p className="text-xs font-semibold text-ocean-700">{t('reg.verified')}</p>
                  <p className="text-xs text-slate-500">{t('reg.verifiedSub')}</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl text-center">
                  <Star className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <p className="text-xs font-semibold text-emerald-700">{t('reg.fullAccess')}</p>
                  <p className="text-xs text-slate-500">{t('reg.fullAccessSub')}</p>
                </div>
              </div>
              <button onClick={onClose}
                className="mt-6 px-6 py-2.5 bg-ocean-600 text-white rounded-xl text-sm font-semibold hover:bg-ocean-700 transition-colors">
                {t('btn.dashboard')}
              </button>
            </div>
          ) : (
            <>
              {/* Step 1 — Personal */}
              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-sm text-slate-500 mb-4">{t('reg.personalDetails')}</p>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label={t('reg.firstName')} error={errors.firstName} required>
                      <input value={form.firstName} onChange={e => set('firstName', e.target.value)}
                        placeholder="John" className={inputCls(errors.firstName)} />
                    </Field>
                    <Field label={t('reg.lastName')} error={errors.lastName} required>
                      <input value={form.lastName} onChange={e => set('lastName', e.target.value)}
                        placeholder="Smith" className={inputCls(errors.lastName)} />
                    </Field>
                  </div>

                  <Field label={t('reg.email')} error={errors.email} required>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                        placeholder="john@company.com" className={cn(inputCls(errors.email), 'pl-9')} />
                    </div>
                  </Field>

                  <Field label={t('reg.phone')} error={errors.phone} required>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                        placeholder="+1 212 555 0100" className={cn(inputCls(errors.phone), 'pl-9')} />
                    </div>
                  </Field>

                  <Field label={t('reg.password')} error={errors.password} required>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type={showPass ? 'text' : 'password'} value={form.password}
                        onChange={e => set('password', e.target.value)}
                        placeholder="Min. 8 characters" className={cn(inputCls(errors.password), 'pl-9 pr-10')} />
                      <button type="button" onClick={() => setShowPass(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {[4, 6, 8, 10].map(n => (
                        <div key={n} className={cn('h-1 flex-1 rounded-full transition-colors',
                          form.password.length >= n ? 'bg-emerald-400' : 'bg-slate-200')} />
                      ))}
                      <span className="text-xs text-slate-400 ml-1">{pwStrength}</span>
                    </div>
                  </Field>

                  <Field label={t('reg.confirmPass')} error={errors.confirmPassword} required>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type={showConfirm ? 'text' : 'password'} value={form.confirmPassword}
                        onChange={e => set('confirmPassword', e.target.value)}
                        placeholder="Repeat password" className={cn(inputCls(errors.confirmPassword), 'pl-9 pr-10')} />
                      <button type="button" onClick={() => setShowConfirm(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </Field>
                </div>
              )}

              {/* Step 2 — Company / Operations */}
              {step === 2 && (
                <div className="space-y-4">
                  <p className="text-sm text-slate-500 mb-4">
                    {(isFresh || isBoth) ? 'Tell us about your company and fresh seafood operations' : t('reg.companyDetails')}
                  </p>

                  <Field label={t('reg.companyName')} error={errors.companyName} required>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input value={form.companyName} onChange={e => set('companyName', e.target.value)}
                        placeholder="Acme Seafood Ltd." className={cn(inputCls(errors.companyName), 'pl-9')} />
                    </div>
                  </Field>

                  <Field label={t('reg.companyType')} error={errors.companyType} required>
                    <select value={form.companyType} onChange={e => set('companyType', e.target.value)}
                      className={inputCls(errors.companyType)}>
                      <option value="">Select company type…</option>
                      {COMPANY_TYPES.map(ct => <option key={ct} value={ct}>{ct}</option>)}
                    </select>
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Business Reg. Number">
                      <input value={form.regNumber} onChange={e => set('regNumber', e.target.value)}
                        placeholder="Optional" className={inputCls()} />
                    </Field>
                    <Field label="Website">
                      <div className="relative">
                        <Globe2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input value={form.website} onChange={e => set('website', e.target.value)}
                          placeholder="www.company.com" className={cn(inputCls(), 'pl-9')} />
                      </div>
                    </Field>
                  </div>

                  <Field label={t('reg.country')} error={errors.country} required>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select value={form.country} onChange={e => set('country', e.target.value)}
                        className={cn(inputCls(errors.country), 'pl-9')}>
                        <option value="">Select country…</option>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </Field>

                  <Field label={t('reg.city')} error={errors.city} required>
                    <input value={form.city} onChange={e => set('city', e.target.value)}
                      placeholder="e.g. Bergen, Hordaland" className={inputCls(errors.city)} />
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label={t('reg.years')} error={errors.yearsInIndustry} required>
                      <select value={form.yearsInIndustry} onChange={e => set('yearsInIndustry', e.target.value)}
                        className={inputCls(errors.yearsInIndustry)}>
                        <option value="">Select…</option>
                        {['Less than 1', '1–3 years', '3–5 years', '5–10 years', '10–20 years', '20+ years'].map(v =>
                          <option key={v} value={v}>{v}</option>)}
                      </select>
                    </Field>
                    <Field label={t('reg.tradeVol')} error={errors.tradeVolume} required>
                      <select value={form.tradeVolume} onChange={e => set('tradeVolume', e.target.value)}
                        className={inputCls(errors.tradeVolume)}>
                        <option value="">Select…</option>
                        {TRADE_VOLUMES.map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </Field>
                  </div>

                  {/* ── Fresh-specific operational fields ── */}
                  {(isFresh || isBoth) && (
                    <div className="pt-3 border-t border-slate-100 space-y-4">
                      <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide flex items-center gap-1.5">
                        <span>🌊</span> Fresh Seafood Operations
                      </p>

                      <Field label="Required Delivery Frequency" error={errors.deliveryFrequency} required>
                        <select value={form.deliveryFrequency} onChange={e => set('deliveryFrequency', e.target.value)}
                          className={inputCls(errors.deliveryFrequency)}>
                          <option value="">Select frequency…</option>
                          {DELIVERY_FREQUENCIES.map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </Field>

                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Cold Storage Capacity" error={errors.coldStorageCapacity} required>
                          <select value={form.coldStorageCapacity} onChange={e => set('coldStorageCapacity', e.target.value)}
                            className={inputCls(errors.coldStorageCapacity)}>
                            <option value="">Select…</option>
                            {COLD_STORAGE_CAPACITIES.map(v => <option key={v} value={v}>{v}</option>)}
                          </select>
                        </Field>
                        <Field label="Storage Temperature (°C)">
                          <input value={form.storageTemperature} onChange={e => set('storageTemperature', e.target.value)}
                            placeholder="e.g. 0–4°C" className={inputCls()} />
                        </Field>
                      </div>

                      <Field label="Proximity to Port / Airport" error={errors.portAirportProximity} required>
                        <select value={form.portAirportProximity} onChange={e => set('portAirportProximity', e.target.value)}
                          className={inputCls(errors.portAirportProximity)}>
                          <option value="">Select distance…</option>
                          {PORT_PROXIMITY.map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </Field>

                      <Field label="Refrigerated Fleet / Transport">
                        <div className="grid grid-cols-3 gap-2">
                          {['Own fleet', 'Third-party logistics', 'Both'].map(opt => (
                            <button key={opt} type="button" onClick={() => set('hasRefrigeratedFleet', opt)}
                              className={cn(
                                'px-3 py-2 rounded-xl border text-xs font-medium transition-all',
                                form.hasRefrigeratedFleet === opt
                                  ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
                              )}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </Field>

                      <Field label="Max. Acceptable Time from Catch to Delivery">
                        <div className="grid grid-cols-2 gap-2">
                          {['Under 24 hrs', '24–48 hrs', '48–72 hrs', '72 hrs+'].map(opt => (
                            <button key={opt} type="button" onClick={() => set('maxDeliveryHours', opt)}
                              className={cn(
                                'px-3 py-2 rounded-xl border text-xs font-medium transition-all',
                                form.maxDeliveryHours === opt
                                  ? 'bg-ocean-50 border-ocean-400 text-ocean-700'
                                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
                              )}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </Field>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3 — Preferences / Compliance */}
              {step === 3 && (
                <div className="space-y-5">
                  <p className="text-sm text-slate-500 mb-2">
                    {(isFresh || isBoth) ? 'Cold chain compliance, certifications & species preferences' : t('reg.prefsDetails')}
                  </p>

                  {/* ── FRESH / BOTH: Species selection ── */}
                  {(isFresh || isBoth) && (
                    <>
                      <div>
                        <p className="text-xs font-semibold text-slate-700 mb-2">
                          Preferred Fresh Species<span className="text-red-500 ml-0.5">*</span>
                        </p>
                        {errors.freshSpecies && (
                          <p className="text-xs text-red-500 mb-2 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />{errors.freshSpecies}
                          </p>
                        )}
                        <div className="grid grid-cols-2 gap-2">
                          {FRESH_SPECIES.map(sp => (
                            <button key={sp.id} type="button" onClick={() => toggleArray('freshSpecies', sp.id)}
                              className={cn(
                                'flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all text-left',
                                form.freshSpecies.includes(sp.id)
                                  ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
                              )}>
                              <span className="text-base">{sp.icon}</span>
                              {sp.label}
                              {form.freshSpecies.includes(sp.id) && (
                                <CheckCircle className="w-3.5 h-3.5 ml-auto text-emerald-500" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Certifications */}
                      <div>
                        <p className="text-xs font-semibold text-slate-700 mb-2">
                          Freshness &amp; Safety Certifications Held
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {FRESH_CERTIFICATIONS.map(cert => (
                            <button key={cert} type="button" onClick={() => toggleArray('freshCertifications', cert)}
                              className={cn(
                                'px-3 py-1.5 rounded-full border text-xs font-medium transition-all',
                                form.freshCertifications.includes(cert)
                                  ? 'bg-ocean-50 border-ocean-400 text-ocean-700'
                                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
                              )}>
                              {cert}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* HACCP & Health Authority */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl border border-slate-200 space-y-2">
                          <p className="text-xs font-semibold text-slate-700">HACCP Compliant?</p>
                          <div className="flex gap-2">
                            {['Yes', 'No', 'In progress'].map(opt => (
                              <button key={opt} type="button"
                                onClick={() => set('haccpCompliant', opt === 'Yes' ? 'yes' : opt === 'No' ? 'no' : 'in-progress')}
                                className={cn(
                                  'flex-1 py-1.5 rounded-lg border text-xs font-medium transition-all',
                                  (opt === 'Yes' && form.haccpCompliant === 'yes') ||
                                  (opt === 'No' && form.haccpCompliant === 'no') ||
                                  (opt === 'In progress' && form.haccpCompliant === 'in-progress')
                                    ? 'bg-ocean-50 border-ocean-400 text-ocean-700'
                                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                                )}>
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="p-3 rounded-xl border border-slate-200 space-y-2">
                          <p className="text-xs font-semibold text-slate-700">Local Health Authority Approval?</p>
                          <div className="flex gap-2">
                            {['Yes', 'No'].map(opt => (
                              <button key={opt} type="button"
                                onClick={() => set('healthAuthApproval', opt === 'Yes')}
                                className={cn(
                                  'flex-1 py-1.5 rounded-lg border text-xs font-medium transition-all',
                                  (opt === 'Yes' && form.healthAuthApproval === true) ||
                                  (opt === 'No' && form.healthAuthApproval === false)
                                    ? 'bg-ocean-50 border-ocean-400 text-ocean-700'
                                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                                )}>
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Staff training */}
                      <Field label="Seafood Handling Staff Training Level">
                        <div className="grid grid-cols-3 gap-2">
                          {['Certified', 'In training', 'Not yet trained'].map(opt => (
                            <button key={opt} type="button" onClick={() => set('staffTraining', opt)}
                              className={cn(
                                'py-2 px-2 rounded-xl border text-xs font-medium transition-all text-center',
                                form.staffTraining === opt
                                  ? 'bg-ocean-50 border-ocean-400 text-ocean-700'
                                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
                              )}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </Field>

                      {/* Freshness tracking */}
                      <Field label="Freshness &amp; Temperature Tracking System">
                        <select value={form.freshnessTracking} onChange={e => set('freshnessTracking', e.target.value)}
                          className={inputCls()}>
                          <option value="">Select system…</option>
                          {FRESHNESS_TRACKING_SYSTEMS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </Field>

                      {/* Quality control */}
                      <Field label="Quality Control Process on Arrival">
                        <input value={form.qualityControlProcess} onChange={e => set('qualityControlProcess', e.target.value)}
                          placeholder="e.g. visual inspection, sensory checks, lab testing…"
                          className={inputCls()} />
                      </Field>

                      {/* Supply regions */}
                      <div>
                        <p className="text-xs font-semibold text-slate-700 mb-2">Preferred Supply Regions</p>
                        <div className="flex flex-wrap gap-2">
                          {TRADE_REGIONS.map(r => (
                            <button key={r} type="button" onClick={() => toggleArray('tradeRegions', r)}
                              className={cn(
                                'px-3 py-1.5 rounded-full border text-xs font-medium transition-all',
                                form.tradeRegions.includes(r)
                                  ? 'bg-ocean-50 border-ocean-400 text-ocean-700'
                                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
                              )}>
                              {r}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* ── FROZEN / BOTH: Standard product categories ── */}
                  {(buyerType === 'frozen' || isBoth) && (
                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-2">
                        {isBoth ? 'Frozen Product Categories' : t('reg.categories')}<span className="text-red-500 ml-0.5">*</span>
                      </p>
                      {errors.productCategories && (
                        <p className="text-xs text-red-500 mb-2 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />{errors.productCategories}
                        </p>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        {PRODUCT_CATEGORIES.map(cat => (
                          <button key={cat.id} type="button" onClick={() => toggleArray('productCategories', cat.id)}
                            className={cn(
                              'flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all text-left',
                              form.productCategories.includes(cat.id)
                                ? 'bg-blue-50 border-blue-400 text-blue-700'
                                : 'border-slate-200 text-slate-600 hover:border-slate-300'
                            )}>
                            <span className="text-base">{cat.icon}</span>
                            {cat.label}
                            {form.productCategories.includes(cat.id) && (
                              <CheckCircle className="w-3.5 h-3.5 ml-auto text-blue-500" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trade role — only for frozen */}
                  {buyerType === 'frozen' && (
                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-2">
                        {t('reg.tradeRole')}<span className="text-red-500 ml-0.5">*</span>
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { v: 'buy',  label: 'Buy',        icon: ShoppingCart },
                          { v: 'sell', label: 'Sell',       icon: TrendingUp },
                          { v: 'both', label: 'Buy & Sell', icon: Briefcase },
                        ].map(opt => {
                          const Icon = opt.icon
                          return (
                            <button key={opt.v} type="button" onClick={() => set('tradeRole', opt.v)}
                              className={cn(
                                'flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition-all',
                                form.tradeRole === opt.v
                                  ? 'bg-ocean-50 border-ocean-400 text-ocean-700'
                                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
                              )}>
                              <Icon className="w-4 h-4" />
                              {opt.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Trade regions — frozen only (fresh handled above) */}
                  {buyerType === 'frozen' && (
                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-2">{t('reg.regions')}</p>
                      <div className="flex flex-wrap gap-2">
                        {TRADE_REGIONS.map(r => (
                          <button key={r} type="button" onClick={() => toggleArray('tradeRegions', r)}
                            className={cn(
                              'px-3 py-1.5 rounded-full border text-xs font-medium transition-all',
                              form.tradeRegions.includes(r)
                                ? 'bg-ocean-50 border-ocean-400 text-ocean-700'
                                : 'border-slate-200 text-slate-600 hover:border-slate-300'
                            )}>
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Referral */}
                  <div>
                    <p className="text-xs font-semibold text-slate-700 mb-1.5">{t('reg.referral')}</p>
                    <select value={form.referral} onChange={e => set('referral', e.target.value)}
                      className={inputCls()}>
                      <option value="">Select…</option>
                      {REFERRAL_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* Agreements */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-100">
                    {[
                      { field: 'agreeTerms',     label: t('reg.agreeTerms'),     required: true  },
                      { field: 'agreePrivacy',   label: t('reg.agreePrivacy'),   required: true  },
                      { field: 'agreeMarketing', label: t('reg.agreeMarketing'), required: false },
                    ].map(item => (
                      <div key={item.field}>
                        <label className="flex items-start gap-2.5 cursor-pointer group">
                          <div
                            onClick={() => set(item.field, !(form as any)[item.field])}
                            className={cn(
                              'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all cursor-pointer',
                              (form as any)[item.field]
                                ? 'bg-ocean-600 border-ocean-600'
                                : 'border-slate-300 group-hover:border-ocean-400'
                            )}>
                            {(form as any)[item.field] && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                          </div>
                          <span className="text-xs text-slate-600 leading-relaxed">
                            {item.label}{item.required && <span className="text-red-500 ml-0.5">*</span>}
                          </span>
                        </label>
                        {errors[item.field] && (
                          <p className="text-xs text-red-500 mt-1 ml-7 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />{errors[item.field]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ))}
        </div>

        {/* Footer — show for customer form after buyer type is selected */}
        {regType === 'customer' && buyerType !== null && !submitted && (
          <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 flex-shrink-0 bg-slate-50 rounded-b-2xl">
            <p className="text-xs text-slate-400">Step {step} of {totalSteps}</p>
            <div className="flex gap-2">
              <button onClick={back}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                <ArrowLeft className="w-4 h-4" />{t('btn.back')}
              </button>
              {step < totalSteps ? (
                <button onClick={next}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-ocean-600 text-white text-sm font-semibold hover:bg-ocean-700 transition-colors">
                  {t('btn.continue')}<ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={submit}
                  className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors">
                  <Shield className="w-4 h-4" />{t('btn.createAccount')}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
export default function Navbar() {
  const pathname = usePathname()
  const t = useT()
  const { lang, setLang } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-ocean-gradient flex items-center justify-center shadow-ocean">
                <Waves className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold text-slate-900">SeaHub</span>
                <span className="text-xs text-slate-400 block -mt-1 font-medium">Global Seafood Platform</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname?.startsWith(item.href)
                return (
                  <Link key={item.href} href={item.href}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      isActive ? 'bg-ocean-200 text-ocean-900 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    )}>
                    <Icon className={cn('w-4 h-4', isActive ? 'text-ocean-800' : item.color)} />
                    {t(item.tKey)}
                  </Link>
                )
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors hidden sm:flex">
                <Search className="w-5 h-5" />
              </button>

              {/* Language selector */}
              <div className="relative">
                <button onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors text-sm font-medium">
                  <Globe className="w-4 h-4" />
                  {SUPPORTED_LANGUAGES.find(l => l.code === lang)?.flag ?? '🌐'}
                  <span className="hidden sm:inline">{lang.toUpperCase()}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {langOpen && (
                  <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-glass border border-slate-100 py-1 z-50">
                    {SUPPORTED_LANGUAGES.map(language => (
                      <button
                        key={language.code}
                        onClick={() => { setLang(language.code as LangCode); setLangOpen(false) }}
                        className={cn(
                          'w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition-colors flex items-center gap-2',
                          language.code === lang ? 'text-ocean-600 font-semibold bg-ocean-50' : 'text-slate-600'
                        )}>
                        <span>{language.flag}</span>
                        <span>{language.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors hidden sm:flex">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* Register */}
              <button onClick={() => setRegisterOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg border border-ocean-300 text-ocean-700 text-sm font-medium hover:bg-ocean-50 transition-colors">
                <UserPlus className="w-4 h-4" />
                <span className="hidden md:inline">{t('nav.register')}</span>
              </button>

              {/* My Account */}
              <Link href="/dashboard"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-ocean-600 text-white text-sm font-medium hover:bg-ocean-700 transition-colors">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{t('nav.myAccount')}</span>
              </Link>

              {/* Mobile toggle */}
              <button onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-16 left-0 right-0 bg-white border-b border-slate-100 shadow-xl">
            <nav className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                    className={cn('flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all',
                      isActive ? 'bg-ocean-200 text-ocean-900 shadow-sm' : 'text-slate-700 hover:bg-slate-50')}>
                    <Icon className={cn('w-5 h-5', item.color)} />
                    {t(item.tKey)}
                  </Link>
                )
              })}
              <button onClick={() => { setMobileOpen(false); setRegisterOpen(true) }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium w-full text-ocean-700 hover:bg-ocean-50 transition-all">
                <UserPlus className="w-5 h-5 text-ocean-600" />
                {t('nav.register')}
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="h-16" />

      {/* Register Modal */}
      {registerOpen && <RegisterModal onClose={() => setRegisterOpen(false)} />}
    </>
  )
}
