'use client'

import { useState } from 'react'
import {
  Palette, Globe, CheckCircle, Download, Sparkles,
  ChevronRight, AlertCircle, RefreshCw, Eye, Plus,
  Shield, Brain, ArrowRight, Check, Globe2,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const COUNTRY_REQS: Record<string, {
  flag: string; lang: string; weightUnit: string; tempUnit: string
  dateFormat: string; regulatoryBody: string
  required: string[]; optional: string[]; certRequired: string[]
}> = {
  'United States': {
    flag:'🇺🇸', lang:'English', weightUnit:'lb / oz', tempUnit:'°F', dateFormat:'MM/DD/YYYY',
    regulatoryBody:'FDA (21 CFR 101)',
    required:['Product name','Net weight (lb/oz)','Allergen declaration','Nutrition Facts panel','Ingredient list','Country of origin','FDA establishment number','Keep frozen instructions','Sell-by / Use-by date'],
    optional:['UPC barcode','QR traceability code','Sustainability logo','MSC/ASC badge'],
    certRequired:['FDA Food Facility Registration','HACCP'],
  },
  'European Union': {
    flag:'🇪🇺', lang:'All 24 EU languages (min. 3)', weightUnit:'kg / g', tempUnit:'°C', dateFormat:'DD/MM/YYYY',
    regulatoryBody:'EU Reg. 1169/2011',
    required:['Product name (local language)','Net quantity (metric)','Ingredient list','Allergen highlighting (bold)','Country of origin','Best before date','Storage conditions','Producer address','EU health mark','Nutritional table (per 100g)','Catch area (wild fish)','Production method','FAO fishing area'],
    optional:['MSC/ASC ecolabel','Environmental score','QR code'],
    certRequired:['EU Establishment No.','HACCP','Country SPS'],
  },
  'Japan': {
    flag:'🇯🇵', lang:'Japanese (mandatory)', weightUnit:'g / kg', tempUnit:'°C', dateFormat:'YYYY年MM月DD日',
    regulatoryBody:'JAS / Food Labelling Standards',
    required:['Product name (Japanese)','Ingredients (Japanese)','Net weight','Expiry date (賞味期限)','Storage method (保存方法)','Country of origin (原産地)','Importer name and address','Allergens (7+21 items)','Nutritional info per 100g','JAN barcode'],
    optional:['QR traceability','Sashimi grade indicator','Super Frozen mark'],
    certRequired:['JAS certification','HACCP','Fumigation certificate'],
  },
  'United Kingdom': {
    flag:'🇬🇧', lang:'English', weightUnit:'g / kg', tempUnit:'°C', dateFormat:'DD/MM/YYYY',
    regulatoryBody:'FSA / UK FIR 2014',
    required:['Product name','Net quantity (metric)','Ingredient list','Allergen declaration (bold)','Country of origin','Best before / Use by date','Storage conditions','Business name and address','Nutritional declaration per 100g','UK establishment mark'],
    optional:['LEAF Marque','Red Tractor','MSC logo'],
    certRequired:['UK POAO Import Certificate','HACCP','BRC'],
  },
  'Canada': {
    flag:'🇨🇦', lang:'English + French (bilingual mandatory)', weightUnit:'g / kg + oz / lb', tempUnit:'°C', dateFormat:'YYYY-MM-DD',
    regulatoryBody:'CFIA / FDR',
    required:['Bilingual product name (EN/FR)','Net quantity','Ingredient list (bilingual)','Allergen declaration (bilingual)','Country of origin','Best before date','Storage instructions','Dealer name & address','Nutritional Facts table (bilingual)'],
    optional:['Ocean Wise logo','MSC badge','QR traceability'],
    certRequired:['CFIA Establishment License','HACCP','SFCR compliance'],
  },
  'Israel': {
    flag:'🇮🇱', lang:'Hebrew (mandatory)', weightUnit:'g / kg', tempUnit:'°C', dateFormat:'DD/MM/YYYY',
    regulatoryBody:'Ministry of Health / Standards Institute',
    required:['Product name (Hebrew mandatory)','Net weight','Ingredients (Hebrew)','Allergen info','Country of origin','Expiry date','Storage conditions','Importer name (Hebrew)','Kosher certification (if applicable)','Nutritional table'],
    optional:['Kosher supervising body logo','QR code'],
    certRequired:['Israeli import permit','SI Standards approval','HACCP'],
  },
  'UAE / Middle East': {
    flag:'🇦🇪', lang:'Arabic (mandatory) + English', weightUnit:'g / kg', tempUnit:'°C', dateFormat:'DD/MM/YYYY',
    regulatoryBody:'ESMA / SFDA (Saudi)',
    required:['Product name (Arabic + English)','Net weight (metric)','Ingredient list (Arabic)','Allergen declaration','Country of origin','Expiry/Best before date','Halal certification logo','Storage conditions','Importer details (Arabic)','Nutritional table per 100g'],
    optional:['QR traceability','GCC conformity mark'],
    certRequired:['Halal Certificate (mandatory)','HACCP','GCC import clearance'],
  },
  'China': {
    flag:'🇨🇳', lang:'Simplified Chinese (mandatory)', weightUnit:'g / kg', tempUnit:'°C', dateFormat:'YYYY年MM月DD日',
    regulatoryBody:'GACC / GB Standards',
    required:['Product name (Chinese mandatory)','Ingredient list (Chinese)','Net content','Production date','Shelf life','Storage conditions','Importer name & address (Chinese)','Country of origin','Allergen info','GACC registration number','Nutritional table (NRV %)'],
    optional:['QR code','Batch/lot code','Sustainability mark'],
    certRequired:['GACC Overseas Facility Registration','Chinese importer license','HACCP'],
  },
  'Australia': {
    flag:'🇦🇺', lang:'English', weightUnit:'g / kg', tempUnit:'°C', dateFormat:'DD/MM/YYYY',
    regulatoryBody:'FSANZ / DAFF',
    required:['Product name','Net quantity','Ingredient list','Allergen declaration (bold)','Country of origin (mandatory)','Best before / Use by date','Storage instructions','Manufacturer/Importer name & address','Nutrition Information Panel','Country of origin bar chart (CoOL)'],
    optional:['RSPCA Approved','MSC logo'],
    certRequired:['DAFF import permit','HACCP','AQIS clearance'],
  },
}

const PACK_STYLES = [
  { id:'retail-box',    label:'Retail Box',      icon:'📦', desc:'Folding carton for retail shelves' },
  { id:'master-carton', label:'Master Carton',   icon:'🗃️', desc:'Bulk export shipping carton' },
  { id:'retail-pouch',  label:'Retail Pouch',    icon:'🛍️', desc:'Vacuum pouch / stand-up pack' },
  { id:'label-only',    label:'Label / Sticker', icon:'🏷️', desc:'Label to apply on existing pack' },
  { id:'can-jar',       label:'Can / Jar',        icon:'🫙', desc:'Canned or jarred specialty' },
  { id:'tray-wrap',     label:'Tray + Film',      icon:'🍱', desc:'Fresh tray overwrapped with film' },
]

const DEMO_STEPS = [
  { label:'Enter product info',        icon:'📝', color:'bg-blue-600' },
  { label:'Select target country',     icon:'🌍', color:'bg-violet-600' },
  { label:'AI generates requirements', icon:'🤖', color:'bg-orange-500' },
  { label:'Preview mockup',            icon:'👁️', color:'bg-emerald-600' },
  { label:'Download files',            icon:'⬇️', color:'bg-blue-700' },
]

function PackagingMockup({ form, country, face }: {
  form: Record<string,string>; country: string; face: 'front'|'back'|'side'
}) {
  const req = COUNTRY_REQS[country]
  const isRTL = country === 'Israel' || country === 'UAE / Middle East'
  const isJapan = country === 'Japan'
  const isChina = country === 'China'
  const productName = form.productName || 'Atlantic Salmon Fillet'
  const weight = form.netWeight || '500g'
  const origin = form.origin || 'Norway'
  const brand = form.brand || 'SeaHub Premium'
  const localName = isJapan ? 'アトランティックサーモン' : isChina ? '大西洋鲑鱼片' : isRTL ? `${productName} — سمك السلمون` : productName

  if (face === 'back') {
    return (
      <div className="w-full max-w-xs mx-auto bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-lg">
        <div className="bg-[#0B1E3F] px-4 py-2 flex items-center justify-between">
          <span className="text-yellow-400 text-[10px] font-bold tracking-widest">{brand.toUpperCase()}</span>
          <span className="text-xs">{req?.flag}</span>
        </div>
        <div className="p-4 space-y-2 text-xs">
          <p className="font-bold text-slate-800 border-b border-slate-100 pb-1.5 text-[11px] uppercase tracking-wide">Back Label — {country}</p>
          <p className="font-semibold text-slate-600 text-[10px]">Regulatory: {req?.regulatoryBody}</p>
          {[
            { k:'Product', v:localName },
            { k:'Ingredients', v:`${form.species || 'Atlantic Salmon'} (100%)` },
            { k:'Allergens', v:`Contains: Fish` },
            { k:'Net Weight', v:`${weight} (${req?.weightUnit})` },
            { k:'Origin', v:origin },
            { k:'Storage', v:`Keep frozen at −18${req?.tempUnit ?? '°C'}` },
            { k:'Best Before', v:req?.dateFormat === 'MM/DD/YYYY' ? '12/31/2026' : req?.dateFormat === 'YYYY年MM月DD日' ? '2026年12月31日' : '31/12/2026' },
          ].map(row => (
            <div key={row.k} className={cn('flex justify-between border-b border-slate-50 py-0.5', isRTL && 'flex-row-reverse')}>
              <span className="text-slate-400">{row.k}</span>
              <span className="text-slate-700 font-medium text-right max-w-[55%]">{row.v}</span>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t border-slate-100">
            <p className="text-[10px] text-slate-500 text-center">Packed by: {brand} · Batch: SH-2026-042</p>
            <div className="flex items-center justify-center gap-2 mt-1.5">
              {req?.certRequired.slice(0,2).map(c => (
                <span key={c} className="text-[9px] px-1.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 rounded font-bold">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (face === 'side') {
    return (
      <div className="flex justify-center">
        <div className="w-20 rounded-xl overflow-hidden shadow-lg" style={{ background:'linear-gradient(180deg, #0B1E3F, #1a4a7a)', minHeight:300 }}>
          <div className="h-1.5 bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-600" />
          <div className="p-2 flex flex-col items-center gap-3 h-full">
            <span className="text-3xl mt-2">🐟</span>
            <p className="text-white/70 text-[8px] font-bold text-center">{weight}</p>
            <p className="text-yellow-400 text-[7px] font-bold tracking-widest text-center">{brand.slice(0,8).toUpperCase()}</p>
            <div className="mt-auto mb-2 flex flex-col items-center gap-1.5">
              {['MSC','ASC'].map(b => (
                <div key={b} className="w-10 h-10 rounded-full bg-white/10 border border-white/30 flex items-center justify-center">
                  <span className="text-white text-[8px] font-bold">{b}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-1.5 bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ background:'linear-gradient(135deg, #0B1E3F 0%, #1a4a7a 50%, #0B1E3F 100%)', minHeight:400 }}>
        <div className="absolute inset-x-0 bottom-0 h-32 opacity-20" style={{ background:'radial-gradient(ellipse at center bottom, #38bdf8 0%, transparent 70%)' }} />
        <div className="h-1.5 bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-600" />
        <div className="px-5 pt-4 pb-3 bg-white/10 backdrop-blur-sm border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-400 text-[10px] font-bold tracking-[0.3em] uppercase">{brand}</p>
              <p className="text-white/50 text-[9px]">{req?.regulatoryBody ?? 'Compliant'}</p>
            </div>
            <span className="text-2xl">🌊</span>
          </div>
        </div>
        <div className="flex items-center justify-center py-6">
          <div className="text-center">
            <span className="text-8xl drop-shadow-2xl">🐟</span>
            <div className="mt-2 text-white/60 text-xs">{origin}</div>
          </div>
        </div>
        <div className="px-5 pb-3">
          <h2 className={cn('text-white text-xl font-bold leading-tight', isRTL && 'text-right')}>{localName}</h2>
          {isRTL && <p className="text-white/70 text-sm text-right">{productName}</p>}
          <p className="text-blue-300 text-sm mt-1">{isJapan ? `原産地: ${origin}` : isChina ? `原产地: ${origin}` : `Origin: ${origin}`}</p>
        </div>
        <div className="mx-4 mb-4 rounded-xl bg-white/10 border border-white/20 px-4 py-3 space-y-1.5">
          {[
            { k:isJapan ? '内容量' : isChina ? '净重' : 'Net Weight', v:`${weight} (${req?.weightUnit})` },
            { k:isJapan ? '保存方法' : isChina ? '保存' : 'Keep', v:`Frozen −18${req?.tempUnit ?? '°C'}` },
          ].map(row => (
            <div key={row.k} className={cn('flex justify-between text-xs', isRTL && 'flex-row-reverse')}>
              <span className="text-white/60">{row.k}</span>
              <span className="text-white font-bold">{row.v}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 pb-4">
          {['MSC','ASC','HACCP'].map(b => (
            <div key={b} className="w-10 h-10 rounded-full bg-white/10 border border-white/30 flex items-center justify-center">
              <span className="text-white text-[9px] font-bold">{b}</span>
            </div>
          ))}
        </div>
        <div className="h-1.5 bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-600" />
      </div>
    </div>
  )
}

export default function AIPackagingDesigner() {
  const [demoStep, setDemoStep] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState('European Union')
  const [selectedStyle, setSelectedStyle] = useState('retail-box')
  const [downloadDone, setDownloadDone] = useState<string[]>([])
  const [activeLabel, setActiveLabel] = useState<'front'|'back'|'side'>('front')
  const [form, setForm] = useState({
    productName: 'Atlantic Salmon Fillet', brand: 'SeaHub Premium',
    netWeight: '500g', origin: 'Norway', species: 'Atlantic Salmon', processingType: 'IQF Frozen',
  })

  const req = COUNTRY_REQS[selectedCountry]

  const handleGenerate = () => {
    setIsGenerating(true); setDemoStep(3)
    setTimeout(() => { setIsGenerating(false); setGenerated(true) }, 2600)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-900 via-purple-900 to-blue-900 text-white p-8">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage:'radial-gradient(circle at 30% 60%, #a78bfa 0%, transparent 50%), radial-gradient(circle at 80% 30%, #60a5fa 0%, transparent 40%)' }} />
        <div className="relative flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-400 to-blue-600 flex items-center justify-center shadow-xl shrink-0">
            <Palette className="w-9 h-9 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-violet-500/30 border border-violet-400/40 rounded-full text-violet-200 text-xs font-bold">AI POWERED</span>
              <span className="px-2.5 py-0.5 bg-emerald-500/30 border border-emerald-400/40 rounded-full text-emerald-200 text-xs font-bold">LIVE DEMO</span>
            </div>
            <h2 className="text-3xl font-bold">AI Packaging Designer</h2>
            <p className="text-purple-200 mt-1">Country-compliant packaging mockups with print-ready files — generated in seconds</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['🌍 9+ Country Label Standards','📋 Auto Compliance Check','🖼️ JPG Preview + Print PDF','🏷️ 6 Packaging Formats','⚡ Generated in < 30 sec'].map(p => (
                <span key={p} className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm backdrop-blur-sm">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Steps bar */}
      <div className="flex items-center gap-0 bg-white border border-slate-200 rounded-2xl p-3 shadow-sm overflow-x-auto">
        {DEMO_STEPS.map((step, i) => (
          <div key={i} className="flex items-center shrink-0">
            <button onClick={() => setDemoStep(i)}
              className={cn('flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all',
                demoStep === i ? `${step.color} text-white shadow-md` : demoStep > i ? 'bg-emerald-100 text-emerald-700' : 'text-slate-400 hover:text-slate-600')}>
              <span>{demoStep > i ? '✓' : step.icon}</span>
              <span className="hidden md:inline">{step.label}</span>
            </button>
            {i < DEMO_STEPS.length - 1 && <ChevronRight className={cn('w-4 h-4 mx-1 shrink-0', demoStep > i ? 'text-emerald-500' : 'text-slate-300')} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Form */}
        <div className="lg:col-span-2 space-y-4">
          <Card className={cn('p-5 border-2 transition-all', demoStep === 0 ? 'border-blue-300 shadow-md' : 'border-slate-100')}>
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</span>
              Product Information
            </h3>
            <div className="space-y-3">
              {[
                { key:'productName', label:'Product Name', placeholder:'e.g. Atlantic Salmon Fillet IQF' },
                { key:'brand', label:'Brand Name', placeholder:'e.g. SeaHub Premium' },
                { key:'netWeight', label:'Net Weight', placeholder:'e.g. 500g' },
                { key:'origin', label:'Country of Origin', placeholder:'e.g. Norway' },
                { key:'processingType', label:'Processing Type', placeholder:'e.g. IQF Frozen' },
              ].map(field => (
                <div key={field.key}>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">{field.label}</label>
                  <input value={form[field.key as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    onClick={() => setDemoStep(0)}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                </div>
              ))}
              <button onClick={() => setDemoStep(1)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                Next: Select Country <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </Card>

          <Card className={cn('p-5 border-2 transition-all', demoStep === 1 ? 'border-violet-300 shadow-md' : 'border-slate-100')}>
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center font-bold">2</span>
              Target Country & Format
            </h3>
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Target Market</label>
              <select value={selectedCountry}
                onChange={e => { setSelectedCountry(e.target.value); setDemoStep(1); setGenerated(false) }}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-300">
                {Object.keys(COUNTRY_REQS).map(c => <option key={c} value={c}>{COUNTRY_REQS[c].flag} {c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-2 block">Packaging Style</label>
              <div className="grid grid-cols-2 gap-2">
                {PACK_STYLES.map(s => (
                  <button key={s.id} onClick={() => { setSelectedStyle(s.id); setGenerated(false) }}
                    className={cn('text-left p-2.5 rounded-xl border-2 text-xs transition-all',
                      selectedStyle === s.id ? 'border-violet-400 bg-violet-50' : 'border-slate-200 hover:border-slate-300')}>
                    <span className="text-lg">{s.icon}</span>
                    <p className="font-semibold text-slate-800 mt-1">{s.label}</p>
                    <p className="text-slate-400 text-[10px]">{s.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => setDemoStep(2)}
              className="w-full mt-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
              View Requirements <ArrowRight className="w-4 h-4" />
            </button>
          </Card>

          {demoStep >= 2 && req && (
            <Card className={cn('p-5 border-2 transition-all', demoStep === 2 ? 'border-orange-300 shadow-md' : 'border-slate-100')}>
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold">3</span>
                {req.flag} {selectedCountry} Requirements
              </h3>
              <div className="space-y-3">
                <div className="text-xs text-slate-500 grid grid-cols-2 gap-1.5">
                  <div><span className="font-semibold">Language:</span> {req.lang}</div>
                  <div><span className="font-semibold">Units:</span> {req.weightUnit}</div>
                  <div><span className="font-semibold">Date:</span> {req.dateFormat}</div>
                  <div><span className="font-semibold">Regulator:</span> {req.regulatoryBody}</div>
                </div>
                <div>
                  <p className="text-xs font-bold text-red-700 mb-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Mandatory Elements ({req.required.length})</p>
                  <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
                    {req.required.map(r => (
                      <div key={r} className="flex items-center gap-2 text-xs">
                        <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span className="text-slate-700">{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-700 mb-1.5">Required Certifications</p>
                  <div className="flex flex-wrap gap-1.5">
                    {req.certRequired.map(c => (
                      <span key={c} className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-semibold rounded-full">{c}</span>
                    ))}
                  </div>
                </div>
                <button onClick={handleGenerate} disabled={isGenerating}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                  {isGenerating ? <><RefreshCw className="w-4 h-4 animate-spin" /> AI Generating…</> : <><Sparkles className="w-4 h-4" /> Generate Packaging Design</>}
                </button>
              </div>
            </Card>
          )}
        </div>

        {/* Right: Preview */}
        <div className="lg:col-span-3 space-y-4">
          {!generated && !isGenerating && (
            <div className="h-80 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-violet-50 rounded-2xl border-2 border-dashed border-violet-200">
              <Palette className="w-14 h-14 text-violet-300 mb-4" />
              <p className="font-semibold text-slate-500 text-lg">Packaging mockup appears here</p>
              <p className="text-sm text-slate-400 mt-1">Fill in product info, select country, then generate</p>
              <button onClick={() => { setDemoStep(2); setTimeout(handleGenerate, 300) }}
                className="mt-5 px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Run Live Demo
              </button>
            </div>
          )}

          {isGenerating && (
            <Card className="flex flex-col items-center justify-center p-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-xl mb-4 animate-pulse">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <p className="font-bold text-slate-800 text-lg">AI Designing Your Packaging…</p>
              <div className="mt-6 space-y-2 w-full max-w-sm">
                {['Analyzing regulatory requirements…',`Localizing for ${selectedCountry}…`,'Applying brand elements & colors…','Generating print-ready artwork…'].map((s, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                    <RefreshCw className="w-3.5 h-3.5 text-violet-500 animate-spin" style={{ animationDelay:`${i*200}ms` }} />{s}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {generated && !isGenerating && (
            <div className="space-y-4">
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
                {(['front','back','side'] as const).map(l => (
                  <button key={l} onClick={() => setActiveLabel(l)}
                    className={cn('flex-1 py-2 rounded-lg text-xs font-semibold transition-all capitalize',
                      activeLabel === l ? 'bg-[#0B1E3F] text-white shadow' : 'text-slate-500 hover:text-slate-700')}>
                    {l} label
                  </button>
                ))}
              </div>

              <Card className="p-6 bg-gradient-to-br from-slate-50 to-violet-50/30">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-semibold text-slate-700">Customer Preview · {req?.flag} {selectedCountry}</span>
                  <span className="ml-auto text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-semibold">✓ Fully Compliant</span>
                </div>
                <PackagingMockup form={form} country={selectedCountry} face={activeLabel} />
                <p className="text-center text-xs text-slate-400 mt-3">JPG preview · AI-generated · Based on entered data</p>
              </Card>

              <Card className="p-5">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-600" /> Compliance Report — {req?.flag} {selectedCountry}</h3>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {['Language compliance','Weight unit format','Date format','Allergen declaration','Regulatory body mark','All mandatory fields'].map(c => (
                    <div key={c} className="flex items-center gap-2 text-xs">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="text-slate-700">{c}</span>
                    </div>
                  ))}
                </div>
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <p className="text-xs font-bold text-emerald-800">✅ Full compliance with {req?.regulatoryBody}</p>
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Download className="w-4 h-4 text-blue-600" /> Download Files</h3>
                <div className="space-y-3">
                  {[
                    { id:'jpg',  icon:'🖼️', title:'JPG Customer Preview',          desc:'High-quality 300dpi JPG · Share with buyer or sales team',                size:'2.4 MB',  color:'bg-blue-600 hover:bg-blue-700' },
                    { id:'pdf',  icon:'🖨️', title:'High-Res Print File (PDF)',      desc:'Print-ready PDF with bleeds · CMYK · 600dpi — send to printing house',  size:'18.7 MB', color:'bg-[#0B1E3F] hover:bg-[#162D5A]' },
                    { id:'ai',   icon:'📐', title:'Dieline / Vector Template (AI)', desc:'Structural dieline for print house — includes bleed & cut marks',        size:'450 KB',  color:'bg-violet-600 hover:bg-violet-700' },
                    { id:'cert', icon:'📋', title:'Compliance Certificate PDF',     desc:'Official label compliance report for customs submission',                size:'180 KB',  color:'bg-emerald-600 hover:bg-emerald-700' },
                  ].map(f => (
                    <div key={f.id} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-2xl">{f.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm">{f.title}</p>
                        <p className="text-xs text-slate-400">{f.desc} · {f.size}</p>
                      </div>
                      <button onClick={() => setDownloadDone(p => [...p, f.id])}
                        className={cn('shrink-0 flex items-center gap-1.5 px-3 py-2 text-white text-xs font-bold rounded-lg transition-all',
                          downloadDone.includes(f.id) ? 'bg-emerald-500' : f.color)}>
                        {downloadDone.includes(f.id) ? <><Check className="w-3.5 h-3.5" /> Done</> : <><Download className="w-3.5 h-3.5" /> Download</>}
                      </button>
                    </div>
                  ))}
                </div>
                {downloadDone.length >= 2 && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-center">
                    <p className="text-sm font-bold text-blue-900">🎉 Send the PDF + Dieline to your print producer!</p>
                    <p className="text-xs text-blue-700 mt-0.5">All specs, bleeds and color profiles are embedded.</p>
                  </div>
                )}
              </Card>

              <Card className="p-5">
                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><Globe2 className="w-4 h-4 text-violet-600" /> Add More Markets</h3>
                <p className="text-xs text-slate-500 mb-3">Same product — fully compliant label variant per market</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(COUNTRY_REQS).filter(([c]) => c !== selectedCountry).map(([country, info]) => (
                    <button key={country} onClick={() => { setSelectedCountry(country); setGenerated(false); setDemoStep(1) }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-violet-300 hover:bg-violet-50 rounded-full text-xs font-medium text-slate-700 transition-colors">
                      {info.flag} {country}
                    </button>
                  ))}
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-violet-100 text-violet-700 rounded-full text-xs font-semibold border border-violet-200">
                    <Plus className="w-3 h-3" /> 40 more
                  </button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* How it works */}
      <Card className="p-8 bg-gradient-to-br from-[#0B1E3F] to-[#1a3a6b] text-white">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">How the AI Packaging Designer Works</h2>
          <p className="text-blue-200 mt-2">From product brief to print-ready files in under 30 seconds</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[
            { step:'01', icon:'📝', title:'Enter Product Brief', desc:'Product name, weight, origin, certifications, brand guidelines' },
            { step:'02', icon:'🌍', title:'Select Target Country', desc:'AI instantly loads all mandatory regulatory requirements' },
            { step:'03', icon:'🤖', title:'AI Designs Label', desc:'Generates compliant, professional label in your brand style' },
            { step:'04', icon:'👁️', title:'Preview & Approve', desc:'Review front, back, side panels — edit any element live' },
            { step:'05', icon:'⬇️', title:'Download Print Files', desc:'JPG preview + high-res PDF + dieline + compliance cert' },
          ].map(s => (
            <div key={s.step} className="text-center">
              <div className="text-4xl mb-2">{s.icon}</div>
              <div className="text-yellow-400 text-xs font-bold tracking-widest mb-1">STEP {s.step}</div>
              <p className="font-bold text-white text-sm mb-1">{s.title}</p>
              <p className="text-blue-300 text-xs leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
          {[{ v:'50+', l:'Country standards' }, { v:'<30s', l:'Generation time' }, { v:'4 files', l:'Per design (JPG+PDF+AI+Cert)' }].map(s => (
            <div key={s.l} className="text-center">
              <p className="text-3xl font-bold text-yellow-400">{s.v}</p>
              <p className="text-blue-300 text-sm mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
