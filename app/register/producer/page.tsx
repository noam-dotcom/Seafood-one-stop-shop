'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import {
  Building2, Factory, Fish, Award, FlaskConical, Search,
  Anchor, DollarSign, Shield, Star, Leaf, CheckCircle,
  AlertCircle, Upload, X, Plus, Trash2, ChevronRight,
  ArrowLeft, ArrowRight, Save, Waves, Globe2, MapPin,
  Phone, Mail, FileText, Lock, Eye, EyeOff, Check
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Section definitions ──────────────────────────────────────────────────────
const SECTIONS = [
  { num: 1,  icon: Building2,    title: 'Company Identity',          short: 'Identity'        },
  { num: 2,  icon: Factory,      title: 'Production Facilities',     short: 'Facilities'      },
  { num: 3,  icon: Fish,         title: 'Product Portfolio',         short: 'Products'        },
  { num: 4,  icon: Award,        title: 'Certifications',            short: 'Certs'           },
  { num: 5,  icon: FlaskConical, title: 'Batch Testing',             short: 'Testing'         },
  { num: 6,  icon: Search,       title: 'Traceability',              short: 'Traceability'    },
  { num: 7,  icon: Anchor,       title: 'Logistics & Export',        short: 'Logistics'       },
  { num: 8,  icon: DollarSign,   title: 'Commercial Terms',          short: 'Commercial'      },
  { num: 9,  icon: Shield,       title: 'Trust & Verification',      short: 'Trust'           },
  { num: 10, icon: Star,         title: 'Reputation & Presence',     short: 'Reputation'      },
  { num: 11, icon: Leaf,         title: 'Ethics & Sustainability',   short: 'Ethics'          },
  { num: 12, icon: CheckCircle,  title: 'Review & Submit',           short: 'Submit'          },
]

const PROCESSING = ['Whole Fish','Fillets','Portions','Breaded','Cooked','IQF','Block Frozen','Canned','Smoked','Marinated','Other']
const CERTIFICATIONS_LIST = ['HACCP','ISO 22000','BRC / BRCGS','IFS Food','FDA Registered','EU Approved','Halal','Kosher','MSC','ASC','Friend of the Sea','GlobalG.A.P','BAP','Other']
const TEST_TYPES = ['Microbiological','Heavy Metals','Antibiotics / Residues','Parasites','Histamine','Sensory Quality','Weight Verification','Allergens','Dioxins & PCBs']
const INCOTERMS = ['FOB','CIF','CFR','DDP','DAP','EXW','FCA','CPT']
const PAYMENT_TERMS = ['Letter of Credit (LC)','Telegraphic Transfer (TT)','Cash Against Documents (CAD)','Open Account (OA)','Documentary Collection']
const CURRENCIES = ['USD','EUR','GBP','JPY','CNY','AED','SAR','NOK','DKK','SEK']
const STANDARD_DOCS = ['Bill of Lading','Packing List','Commercial Invoice','Certificate of Origin','Catch Certificate','Veterinary Certificate','Health Certificate','EUR.1 / ATR','Phytosanitary Certificate']
const FAO_ZONES = ['FAO 18 — Arctic','FAO 21 — NW Atlantic','FAO 27 — NE Atlantic','FAO 31 — W Central Atlantic','FAO 34 — E Central Atlantic','FAO 37 — Mediterranean','FAO 41 — SW Atlantic','FAO 47 — SE Atlantic','FAO 51 — W Indian Ocean','FAO 57 — E Indian Ocean','FAO 61 — NW Pacific','FAO 67 — NE Pacific','FAO 71 — W Central Pacific','FAO 77 — E Central Pacific','FAO 81 — SW Pacific','FAO 87 — SE Pacific','Aquaculture / Farmed']
const COUNTRIES = ['Norway','Chile','China','Vietnam','India','Ecuador','Indonesia','Thailand','Bangladesh','Egypt','USA','Canada','Spain','Morocco','Iceland','Scotland','Japan','Australia','New Zealand','Peru','Argentina','Brazil','Mexico','UAE','Saudi Arabia','South Africa','Nigeria','Other']

// ─── Types ────────────────────────────────────────────────────────────────────
interface Product {
  id: string; species: string; scientificName: string; form: string
  processing: string; origin: string; faoZone: string; sizes: string
  packaging: string; netWeight: string; glazing: string; shelfLife: string
  storageTemp: string; hsCode: string; photos: string[]; specSheet: string; video: string
}
interface Cert {
  id: string; type: string; authority: string; certNumber: string
  issueDate: string; expiryDate: string; file: string
}
interface UploadState { [key: string]: string }

// ─── Helpers ──────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 8)

function FileUpload({ label, field, uploads, onUpload, accept = 'PDF', multiple = false }: {
  label: string; field: string; uploads: UploadState
  onUpload: (field: string, name: string) => void
  accept?: string; multiple?: boolean
}) {
  const hasFile = !!uploads[field]
  return (
    <div>
      <p className="text-xs font-semibold text-slate-700 mb-1.5">{label}</p>
      <label className={cn(
        'flex items-center gap-3 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-all',
        hasFile ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:border-ocean-300 hover:bg-ocean-50'
      )}>
        <input type="file" className="hidden" accept={accept === 'PDF' ? '.pdf' : '*'}
          onChange={e => { if (e.target.files?.[0]) onUpload(field, e.target.files[0].name) }} />
        {hasFile
          ? <><CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" /><span className="text-xs text-emerald-700 font-medium truncate">{uploads[field]}</span></>
          : <><Upload className="w-4 h-4 text-slate-400 flex-shrink-0" /><span className="text-xs text-slate-500">Click to upload {accept}</span></>
        }
      </label>
    </div>
  )
}

function CheckboxGrid({ options, selected, onChange, cols = 3 }: {
  options: string[]; selected: string[]
  onChange: (v: string[]) => void; cols?: number
}) {
  const toggle = (opt: string) =>
    onChange(selected.includes(opt) ? selected.filter(x => x !== opt) : [...selected, opt])
  return (
    <div className={cn('grid gap-2', cols === 2 ? 'grid-cols-2' : cols === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3')}>
      {options.map(opt => (
        <label key={opt} className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-xl border text-xs cursor-pointer transition-all',
          selected.includes(opt) ? 'bg-ocean-50 border-ocean-400 text-ocean-800 font-semibold' : 'border-slate-200 text-slate-600 hover:border-slate-300'
        )}>
          <div className={cn('w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0',
            selected.includes(opt) ? 'bg-ocean-600 border-ocean-600' : 'border-slate-300')}>
            {selected.includes(opt) && <Check className="w-3 h-3 text-white" />}
          </div>
          <input type="checkbox" className="hidden" checked={selected.includes(opt)} onChange={() => toggle(opt)} />
          {opt}
        </label>
      ))}
    </div>
  )
}

function SectionHeader({ icon: Icon, title, desc, color = 'ocean' }: {
  icon: React.ElementType; title: string; desc: string; color?: string
}) {
  return (
    <div className="flex items-start gap-4 mb-6 pb-4 border-b border-slate-100">
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
        color === 'emerald' ? 'bg-emerald-100' : color === 'violet' ? 'bg-violet-100' : color === 'amber' ? 'bg-amber-100' : 'bg-ocean-100')}>
        <Icon className={cn('w-5 h-5', color === 'emerald' ? 'text-emerald-600' : color === 'violet' ? 'text-violet-600' : color === 'amber' ? 'text-amber-600' : 'text-ocean-600')} />
      </div>
      <div>
        <h2 className="font-bold text-slate-900 text-base">{title}</h2>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

const inputCls = 'w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ocean-300 bg-white'
const labelCls = 'block text-xs font-semibold text-slate-700 mb-1.5'

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProducerRegistrationPage() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [uploads, setUploads] = useState<UploadState>({})

  // Form state grouped by section
  const [s1, setS1] = useState({ legalName: '', brandName: '', country: '', yearEstablished: '', regNumber: '', taxId: '', hqAddress: '', facilityAddress: '', website: '', contactName: '', contactTitle: '', contactEmail: '', contactPhone: '', contactWhatsApp: '', exportName: '', exportEmail: '', exportPhone: '', ownershipType: '' })
  const [s2, setS2] = useState({ numSites: '', facilityLocations: '', capacityMonth: '', coldStorage: '', processing: [] as string[], exportMarkets: [] as string[], leadTime: '', moq: '', privateLabel: '' })
  const [products, setProducts] = useState<Product[]>([{ id: uid(), species: '', scientificName: '', form: '', processing: '', origin: '', faoZone: '', sizes: '', packaging: '', netWeight: '', glazing: '', shelfLife: '', storageTemp: '', hsCode: '', photos: [], specSheet: '', video: '' }])
  const [certs, setCerts] = useState<Cert[]>([{ id: uid(), type: '', authority: '', certNumber: '', issueDate: '', expiryDate: '', file: '' }])
  const [s5, setS5] = useState({ batchInspection: '', inspectionCompany: '', testTypes: [] as string[] })
  const [s6, setS6] = useState({ hasSystem: '', method: '', trackBatch: false, trackDate: false, trackVessel: false, trackFarm: false })
  const [s7, setS7] = useState({ nearestPort: '', incoterms: [] as string[], standardDocs: [] as string[], freightForwarders: '', insuranceCoverage: '' })
  const [s8, setS8] = useState({ paymentTerms: [] as string[], currencies: [] as string[], discountStructure: '', volumePricing: '', contractFlexibility: '' })
  const [s9, setS9] = useState({ agreeAudit: false, agreeBatch: false, agreeEscrow: false, digitalSignature: '' })
  const [s10, setS10] = useState({ clients: ['', '', '', '', ''], awards: '', exhibitions: '', mediaLinks: '' })
  const [s11, setS11] = useState({ noForcedLabor: false, sustainableDecl: false })
  const [s12, setS12] = useState({ agreeTerms: false, agreePrivacy: false })

  const handleUpload = useCallback((field: string, name: string) => {
    setUploads(u => ({ ...u, [field]: name }))
  }, [])

  // Completeness calculation
  const sectionComplete: Record<number, boolean> = {
    1: !!(s1.legalName && s1.country && s1.regNumber && s1.contactEmail),
    2: !!(s2.capacityMonth && s2.processing.length > 0 && s2.moq),
    3: products.some(p => p.species && p.form),
    4: certs.some(c => c.type),
    5: !!s5.batchInspection,
    6: !!s6.hasSystem,
    7: !!(s7.nearestPort && s7.incoterms.length > 0),
    8: !!(s8.paymentTerms.length > 0 && s8.currencies.length > 0),
    9: !!(s9.agreeAudit && s9.agreeEscrow && s9.digitalSignature),
    10: s10.clients.some(c => c.trim()),
    11: s11.noForcedLabor && s11.sustainableDecl,
    12: s12.agreeTerms && s12.agreePrivacy,
  }
  const completedCount = Object.values(sectionComplete).filter(Boolean).length
  const completionPct = Math.round((completedCount / 12) * 100)

  const addProduct = () => setProducts(p => [...p, { id: uid(), species: '', scientificName: '', form: '', processing: '', origin: '', faoZone: '', sizes: '', packaging: '', netWeight: '', glazing: '', shelfLife: '', storageTemp: '', hsCode: '', photos: [], specSheet: '', video: '' }])
  const removeProduct = (id: string) => setProducts(p => p.filter(x => x.id !== id))
  const updateProduct = (id: string, field: keyof Product, value: any) => setProducts(p => p.map(x => x.id === id ? { ...x, [field]: value } : x))

  const addCert = () => setCerts(c => [...c, { id: uid(), type: '', authority: '', certNumber: '', issueDate: '', expiryDate: '', file: '' }])
  const removeCert = (id: string) => setCerts(c => c.filter(x => x.id !== id))
  const updateCert = (id: string, field: keyof Cert, value: string) => setCerts(c => c.map(x => x.id === id ? { ...x, [field]: value } : x))

  // ── Success ──
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean-50 to-slate-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-10 text-center">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-12 h-12 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Application Submitted!</h1>
          <p className="text-slate-500 mb-2">Your producer profile is under review by our verification team.</p>
          <p className="text-sm text-slate-400 mb-6">Expected review time: <strong className="text-slate-600">3–5 business days</strong></p>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: FileText, label: 'Documents', sub: 'Being verified', color: 'bg-sky-50 text-sky-600' },
              { icon: Shield, label: 'Trust Score', sub: 'Calculating…', color: 'bg-violet-50 text-violet-600' },
              { icon: Star, label: 'Verified Badge', sub: 'Pending', color: 'bg-amber-50 text-amber-600' },
            ].map(item => (
              <div key={item.label} className="p-3 bg-slate-50 rounded-xl">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2', item.color.split(' ')[0])}>
                  <item.icon className={cn('w-4 h-4', item.color.split(' ')[1])} />
                </div>
                <p className="text-xs font-semibold text-slate-700">{item.label}</p>
                <p className="text-xs text-slate-400">{item.sub}</p>
              </div>
            ))}
          </div>
          <Link href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-ocean-600 text-white rounded-xl font-semibold text-sm hover:bg-ocean-700 transition-colors">
            <Waves className="w-4 h-4" />Back to SeaHub
          </Link>
        </div>
      </div>
    )
  }

  const currentSection = SECTIONS[step - 1]
  const SectionIcon = currentSection.icon

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-ocean-gradient flex items-center justify-center">
              <Waves className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-sm hidden sm:block">SeaHub</span>
          </Link>
          <div className="flex-1 max-w-md">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold text-slate-700">Profile Completeness</span>
              <span className="font-bold text-ocean-600">{completionPct}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-ocean-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${completionPct}%` }} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 flex-shrink-0">
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:block">Auto-saved</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6">

          {/* ── Sidebar ── */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 p-3 sticky top-20">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide px-2 mb-3">12 Sections</p>
              <nav className="space-y-0.5">
                {SECTIONS.map(s => {
                  const Icon = s.icon
                  const isActive = step === s.num
                  const isDone = sectionComplete[s.num]
                  return (
                    <button key={s.num} onClick={() => setStep(s.num)}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all text-left',
                        isActive ? 'bg-ocean-50 text-ocean-700' : 'text-slate-600 hover:bg-slate-50'
                      )}>
                      <div className={cn('w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold',
                        isDone ? 'bg-emerald-500 text-white' : isActive ? 'bg-ocean-600 text-white' : 'bg-slate-200 text-slate-500')}>
                        {isDone ? <Check className="w-3 h-3" /> : s.num}
                      </div>
                      <span className="truncate">{s.short}</span>
                    </button>
                  )
                })}
              </nav>

              <div className="mt-4 p-3 bg-gradient-to-br from-ocean-50 to-emerald-50 rounded-xl border border-ocean-100 text-center">
                <Shield className="w-6 h-6 text-ocean-600 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-ocean-800">Verified Producer</p>
                <p className="text-xs text-slate-500">Badge upon approval</p>
                <div className="mt-2 h-1.5 bg-white rounded-full overflow-hidden">
                  <div className="h-full bg-ocean-500 rounded-full transition-all" style={{ width: `${completionPct}%` }} />
                </div>
                <p className="text-xs text-ocean-600 font-semibold mt-1">{completionPct}% complete</p>
              </div>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <main className="flex-1 min-w-0">
            {/* Mobile step indicator */}
            <div className="lg:hidden overflow-x-auto mb-4">
              <div className="flex gap-1.5 min-w-max pb-2">
                {SECTIONS.map(s => {
                  const isDone = sectionComplete[s.num]
                  return (
                    <button key={s.num} onClick={() => setStep(s.num)}
                      className={cn('flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
                        step === s.num ? 'bg-ocean-600 text-white' : isDone ? 'bg-emerald-100 text-emerald-700' : 'bg-white border border-slate-200 text-slate-500')}>
                      {isDone && <Check className="w-3 h-3" />}
                      {s.short}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">

              {/* ── SECTION 1: Company Identity ── */}
              {step === 1 && (
                <div>
                  <SectionHeader icon={Building2} title="Company Identity & Legal Details" desc="Your official company information for legal verification and buyer trust." />
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Legal Company Name <span className="text-red-500">*</span></label>
                        <input value={s1.legalName} onChange={e => setS1(v => ({ ...v, legalName: e.target.value }))} placeholder="Full legal name" className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Commercial / Brand Name</label>
                        <input value={s1.brandName} onChange={e => setS1(v => ({ ...v, brandName: e.target.value }))} placeholder="Trade name / brand" className={inputCls} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className={labelCls}>Country of Registration <span className="text-red-500">*</span></label>
                        <select value={s1.country} onChange={e => setS1(v => ({ ...v, country: e.target.value }))} className={inputCls}>
                          <option value="">Select…</option>
                          {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Year Established <span className="text-red-500">*</span></label>
                        <input value={s1.yearEstablished} onChange={e => setS1(v => ({ ...v, yearEstablished: e.target.value }))} placeholder="e.g. 1998" className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Ownership Type <span className="text-red-500">*</span></label>
                        <select value={s1.ownershipType} onChange={e => setS1(v => ({ ...v, ownershipType: e.target.value }))} className={inputCls}>
                          <option value="">Select…</option>
                          {['Private','Public / Listed','Cooperative','Government / State','Family Business','Joint Venture'].map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Company Registration Number <span className="text-red-500">*</span></label>
                        <input value={s1.regNumber} onChange={e => setS1(v => ({ ...v, regNumber: e.target.value }))} placeholder="Official reg. number" className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Tax ID / VAT Number</label>
                        <input value={s1.taxId} onChange={e => setS1(v => ({ ...v, taxId: e.target.value }))} placeholder="Tax / VAT ID" className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Headquarters Address <span className="text-red-500">*</span></label>
                      <textarea value={s1.hqAddress} onChange={e => setS1(v => ({ ...v, hqAddress: e.target.value }))} placeholder="Full address including city, region, postal code" rows={2} className={cn(inputCls, 'resize-none')} />
                    </div>
                    <div>
                      <label className={labelCls}>Production Facility Address(es)</label>
                      <textarea value={s1.facilityAddress} onChange={e => setS1(v => ({ ...v, facilityAddress: e.target.value }))} placeholder="List production site addresses (one per line)" rows={2} className={cn(inputCls, 'resize-none')} />
                    </div>
                    <div>
                      <label className={labelCls}>Official Website</label>
                      <div className="relative">
                        <Globe2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input value={s1.website} onChange={e => setS1(v => ({ ...v, website: e.target.value }))} placeholder="https://www.yourcompany.com" className={cn(inputCls, 'pl-9')} />
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-700 mb-3">Primary Contact Person</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className={labelCls}>Full Name <span className="text-red-500">*</span></label>
                          <input value={s1.contactName} onChange={e => setS1(v => ({ ...v, contactName: e.target.value }))} placeholder="John Smith" className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Job Title</label>
                          <input value={s1.contactTitle} onChange={e => setS1(v => ({ ...v, contactTitle: e.target.value }))} placeholder="e.g. Commercial Director" className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Email <span className="text-red-500">*</span></label>
                          <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="email" value={s1.contactEmail} onChange={e => setS1(v => ({ ...v, contactEmail: e.target.value }))} placeholder="contact@company.com" className={cn(inputCls,'pl-9')} /></div>
                        </div>
                        <div>
                          <label className={labelCls}>Phone <span className="text-red-500">*</span></label>
                          <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="tel" value={s1.contactPhone} onChange={e => setS1(v => ({ ...v, contactPhone: e.target.value }))} placeholder="+47 123 456 789" className={cn(inputCls,'pl-9')} /></div>
                        </div>
                        <div className="sm:col-span-2">
                          <label className={labelCls}>WhatsApp Number</label>
                          <input value={s1.contactWhatsApp} onChange={e => setS1(v => ({ ...v, contactWhatsApp: e.target.value }))} placeholder="+47 123 456 789" className={inputCls} />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-700 mb-3">Export Manager Contact</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className={labelCls}>Name</label>
                          <input value={s1.exportName} onChange={e => setS1(v => ({ ...v, exportName: e.target.value }))} placeholder="Export Manager" className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Email</label>
                          <input type="email" value={s1.exportEmail} onChange={e => setS1(v => ({ ...v, exportEmail: e.target.value }))} placeholder="export@company.com" className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Phone</label>
                          <input type="tel" value={s1.exportPhone} onChange={e => setS1(v => ({ ...v, exportPhone: e.target.value }))} placeholder="+47 …" className={inputCls} />
                        </div>
                      </div>
                    </div>

                    <FileUpload label="Company Registration Certificate (PDF) *" field="regCert" uploads={uploads} onUpload={handleUpload} />
                  </div>
                </div>
              )}

              {/* ── SECTION 2: Production Facilities ── */}
              {step === 2 && (
                <div>
                  <SectionHeader icon={Factory} title="Production Facilities & Capacity" desc="Details about your processing plants, output capacity, and operational capabilities." color="emerald" />
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className={labelCls}>Number of Production Sites</label>
                        <input type="number" value={s2.numSites} onChange={e => setS2(v => ({ ...v, numSites: e.target.value }))} placeholder="e.g. 3" className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Monthly Production Capacity (MT) <span className="text-red-500">*</span></label>
                        <input type="number" value={s2.capacityMonth} onChange={e => setS2(v => ({ ...v, capacityMonth: e.target.value }))} placeholder="e.g. 2500" className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Cold Storage Capacity (MT)</label>
                        <input type="number" value={s2.coldStorage} onChange={e => setS2(v => ({ ...v, coldStorage: e.target.value }))} placeholder="e.g. 5000" className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Facility Locations</label>
                      <textarea value={s2.facilityLocations} onChange={e => setS2(v => ({ ...v, facilityLocations: e.target.value }))} placeholder="List facility locations (city, region, GPS if available)" rows={2} className={cn(inputCls,'resize-none')} />
                    </div>
                    <div>
                      <label className={labelCls}>Processing Capabilities <span className="text-red-500">*</span></label>
                      <CheckboxGrid options={PROCESSING} selected={s2.processing} onChange={v => setS2(x => ({ ...x, processing: v }))} />
                    </div>
                    <div>
                      <label className={labelCls}>Main Export Markets</label>
                      <CheckboxGrid options={['Europe','USA / Canada','Asia Pacific','Middle East','Latin America','Africa','Oceania']} selected={s2.exportMarkets} onChange={v => setS2(x => ({ ...x, exportMarkets: v }))} cols={4} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className={labelCls}>Production Lead Time</label>
                        <input value={s2.leadTime} onChange={e => setS2(v => ({ ...v, leadTime: e.target.value }))} placeholder="e.g. 2–4 weeks" className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Minimum Order Quantity (MOQ) <span className="text-red-500">*</span></label>
                        <input value={s2.moq} onChange={e => setS2(v => ({ ...v, moq: e.target.value }))} placeholder="e.g. 500kg / 1 MT" className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Private Label Capability</label>
                        <select value={s2.privateLabel} onChange={e => setS2(v => ({ ...v, privateLabel: e.target.value }))} className={inputCls}>
                          <option value="">Select…</option>
                          <option>Yes — full private label</option>
                          <option>Yes — with minimum order</option>
                          <option>No</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── SECTION 3: Products ── */}
              {step === 3 && (
                <div>
                  <SectionHeader icon={Fish} title="Product Portfolio" desc="Build your product catalog. Add all species and product forms you offer." />
                  <div className="space-y-6">
                    {products.map((p, idx) => (
                      <div key={p.id} className="border border-slate-200 rounded-2xl p-5 relative">
                        <div className="flex items-center justify-between mb-4">
                          <p className="font-semibold text-slate-800 text-sm">Product #{idx + 1}</p>
                          {products.length > 1 && (
                            <button onClick={() => removeProduct(p.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className={labelCls}>Species (Common Name) <span className="text-red-500">*</span></label>
                            <input value={p.species} onChange={e => updateProduct(p.id,'species',e.target.value)} placeholder="e.g. Atlantic Salmon" className={inputCls} />
                          </div>
                          <div>
                            <label className={labelCls}>Scientific Name</label>
                            <input value={p.scientificName} onChange={e => updateProduct(p.id,'scientificName',e.target.value)} placeholder="e.g. Salmo salar" className={inputCls} />
                          </div>
                          <div>
                            <label className={labelCls}>Product Form <span className="text-red-500">*</span></label>
                            <select value={p.form} onChange={e => updateProduct(p.id,'form',e.target.value)} className={inputCls}>
                              <option value="">Select…</option>
                              {['Whole Round','HOG (Head On Gutted)','Fillet','Steak','Portion','Butterfly','Tail','Other'].map(f => <option key={f}>{f}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className={labelCls}>Processing Type</label>
                            <select value={p.processing} onChange={e => updateProduct(p.id,'processing',e.target.value)} className={inputCls}>
                              <option value="">Select…</option>
                              {['Fresh / Chilled','IQF Frozen','Block Frozen','Cooked Frozen','Smoked','Breaded','Marinated','Super Frozen','Canned','Dried / Salted'].map(t => <option key={t}>{t}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className={labelCls}>Origin</label>
                            <select value={p.origin} onChange={e => updateProduct(p.id,'origin',e.target.value)} className={inputCls}>
                              <option value="">Select…</option>
                              {['Wild Catch','Farmed / Aquaculture','Mixed'].map(o => <option key={o}>{o}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className={labelCls}>Catch / FAO Zone</label>
                            <select value={p.faoZone} onChange={e => updateProduct(p.id,'faoZone',e.target.value)} className={inputCls}>
                              <option value="">Select…</option>
                              {FAO_ZONES.map(z => <option key={z}>{z}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className={labelCls}>Sizes / Grades</label>
                            <input value={p.sizes} onChange={e => updateProduct(p.id,'sizes',e.target.value)} placeholder="e.g. 3-5kg, 5-7kg" className={inputCls} />
                          </div>
                          <div>
                            <label className={labelCls}>Packaging Types</label>
                            <input value={p.packaging} onChange={e => updateProduct(p.id,'packaging',e.target.value)} placeholder="e.g. Vacuum, Master Carton 20kg" className={inputCls} />
                          </div>
                          <div>
                            <label className={labelCls}>Net Weight Options</label>
                            <input value={p.netWeight} onChange={e => updateProduct(p.id,'netWeight',e.target.value)} placeholder="e.g. 500g, 1kg, 5kg" className={inputCls} />
                          </div>
                          <div>
                            <label className={labelCls}>Glazing %</label>
                            <input value={p.glazing} onChange={e => updateProduct(p.id,'glazing',e.target.value)} placeholder="e.g. 10%, 20%, None" className={inputCls} />
                          </div>
                          <div>
                            <label className={labelCls}>Shelf Life</label>
                            <input value={p.shelfLife} onChange={e => updateProduct(p.id,'shelfLife',e.target.value)} placeholder="e.g. 24 months frozen" className={inputCls} />
                          </div>
                          <div>
                            <label className={labelCls}>Storage Temperature</label>
                            <input value={p.storageTemp} onChange={e => updateProduct(p.id,'storageTemp',e.target.value)} placeholder="e.g. −18°C" className={inputCls} />
                          </div>
                          <div>
                            <label className={labelCls}>HS Code</label>
                            <input value={p.hsCode} onChange={e => updateProduct(p.id,'hsCode',e.target.value)} placeholder="e.g. 0302.12" className={inputCls} />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                          <FileUpload label="Product Photos" field={`product_photo_${p.id}`} uploads={uploads} onUpload={handleUpload} accept="JPG/PNG" />
                          <FileUpload label="Spec Sheet (PDF)" field={`product_spec_${p.id}`} uploads={uploads} onUpload={handleUpload} />
                          <FileUpload label="Video (optional)" field={`product_video_${p.id}`} uploads={uploads} onUpload={handleUpload} accept="MP4" />
                        </div>
                      </div>
                    ))}
                    <button onClick={addProduct}
                      className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-ocean-300 rounded-2xl text-sm font-semibold text-ocean-600 hover:bg-ocean-50 transition-colors">
                      <Plus className="w-4 h-4" />Add Another Product
                    </button>
                  </div>
                </div>
              )}

              {/* ── SECTION 4: Certifications ── */}
              {step === 4 && (
                <div>
                  <SectionHeader icon={Award} title="Quality Assurance & Certifications" desc="Upload all food safety and quality certifications. These build maximum buyer confidence." color="amber" />
                  <div className="space-y-5">
                    {certs.map((c, idx) => (
                      <div key={c.id} className="border border-slate-200 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-4">
                          <p className="font-semibold text-slate-800 text-sm">Certification #{idx + 1}</p>
                          {certs.length > 1 && (
                            <button onClick={() => removeCert(c.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className={labelCls}>Certification Type <span className="text-red-500">*</span></label>
                            <select value={c.type} onChange={e => updateCert(c.id,'type',e.target.value)} className={inputCls}>
                              <option value="">Select…</option>
                              {CERTIFICATIONS_LIST.map(t => <option key={t}>{t}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className={labelCls}>Issuing Authority</label>
                            <input value={c.authority} onChange={e => updateCert(c.id,'authority',e.target.value)} placeholder="e.g. Bureau Veritas" className={inputCls} />
                          </div>
                          <div>
                            <label className={labelCls}>Certificate Number</label>
                            <input value={c.certNumber} onChange={e => updateCert(c.id,'certNumber',e.target.value)} placeholder="Cert. reference number" className={inputCls} />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className={labelCls}>Issue Date</label>
                              <input type="date" value={c.issueDate} onChange={e => updateCert(c.id,'issueDate',e.target.value)} className={inputCls} />
                            </div>
                            <div>
                              <label className={labelCls}>Expiry Date</label>
                              <input type="date" value={c.expiryDate} onChange={e => updateCert(c.id,'expiryDate',e.target.value)} className={inputCls} />
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <FileUpload label="Certificate File (PDF)" field={`cert_file_${c.id}`} uploads={uploads} onUpload={handleUpload} />
                        </div>
                      </div>
                    ))}
                    <button onClick={addCert}
                      className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-amber-300 rounded-2xl text-sm font-semibold text-amber-600 hover:bg-amber-50 transition-colors">
                      <Plus className="w-4 h-4" />Add Another Certification
                    </button>
                  </div>
                </div>
              )}

              {/* ── SECTION 5: Batch Testing ── */}
              {step === 5 && (
                <div>
                  <SectionHeader icon={FlaskConical} title="Batch-Level Inspection & Testing" desc="Demonstrate your commitment to verified product quality at the production batch level." color="violet" />
                  <div className="space-y-5">
                    <div>
                      <label className={labelCls}>Do you provide SGS or equivalent third-party inspection per batch? <span className="text-red-500">*</span></label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Yes — every batch','Yes — upon buyer request','No — we rely on internal QC','Planning to implement'].map(opt => (
                          <label key={opt} className={cn('flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all',
                            s5.batchInspection === opt ? 'bg-ocean-50 border-ocean-400' : 'border-slate-200 hover:border-slate-300')}>
                            <input type="radio" className="hidden" checked={s5.batchInspection === opt} onChange={() => setS5(v => ({ ...v, batchInspection: opt }))} />
                            <div className={cn('w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                              s5.batchInspection === opt ? 'border-ocean-600 bg-ocean-600' : 'border-slate-300')}>
                              {s5.batchInspection === opt && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                            </div>
                            <span className="text-xs font-medium text-slate-700">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    {s5.batchInspection?.startsWith('Yes') && (
                      <>
                        <div>
                          <label className={labelCls}>Inspection Company Name</label>
                          <input value={s5.inspectionCompany} onChange={e => setS5(v => ({ ...v, inspectionCompany: e.target.value }))} placeholder="e.g. SGS, Bureau Veritas, Intertek" className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Types of Tests Performed</label>
                          <CheckboxGrid options={TEST_TYPES} selected={s5.testTypes} onChange={v => setS5(x => ({ ...x, testTypes: v }))} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FileUpload label="Sample Certificate of Analysis (COA)" field="coaSample" uploads={uploads} onUpload={handleUpload} />
                          <FileUpload label="Batch Traceability Report Sample" field="traceabilityReport" uploads={uploads} onUpload={handleUpload} />
                        </div>
                        <div>
                          <label className={labelCls}>Digital Verification Link (e.g. QR system URL)</label>
                          <input placeholder="https://verify.sgs.com/..." className={inputCls} />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* ── SECTION 6: Traceability ── */}
              {step === 6 && (
                <div>
                  <SectionHeader icon={Search} title="Traceability & Transparency" desc="Show buyers exactly where your product comes from, from ocean to processing plant." />
                  <div className="space-y-5">
                    <div>
                      <label className={labelCls}>Full Traceability System in Place? <span className="text-red-500">*</span></label>
                      <div className="flex gap-3">
                        {['Yes — full end-to-end','Partial','No — in development'].map(opt => (
                          <label key={opt} className={cn('flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition-all text-sm',
                            s6.hasSystem === opt ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-semibold' : 'border-slate-200 hover:border-slate-300')}>
                            <input type="radio" className="hidden" checked={s6.hasSystem === opt} onChange={() => setS6(v => ({ ...v, hasSystem: opt }))} />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Traceability Method</label>
                      <select value={s6.method} onChange={e => setS6(v => ({ ...v, method: e.target.value }))} className={inputCls}>
                        <option value="">Select method…</option>
                        {['Blockchain-based','ERP System (SAP/Oracle)','Dedicated Traceability Software','Manual Batch Records','Third-Party Platform','Other'].map(m => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Ability to Track By</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[['trackBatch','Batch Number'],['trackDate','Production Date'],['trackVessel','Vessel Name'],['trackFarm','Farm Code / ID']].map(([field, label]) => (
                          <label key={field} className={cn('flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all',
                            (s6 as any)[field] ? 'bg-emerald-50 border-emerald-400' : 'border-slate-200 hover:border-slate-300')}>
                            <div className={cn('w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0',
                              (s6 as any)[field] ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300')}>
                              {(s6 as any)[field] && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <input type="checkbox" className="hidden" checked={(s6 as any)[field]} onChange={() => setS6(v => ({ ...v, [field]: !(v as any)[field] }))} />
                            <span className="text-sm font-medium text-slate-700">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FileUpload label="Recall Procedure Documentation" field="recallProc" uploads={uploads} onUpload={handleUpload} />
                      <FileUpload label="Sustainability Policy" field="sustainPolicy" uploads={uploads} onUpload={handleUpload} />
                    </div>
                  </div>
                </div>
              )}

              {/* ── SECTION 7: Logistics ── */}
              {step === 7 && (
                <div>
                  <SectionHeader icon={Anchor} title="Logistics & Export Compliance" desc="Your export infrastructure, documentation capabilities, and shipping partners." color="emerald" />
                  <div className="space-y-5">
                    <div>
                      <label className={labelCls}>Nearest Export Port <span className="text-red-500">*</span></label>
                      <div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input value={s7.nearestPort} onChange={e => setS7(v => ({ ...v, nearestPort: e.target.value }))} placeholder="e.g. Port of Bergen, Norway" className={cn(inputCls,'pl-9')} /></div>
                    </div>
                    <div>
                      <label className={labelCls}>Available Incoterms <span className="text-red-500">*</span></label>
                      <CheckboxGrid options={INCOTERMS} selected={s7.incoterms} onChange={v => setS7(x => ({ ...x, incoterms: v }))} cols={4} />
                    </div>
                    <div>
                      <label className={labelCls}>Standard Documentation Provided</label>
                      <CheckboxGrid options={STANDARD_DOCS} selected={s7.standardDocs} onChange={v => setS7(x => ({ ...x, standardDocs: v }))} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FileUpload label="Export License" field="exportLicense" uploads={uploads} onUpload={handleUpload} />
                      <FileUpload label="Sample Health Certificate" field="healthCertTemplate" uploads={uploads} onUpload={handleUpload} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Preferred Freight Forwarders</label>
                        <input value={s7.freightForwarders} onChange={e => setS7(v => ({ ...v, freightForwarders: e.target.value }))} placeholder="e.g. Maersk, MSC, Kuehne+Nagel" className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Marine Insurance Coverage</label>
                        <input value={s7.insuranceCoverage} onChange={e => setS7(v => ({ ...v, insuranceCoverage: e.target.value }))} placeholder="e.g. All-risk cargo insurance" className={inputCls} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── SECTION 8: Commercial ── */}
              {step === 8 && (
                <div>
                  <SectionHeader icon={DollarSign} title="Commercial Terms" desc="Your standard payment terms, pricing structure, and contract flexibility." color="amber" />
                  <div className="space-y-5">
                    <div>
                      <label className={labelCls}>Accepted Payment Terms <span className="text-red-500">*</span></label>
                      <CheckboxGrid options={PAYMENT_TERMS} selected={s8.paymentTerms} onChange={v => setS8(x => ({ ...x, paymentTerms: v }))} cols={2} />
                    </div>
                    <div>
                      <label className={labelCls}>Supported Currencies <span className="text-red-500">*</span></label>
                      <CheckboxGrid options={CURRENCIES} selected={s8.currencies} onChange={v => setS8(x => ({ ...x, currencies: v }))} cols={4} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className={labelCls}>Discount Structure</label>
                        <input value={s8.discountStructure} onChange={e => setS8(v => ({ ...v, discountStructure: e.target.value }))} placeholder="e.g. 2% for orders >10MT" className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Volume-Based Pricing</label>
                        <select value={s8.volumePricing} onChange={e => setS8(v => ({ ...v, volumePricing: e.target.value }))} className={inputCls}>
                          <option value="">Select…</option>
                          <option>Yes</option><option>No</option><option>Negotiable</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Contract Flexibility</label>
                        <select value={s8.contractFlexibility} onChange={e => setS8(v => ({ ...v, contractFlexibility: e.target.value }))} className={inputCls}>
                          <option value="">Select…</option>
                          <option>Spot orders only</option>
                          <option>Short-term contracts</option>
                          <option>Annual contracts</option>
                          <option>Fully flexible</option>
                        </select>
                      </div>
                    </div>
                    <FileUpload label="Price List Upload (optional)" field="priceList" uploads={uploads} onUpload={handleUpload} />
                  </div>
                </div>
              )}

              {/* ── SECTION 9: Trust ── */}
              {step === 9 && (
                <div>
                  <SectionHeader icon={Shield} title="Platform Trust & Verification Layer" desc="Commit to the transparency standards that make SeaHub the most trusted seafood platform." color="violet" />
                  <div className="space-y-5">
                    <div className="space-y-3">
                      {[
                        { field: 'agreeAudit',   label: 'I agree to third-party facility audits arranged by SeaHub upon buyer request', required: true },
                        { field: 'agreeBatch',   label: 'I agree to random batch testing by an accredited laboratory at SeaHub\'s discretion', required: true },
                        { field: 'agreeEscrow',  label: 'I agree to platform escrow payment terms to protect both buyers and sellers', required: true },
                      ].map(item => (
                        <label key={item.field} className={cn('flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all',
                          (s9 as any)[item.field] ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-slate-300')}>
                          <div className={cn('w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                            (s9 as any)[item.field] ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300')}>
                            {(s9 as any)[item.field] && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <input type="checkbox" className="hidden" checked={(s9 as any)[item.field]} onChange={() => setS9(v => ({ ...v, [item.field]: !(v as any)[item.field] }))} />
                          <span className="text-sm text-slate-700 leading-relaxed">{item.label}{item.required && <span className="text-red-500 ml-0.5">*</span>}</span>
                        </label>
                      ))}
                    </div>
                    <div>
                      <label className={labelCls}>Digital Signature — Authorized Signatory Name <span className="text-red-500">*</span></label>
                      <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input value={s9.digitalSignature} onChange={e => setS9(v => ({ ...v, digitalSignature: e.target.value }))} placeholder="Full legal name of authorized representative" className={cn(inputCls,'pl-9')} /></div>
                    </div>
                    <FileUpload label="Official Company Stamp / Letterhead (PDF or JPG)" field="companyStamp" uploads={uploads} onUpload={handleUpload} accept="PDF/JPG" />
                  </div>
                </div>
              )}

              {/* ── SECTION 10: Reputation ── */}
              {step === 10 && (
                <div>
                  <SectionHeader icon={Star} title="Reputation & Market Presence" desc="Showcase your track record, key clients, and industry recognition." color="amber" />
                  <div className="space-y-5">
                    <div>
                      <label className={labelCls}>Top 5 Existing Clients (Company names only)</label>
                      <div className="space-y-2">
                        {s10.clients.map((c, i) => (
                          <input key={i} value={c} onChange={e => { const nc = [...s10.clients]; nc[i] = e.target.value; setS10(v => ({ ...v, clients: nc })) }}
                            placeholder={`Client ${i + 1} — e.g. Walmart, Carrefour, Sysco`} className={inputCls} />
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Awards & Recognitions</label>
                        <textarea value={s10.awards} onChange={e => setS10(v => ({ ...v, awards: e.target.value }))} placeholder="List industry awards, year, awarding body" rows={3} className={cn(inputCls,'resize-none')} />
                      </div>
                      <div>
                        <label className={labelCls}>Trade Exhibition Participation</label>
                        <textarea value={s10.exhibitions} onChange={e => setS10(v => ({ ...v, exhibitions: e.target.value }))} placeholder="e.g. Seafood Expo Global 2024, China Fisheries 2023" rows={3} className={cn(inputCls,'resize-none')} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Media Mentions / Press Links</label>
                      <input value={s10.mediaLinks} onChange={e => setS10(v => ({ ...v, mediaLinks: e.target.value }))} placeholder="URLs to press coverage (comma separated)" className={inputCls} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FileUpload label="Trade References (PDF)" field="tradeRefs" uploads={uploads} onUpload={handleUpload} />
                      <FileUpload label="Export Countries List" field="exportCountries" uploads={uploads} onUpload={handleUpload} />
                    </div>
                  </div>
                </div>
              )}

              {/* ── SECTION 11: Ethics ── */}
              {step === 11 && (
                <div>
                  <SectionHeader icon={Leaf} title="Ethical & Sustainability Declarations" desc="Confirm your commitment to ethical sourcing, labor practices, and environmental responsibility." color="emerald" />
                  <div className="space-y-5">
                    <div className="space-y-3">
                      {[
                        { field: 'noForcedLabor',   label: 'We declare that no forced, bonded, or child labor is used in any part of our supply chain, in compliance with ILO standards.', required: true },
                        { field: 'sustainableDecl', label: 'We declare that our fishing / farming practices are sustainable and comply with applicable environmental regulations.', required: true },
                      ].map(item => (
                        <label key={item.field} className={cn('flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all',
                          (s11 as any)[item.field] ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-slate-300')}>
                          <div className={cn('w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                            (s11 as any)[item.field] ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300')}>
                            {(s11 as any)[item.field] && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <input type="checkbox" className="hidden" checked={(s11 as any)[item.field]} onChange={() => setS11(v => ({ ...v, [item.field]: !(v as any)[item.field] }))} />
                          <span className="text-sm text-slate-700 leading-relaxed">{item.label}<span className="text-red-500 ml-0.5">*</span></span>
                        </label>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FileUpload label="Environmental Policy (PDF)" field="envPolicy" uploads={uploads} onUpload={handleUpload} />
                      <FileUpload label="CSR Report (PDF)" field="csrReport" uploads={uploads} onUpload={handleUpload} />
                    </div>
                  </div>
                </div>
              )}

              {/* ── SECTION 12: Review & Submit ── */}
              {step === 12 && (
                <div>
                  <SectionHeader icon={CheckCircle} title="Review & Submit" desc="Final review of your producer profile before submission for verification." />
                  <div className="space-y-5">
                    {/* Completeness summary */}
                    <div className="p-5 bg-gradient-to-br from-ocean-50 to-emerald-50 rounded-2xl border border-ocean-100">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-slate-900">Profile Completeness</h3>
                        <span className="text-2xl font-bold text-ocean-600">{completionPct}%</span>
                      </div>
                      <div className="h-3 bg-white rounded-full overflow-hidden mb-3">
                        <div className="h-full bg-gradient-to-r from-ocean-500 to-emerald-500 rounded-full transition-all" style={{ width: `${completionPct}%` }} />
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {SECTIONS.slice(0, 11).map(s => (
                          <div key={s.num} className={cn('flex items-center gap-1.5 text-xs px-2 py-1.5 rounded-lg',
                            sectionComplete[s.num] ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-slate-500 border border-slate-200')}>
                            {sectionComplete[s.num] ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                            {s.short}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Key info summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      {[
                        ['Company', s1.legalName || '—'],
                        ['Country', s1.country || '—'],
                        ['Products', `${products.filter(p => p.species).length} listed`],
                        ['Certifications', `${certs.filter(c => c.type).length} added`],
                        ['Capacity', s2.capacityMonth ? `${s2.capacityMonth} MT/month` : '—'],
                        ['Export Port', s7.nearestPort || '—'],
                      ].map(([label, val]) => (
                        <div key={label} className="flex justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-500">{label}</span>
                          <span className="font-semibold text-slate-900">{val}</span>
                        </div>
                      ))}
                    </div>

                    {/* Final agreements */}
                    <div className="space-y-3">
                      {[
                        { field: 'agreeTerms',   label: 'I agree to SeaHub\'s Terms & Conditions and Producer Agreement', required: true },
                        { field: 'agreePrivacy', label: 'I accept the Privacy Policy and consent to data processing for verification purposes', required: true },
                      ].map(item => (
                        <label key={item.field} className={cn('flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all',
                          (s12 as any)[item.field] ? 'border-ocean-400 bg-ocean-50' : 'border-slate-200 hover:border-slate-300')}>
                          <div className={cn('w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                            (s12 as any)[item.field] ? 'bg-ocean-600 border-ocean-600' : 'border-slate-300')}>
                            {(s12 as any)[item.field] && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <input type="checkbox" className="hidden" checked={(s12 as any)[item.field]} onChange={() => setS12(v => ({ ...v, [item.field]: !(v as any)[item.field] }))} />
                          <span className="text-sm text-slate-700">{item.label}<span className="text-red-500 ml-0.5">*</span></span>
                        </label>
                      ))}
                    </div>

                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-700 flex gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold mb-0.5">Verification Process</p>
                        Our team will review your documents within <strong>3–5 business days</strong>.
                        Missing documents will be flagged and you can resubmit at any time.
                        Upon approval, your profile receives the <strong>Verified Producer</strong> badge.
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* ── Navigation ── */}
            <div className="flex items-center justify-between mt-4 gap-3">
              <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-colors">
                <ArrowLeft className="w-4 h-4" />Previous
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{step}</span><span className="text-slate-200">/</span><span>12</span>
              </div>

              {step < 12 ? (
                <button onClick={() => setStep(s => Math.min(12, s + 1))}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ocean-600 text-white text-sm font-semibold hover:bg-ocean-700 transition-colors">
                  Save & Continue<ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => { if (s12.agreeTerms && s12.agreePrivacy) setSubmitted(true) }}
                  disabled={!s12.agreeTerms || !s12.agreePrivacy}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-40 transition-colors">
                  <Shield className="w-4 h-4" />Submit for Verification
                </button>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
