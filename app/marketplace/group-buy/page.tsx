'use client'

import { useState } from 'react'
import {
  Users, CheckCircle, Clock, Ship, Truck, FileText, Shield,
  ArrowLeft, X, Bell, Package, Anchor, Warehouse, Plus, Minus,
  ThumbsUp, AlertCircle, Zap, MapPin, Globe2, ChevronRight,
  Navigation, TrendingUp, DollarSign, Calendar, Box
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, LabelList
} from 'recharts'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { PlatformCategoryBar } from '@/components/PlatformCategoryBar'

// Maps a group-buy species to platform category
const SPECIES_TO_CATEGORY: Record<string, string> = {
  'Atlantic Salmon':     'frozen-seafood',
  'Yellowfin Tuna':      'frozen-seafood',
  'Tilapia':             'frozen-seafood',
  'Shrimp':              'frozen-seafood',
  'Lobster':             'frozen-seafood',
  'Yellowtail / Hamachi':'frozen-seafood',
  'Hamachi':             'frozen-seafood',
  'Bluefin Tuna':        'fresh-seafood',
  'Sea Bass':            'fresh-seafood',
  'Halibut':             'fresh-seafood',
  'Cod':                 'fresh-seafood',
  'Mahi-Mahi':           'fresh-seafood',
  'Salmon Carpaccio':    'seafood-specials',
  'Caviar':              'seafood-specials',
  'Breaded Shrimp':      'frozen-value-added',
  'Seafood Mix':         'frozen-value-added',
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface Participant {
  id: string; company: string; flag: string
  quantity: number; confirmed: boolean; joinedAt: string
}
interface GroupBuy {
  id: string; species: string; product: string
  origin: string; originFlag: string; price: number
  targetQty: number; currentQty: number; containerType: string
  destinationCountry: string; destinationFlag: string
  deadline: string; status: 'forming' | 'target_reached' | 'confirmed' | 'in_transit' | 'delivered'
  participants: Participant[]; icon: string; color: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const INITIAL_GROUPS: GroupBuy[] = [
  {
    id: 'gb-001', species: 'Atlantic Salmon', product: 'Fillet IQF Skin-On 3-5kg',
    origin: 'Norway', originFlag: '🇳🇴', price: 5.85,
    targetQty: 20, currentQty: 14.5, containerType: '20FCL',
    destinationCountry: 'Germany', destinationFlag: '🇩🇪',
    deadline: '2026-03-25', status: 'forming', icon: '🐟', color: '#f97316',
    participants: [
      { id: 'p1', company: 'Munich Fresh GmbH',   flag: '🇩🇪', quantity: 5.0, confirmed: false, joinedAt: '2026-03-01' },
      { id: 'p2', company: 'Hamburg Seafood AG',  flag: '🇩🇪', quantity: 4.5, confirmed: false, joinedAt: '2026-03-02' },
      { id: 'p3', company: 'Berlin Fish Market',  flag: '🇩🇪', quantity: 3.0, confirmed: false, joinedAt: '2026-03-03' },
      { id: 'p4', company: 'Rhine Valley Foods',  flag: '🇩🇪', quantity: 2.0, confirmed: false, joinedAt: '2026-03-05' },
    ],
  },
  {
    id: 'gb-002', species: 'Shrimp', product: 'Vannamei HLSO 21/25 Block Frozen',
    origin: 'Ecuador', originFlag: '🇪🇨', price: 7.20,
    targetQty: 20, currentQty: 20, containerType: '20FCL',
    destinationCountry: 'UAE', destinationFlag: '🇦🇪',
    deadline: '2026-03-20', status: 'target_reached', icon: '🦐', color: '#f43f5e',
    participants: [
      { id: 'p5', company: 'Dubai Fresh Trading',   flag: '🇦🇪', quantity: 6.0, confirmed: true,  joinedAt: '2026-02-28' },
      { id: 'p6', company: 'Abu Dhabi Seafood LLC', flag: '🇦🇪', quantity: 5.5, confirmed: true,  joinedAt: '2026-03-01' },
      { id: 'p7', company: 'Sharjah Food Supplies', flag: '🇦🇪', quantity: 4.5, confirmed: false, joinedAt: '2026-03-03' },
      { id: 'p8', company: 'Al Ain Proteins',       flag: '🇦🇪', quantity: 4.0, confirmed: true,  joinedAt: '2026-03-04' },
    ],
  },
  {
    id: 'gb-003', species: 'Yellowfin Tuna', product: 'Loins Vacuum IQF',
    origin: 'Maldives', originFlag: '🇲🇻', price: 6.40,
    targetQty: 20, currentQty: 8.0, containerType: '20FCL',
    destinationCountry: 'Netherlands', destinationFlag: '🇳🇱',
    deadline: '2026-04-10', status: 'forming', icon: '🐠', color: '#0ea5e9',
    participants: [
      { id: 'p9',  company: 'Rotterdam Seafood BV', flag: '🇳🇱', quantity: 4.0, confirmed: false, joinedAt: '2026-03-05' },
      { id: 'p10', company: 'Amsterdam Fish Co.',   flag: '🇳🇱', quantity: 4.0, confirmed: false, joinedAt: '2026-03-06' },
    ],
  },
  {
    id: 'gb-004', species: 'Lobster', product: 'Cold Water Tails 4-5oz Raw IQF',
    origin: 'Canada', originFlag: '🇨🇦', price: 38.50,
    targetQty: 20, currentQty: 20, containerType: '20FCL',
    destinationCountry: 'Japan', destinationFlag: '🇯🇵',
    deadline: '2026-03-15', status: 'in_transit', icon: '🦞', color: '#dc2626',
    participants: [
      { id: 'p11', company: 'Tokyo Seafood Imports',  flag: '🇯🇵', quantity: 7.0, confirmed: true, joinedAt: '2026-02-20' },
      { id: 'p12', company: 'Osaka Premium Fish',     flag: '🇯🇵', quantity: 6.0, confirmed: true, joinedAt: '2026-02-21' },
      { id: 'p13', company: 'Kyushu Marine Trading',  flag: '🇯🇵', quantity: 4.0, confirmed: true, joinedAt: '2026-02-22' },
      { id: 'p14', company: 'Hokkaido Fresh Foods',   flag: '🇯🇵', quantity: 3.0, confirmed: true, joinedAt: '2026-02-23' },
    ],
  },
  {
    id: 'gb-005', species: 'Tilapia', product: 'Fillet Skinless IQF 3-5oz',
    origin: 'China', originFlag: '🇨🇳', price: 2.85,
    targetQty: 20, currentQty: 15.0, containerType: '20FCL',
    destinationCountry: 'Saudi Arabia', destinationFlag: '🇸🇦',
    deadline: '2026-04-05', status: 'forming', icon: '🐡', color: '#059669',
    participants: [
      { id: 'p15', company: 'Riyadh Food Dist.',      flag: '🇸🇦', quantity: 5.0, confirmed: false, joinedAt: '2026-03-02' },
      { id: 'p16', company: 'Jeddah Marine Imports',  flag: '🇸🇦', quantity: 5.0, confirmed: false, joinedAt: '2026-03-03' },
      { id: 'p17', company: 'Dammam Fresh Catch',     flag: '🇸🇦', quantity: 5.0, confirmed: false, joinedAt: '2026-03-04' },
    ],
  },
  {
    id: 'gb-006', species: 'Atlantic Salmon', product: 'Whole HOG Fresh Chilled',
    origin: 'Norway', originFlag: '🇳🇴', price: 4.95,
    targetQty: 20, currentQty: 20, containerType: '40FCL',
    destinationCountry: 'USA', destinationFlag: '🇺🇸',
    deadline: '2026-03-10', status: 'delivered', icon: '🐟', color: '#f97316',
    participants: [
      { id: 'p18', company: 'Boston Seafood Co.',    flag: '🇺🇸', quantity: 8.0, confirmed: true, joinedAt: '2026-02-15' },
      { id: 'p19', company: 'New York Fish Market',  flag: '🇺🇸', quantity: 7.0, confirmed: true, joinedAt: '2026-02-16' },
      { id: 'p20', company: 'Miami Fresh Imports',   flag: '🇺🇸', quantity: 5.0, confirmed: true, joinedAt: '2026-02-17' },
    ],
  },
]

// ─── Tracking Milestones ──────────────────────────────────────────────────────
function getMilestones(g: GroupBuy) {
  const done = (s: GroupBuy['status']) =>
    ['confirmed','in_transit','delivered'].includes(g.status) &&
    ['confirmed','in_transit','delivered'].indexOf(g.status) >=
    ['confirmed','in_transit','delivered'].indexOf(s)

  const destPort: Record<string, string> = {
    Japan: 'Port of Yokohama', UAE: 'Port of Jebel Ali', Germany: 'Port of Hamburg',
    Netherlands: 'Port of Rotterdam', 'Saudi Arabia': 'Port of Jeddah',
    USA: 'Port of Newark', Canada: 'Port of Halifax', default: 'Destination Port',
  }
  const port = destPort[g.destinationCountry] || destPort.default

  return [
    { step: 1,  icon: ThumbsUp,   color: '#059669', title: 'Order Approved',
      desc: `${g.participants.length} participants · ${g.currentQty} MT total order confirmed`,
      date: '2026-03-10', status: 'completed' as const },
    { step: 2,  icon: FileText,   color: '#0ea5e9', title: 'Export Documents Issued',
      desc: 'Health certificate, EUR.1, Certificate of Origin prepared by licensed exporter',
      date: '2026-03-12', status: 'completed' as const },
    { step: 3,  icon: Package,    color: '#f97316', title: 'Container Loaded & Sealed',
      desc: 'Container MSCU7834521 · Seal #482901 · SGS inspection passed · Temperature verified −18°C',
      date: '2026-03-14', status: 'completed' as const },
    { step: 4,  icon: Anchor,     color: '#6366f1', title: 'Vessel Departed Origin Port',
      desc: `MV Nordic Star — Voyage 2026-014 · Departed ${g.origin} Port on schedule`,
      date: '2026-03-15', status: 'completed' as const },
    { step: 5,  icon: Ship,       color: '#0ea5e9', title: 'In Transit — Ocean Freight',
      desc: `ETA ${g.destinationCountry}: Mar 28, 2026 · Approx. 13 days at sea · AIS tracking active`,
      date: g.status === 'in_transit' || g.status === 'delivered' ? '2026-03-15' : null,
      status: g.status === 'in_transit' ? 'active' as const : g.status === 'delivered' ? 'completed' as const : 'pending' as const },
    { step: 6,  icon: Anchor,     color: '#8b5cf6', title: `Arrived at Destination Port`,
      desc: `${port} — vessel docked · Port authority notified · Container offloaded`,
      date: g.status === 'delivered' ? '2026-03-28' : null,
      status: g.status === 'delivered' ? 'completed' as const : 'pending' as const },
    { step: 7,  icon: FileText,   color: '#f59e0b', title: 'Customs Inspection',
      desc: 'Import declaration filed · Food safety inspection · Temperature chain audit',
      date: g.status === 'delivered' ? '2026-03-29' : null,
      status: g.status === 'delivered' ? 'completed' as const : 'pending' as const },
    { step: 8,  icon: Shield,     color: '#059669', title: 'Customs Cleared',
      desc: 'All documents approved · Import duties paid · Customs release order issued',
      date: g.status === 'delivered' ? '2026-03-30' : null,
      status: g.status === 'delivered' ? 'completed' as const : 'pending' as const },
    { step: 9,  icon: Truck,      color: '#f97316', title: 'Dispatched to Cold Storage',
      desc: `Refrigerated trucks dispatched · Individual allocations separated per participant`,
      date: g.status === 'delivered' ? '2026-03-31' : null,
      status: g.status === 'delivered' ? 'completed' as const : 'pending' as const },
    { step: 10, icon: Warehouse,  color: '#059669', title: 'Arrived at Cold Storage — DELIVERED',
      desc: 'All deliveries confirmed · Temp log: −18.2°C · Chain of custody complete ✓',
      date: g.status === 'delivered' ? '2026-04-01' : null,
      status: g.status === 'delivered' ? 'completed' as const : 'pending' as const },
  ]
}

// ─── Status helpers ───────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  forming:        { label: 'Forming',        cls: 'bg-sky-50 text-sky-700 border-sky-200' },
  target_reached: { label: '🎯 Target Reached', cls: 'bg-emerald-50 text-emerald-700 border-emerald-300 animate-pulse' },
  confirmed:      { label: 'Confirmed',      cls: 'bg-violet-50 text-violet-700 border-violet-200' },
  in_transit:     { label: '🚢 In Transit',  cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  delivered:      { label: '✅ Delivered',   cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
}

// ─── Progress Arc (SVG) ───────────────────────────────────────────────────────
function ProgressArc({ pct, color, size = 140 }: { pct: number; color: string; size?: number }) {
  const r = 52; const cx = 70; const cy = 70
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - Math.min(pct, 100) / 100)
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={12} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={12}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
    </svg>
  )
}

// ─── Join Modal ───────────────────────────────────────────────────────────────
function JoinModal({ group, onClose, onJoin }: {
  group: GroupBuy
  onClose: () => void
  onJoin: (qty: number, company: string, address: string) => void
}) {
  const [step, setStep] = useState(1)
  const [qty, setQty] = useState(1.0)
  const [company, setCompany] = useState('')
  const [address, setAddress] = useState('')
  const [contact, setContact] = useState('')
  const [done, setDone] = useState(false)

  const remaining = group.targetQty - group.currentQty
  const cost = qty * group.price * 1000

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{group.icon}</span>
            <div>
              <p className="font-bold text-slate-900 text-sm">{group.product}</p>
              <p className="text-xs text-slate-500">{group.originFlag} {group.origin} → {group.destinationFlag} {group.destinationCountry}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <div className="p-6">
          {done ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-9 h-9 text-emerald-500" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">You&apos;ve Joined!</h3>
              <p className="text-sm text-slate-500 mb-2">
                <span className="font-semibold text-emerald-600">{qty} MT</span> added to the {group.destinationCountry} group.
              </p>
              <p className="text-xs text-slate-400 mb-5">
                You&apos;ll be notified when the 20 MT target is reached and when your order is confirmed.
              </p>
              <button onClick={onClose}
                className="px-6 py-2.5 bg-ocean-600 text-white rounded-xl text-sm font-semibold hover:bg-ocean-700 transition-colors">
                Back to Group Buys
              </button>
            </div>
          ) : (
            <>
              {/* Step indicator */}
              <div className="flex items-center gap-1 mb-6">
                {['Quantity', 'Delivery', 'Confirm'].map((s, i) => (
                  <div key={s} className="flex items-center gap-1 flex-1">
                    <div className={cn('flex-1 flex items-center justify-center py-1.5 rounded-lg text-xs font-semibold',
                      step === i + 1 ? 'bg-ocean-600 text-white' :
                      step > i + 1  ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400')}>
                      {step > i + 1 ? <CheckCircle className="w-3.5 h-3.5" /> : s}
                    </div>
                    {i < 2 && <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />}
                  </div>
                ))}
              </div>

              {/* Step 1: Quantity */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="p-4 bg-slate-50 rounded-xl text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-500">Container capacity remaining</span>
                      <span className="font-bold text-emerald-600">{remaining.toFixed(1)} MT available</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${(group.currentQty / group.targetQty) * 100}%` }} />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{group.currentQty} / {group.targetQty} MT committed</p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-3 block">
                      Your Quantity (MT) <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-3 justify-center">
                      <button onClick={() => setQty(q => Math.max(0.5, parseFloat((q - 0.5).toFixed(1))))}
                        className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                        <Minus className="w-4 h-4 text-slate-600" />
                      </button>
                      <div className="text-center">
                        <input type="number" value={qty} min={0.5} max={remaining} step={0.5}
                          onChange={e => setQty(Math.min(remaining, Math.max(0.5, Number(e.target.value))))}
                          className="w-24 text-center text-2xl font-bold text-slate-900 border-0 outline-none" />
                        <p className="text-xs text-slate-400">Metric Tons</p>
                      </div>
                      <button onClick={() => setQty(q => Math.min(remaining, parseFloat((q + 0.5).toFixed(1))))}
                        className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                        <Plus className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center text-xs">
                    <div className="p-3 bg-ocean-50 rounded-xl">
                      <p className="text-slate-500 mb-1">Price/kg</p>
                      <p className="font-bold text-ocean-700">${group.price}</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-xl">
                      <p className="text-slate-500 mb-1">Your Qty</p>
                      <p className="font-bold text-orange-600">{qty} MT</p>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-xl">
                      <p className="text-slate-500 mb-1">Est. Cost</p>
                      <p className="font-bold text-emerald-600">${(cost / 1000).toFixed(0)}K</p>
                    </div>
                  </div>

                  <button onClick={() => setStep(2)}
                    className="w-full py-3 bg-ocean-600 text-white rounded-xl font-semibold text-sm hover:bg-ocean-700 transition-colors">
                    Continue →
                  </button>
                </div>
              )}

              {/* Step 2: Delivery details */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Company Name <span className="text-red-500">*</span></label>
                    <input value={company} onChange={e => setCompany(e.target.value)}
                      placeholder="Your company name"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ocean-300" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Cold Storage Delivery Address <span className="text-red-500">*</span></label>
                    <textarea value={address} onChange={e => setAddress(e.target.value)}
                      placeholder="Full address including postal code and city"
                      rows={3}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ocean-300 resize-none" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Contact Name &amp; Phone</label>
                    <input value={contact} onChange={e => setContact(e.target.value)}
                      placeholder="e.g. John Smith · +49 30 1234567"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ocean-300" />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => setStep(1)}
                      className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                      ← Back
                    </button>
                    <button onClick={() => setStep(3)} disabled={!company || !address}
                      className="flex-1 py-2.5 bg-ocean-600 text-white rounded-xl font-semibold text-sm hover:bg-ocean-700 transition-colors disabled:opacity-40">
                      Continue →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review & confirm */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-800 text-sm">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    {[
                      ['Product', `${group.icon} ${group.product}`],
                      ['Origin', `${group.originFlag} ${group.origin}`],
                      ['Destination', `${group.destinationFlag} ${group.destinationCountry}`],
                      ['Your Quantity', `${qty} MT (${(qty * 1000).toLocaleString()} kg)`],
                      ['Price/kg', `$${group.price}`],
                      ['Estimated Cost', `$${cost.toLocaleString(undefined, { maximumFractionDigits: 0 })}`],
                      ['Delivery To', address],
                    ].map(([label, val]) => (
                      <div key={label} className="flex justify-between gap-3 py-1.5 border-b border-slate-50">
                        <span className="text-slate-500 flex-shrink-0">{label}</span>
                        <span className="font-medium text-slate-900 text-right text-xs">{val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-700">
                    <Bell className="w-3.5 h-3.5 inline mr-1.5" />
                    You&apos;ll receive an alert when the group reaches <strong>20 MT</strong> and your confirmation will be required within <strong>48 hours</strong>.
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button onClick={() => setStep(2)}
                      className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                      ← Back
                    </button>
                    <button onClick={() => { onJoin(qty, company, address); setDone(true) }}
                      className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-colors">
                      ✓ Join Group Buy
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Create Group Buy Modal ───────────────────────────────────────────────────
const GB_SPECIES = [
  { label: 'Atlantic Salmon', icon: '🐟' },
  { label: 'Yellowfin Tuna',  icon: '🐠' },
  { label: 'Tilapia',         icon: '🐡' },
  { label: 'Shrimp',          icon: '🦐' },
  { label: 'Lobster',         icon: '🦞' },
  { label: 'Yellowtail / Hamachi', icon: '🐡' },
  { label: 'Value Added Seafood',  icon: '⭐' },
]
const GB_ORIGINS = ['Norway', 'Chile', 'Ecuador', 'Canada', 'Maldives', 'China', 'Vietnam',
  'Indonesia', 'Thailand', 'India', 'Japan', 'Iceland', 'Spain', 'Scotland', 'Other']
const GB_DESTINATIONS = [
  { country: 'Germany',      flag: '🇩🇪' },
  { country: 'Netherlands',  flag: '🇳🇱' },
  { country: 'France',       flag: '🇫🇷' },
  { country: 'UAE',          flag: '🇦🇪' },
  { country: 'Saudi Arabia', flag: '🇸🇦' },
  { country: 'Japan',        flag: '🇯🇵' },
  { country: 'China',        flag: '🇨🇳' },
  { country: 'USA',          flag: '🇺🇸' },
  { country: 'UK',           flag: '🇬🇧' },
  { country: 'Israel',       flag: '🇮🇱' },
  { country: 'Other',        flag: '🌍' },
]

function CreateGroupBuyModal({ onClose, onSubmit }: {
  onClose: () => void
  onSubmit: (g: GroupBuy) => void
}) {
  const [form, setForm] = useState({
    species: '', product: '', origin: '', originFlag: '🌍',
    price: '', targetQty: '20',
    destinationCountry: '', destinationFlag: '🌍',
    deadline: '', yourQty: '', yourCompany: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = () => {
    if (!form.species || !form.origin || !form.destinationCountry || !form.price) return
    const dest = GB_DESTINATIONS.find(d => d.country === form.destinationCountry)
    const sp = GB_SPECIES.find(s => s.label === form.species)
    const newGroup: GroupBuy = {
      id: `gb-new-${Date.now()}`,
      species: form.species,
      product: form.product || `${form.species} — Custom`,
      origin: form.origin,
      originFlag: GB_ORIGINS.indexOf(form.origin) >= 0 ? '🌍' : '🌍',
      price: parseFloat(form.price) || 0,
      targetQty: parseInt(form.targetQty) || 20,
      currentQty: parseFloat(form.yourQty) || 0,
      containerType: '20FCL',
      destinationCountry: form.destinationCountry,
      destinationFlag: dest?.flag ?? '🌍',
      deadline: form.deadline || '2026-04-30',
      status: 'forming',
      icon: sp?.icon ?? '🐟',
      color: '#0ea5e9',
      participants: form.yourCompany ? [{
        id: `p-init-${Date.now()}`,
        company: form.yourCompany, flag: dest?.flag ?? '🌍',
        quantity: parseFloat(form.yourQty) || 0,
        confirmed: false,
        joinedAt: new Date().toISOString().slice(0, 10),
      }] : [],
    }
    onSubmit(newGroup)
    setSubmitted(true)
    setTimeout(() => onClose(), 1800)
  }

  const inputCls = 'w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ocean-300 bg-white'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-ocean-700 rounded-t-2xl p-5 flex-shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Create a Group Buy</h2>
              <p className="text-white/70 text-xs">Share a container · Save up to 40% on freight</p>
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <div className="w-16 h-16 bg-violet-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-9 h-9 text-violet-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Group Buy Created!</h3>
            <p className="text-sm text-slate-500 text-center">Your group is now visible to buyers shipping to {form.destinationCountry}.</p>
          </div>
        ) : (
          <>
            <div className="overflow-y-auto flex-1 p-5 space-y-4">
              {/* Species + Product */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Species / Category *</label>
                  <select value={form.species} onChange={e => set('species', e.target.value)} className={inputCls}>
                    <option value="">Select…</option>
                    {GB_SPECIES.map(s => <option key={s.label}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Product / Sub-type</label>
                  <input value={form.product} onChange={e => set('product', e.target.value)}
                    placeholder="e.g. Fillet IQF Skin-On" className={inputCls} />
                </div>
              </div>

              {/* Origin */}
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Origin Country *</label>
                <select value={form.origin} onChange={e => set('origin', e.target.value)} className={inputCls}>
                  <option value="">Select country…</option>
                  {GB_ORIGINS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>

              {/* Price + target qty */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Target Price ($/kg) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                    <input type="number" step="0.01" value={form.price} onChange={e => set('price', e.target.value)}
                      placeholder="0.00" className={cn(inputCls, 'pl-7')} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Container Target (MT)</label>
                  <select value={form.targetQty} onChange={e => set('targetQty', e.target.value)} className={inputCls}>
                    <option value="20">20 MT (1× 20FCL)</option>
                    <option value="40">40 MT (1× 40FCL)</option>
                  </select>
                </div>
              </div>

              {/* Destination */}
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Destination Country *</label>
                <div className="grid grid-cols-3 gap-2">
                  {GB_DESTINATIONS.map(d => (
                    <button key={d.country} type="button" onClick={() => setForm(f => ({ ...f, destinationCountry: d.country, destinationFlag: d.flag }))}
                      className={cn('flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all',
                        form.destinationCountry === d.country
                          ? 'bg-ocean-50 border-ocean-400 text-ocean-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300')}>
                      <span>{d.flag}</span>{d.country}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deadline */}
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Joining Deadline</label>
                <input type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} className={inputCls} />
              </div>

              {/* Your allocation */}
              <div className="p-4 bg-violet-50 rounded-xl border border-violet-100">
                <p className="text-xs font-bold text-violet-800 mb-3">Your Allocation (Optional)</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Your Company</label>
                    <input value={form.yourCompany} onChange={e => set('yourCompany', e.target.value)}
                      placeholder="Company name" className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Your Quantity (MT)</label>
                    <input type="number" step="0.5" value={form.yourQty} onChange={e => set('yourQty', e.target.value)}
                      placeholder="e.g. 5" className={inputCls} />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-slate-100 flex-shrink-0 flex gap-2">
              <Button variant="secondary" onClick={onClose}>Cancel</Button>
              <Button variant="primary" className="flex-1 bg-violet-600 hover:bg-violet-700" onClick={handleSubmit}
                disabled={!form.species || !form.origin || !form.destinationCountry || !form.price}>
                <Users className="w-4 h-4" />Create Group Buy
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function GroupBuyPage() {
  const t = useT()
  const [groups, setGroups] = useState<GroupBuy[]>(INITIAL_GROUPS)
  const [view, setView] = useState<'browse' | 'detail' | 'track'>('browse')
  const [selected, setSelected] = useState<GroupBuy | null>(null)
  const [joinOpen, setJoinOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [alertDismissed, setAlertDismissed] = useState<string[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filtered = groups.filter(g => {
    if (statusFilter !== 'all' && g.status !== statusFilter) return false
    if (categoryFilter !== 'all') {
      const gc = SPECIES_TO_CATEGORY[g.species] ?? 'frozen-seafood'
      if (gc !== categoryFilter) return false
    }
    return true
  })

  // Count per category
  const categoryCounts = Object.fromEntries(
    ['all','frozen-seafood','frozen-value-added','seafood-specials','fresh-seafood'].map(cat => [
      cat,
      cat === 'all' ? groups.length : groups.filter(g => (SPECIES_TO_CATEGORY[g.species] ?? 'frozen-seafood') === cat).length,
    ])
  )

  const openDetail = (g: GroupBuy) => { setSelected(g); setView('detail') }
  const openTrack  = (g: GroupBuy) => { setSelected(g); setView('track') }

  const handleJoin = (groupId: string, qty: number, company: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g
      const newQty = g.currentQty + qty
      const newParticipant: Participant = {
        id: `p-new-${Date.now()}`, company, flag: '🏢',
        quantity: qty, confirmed: false,
        joinedAt: new Date().toISOString().slice(0, 10),
      }
      return {
        ...g,
        currentQty: newQty,
        participants: [...g.participants, newParticipant],
        status: newQty >= g.targetQty ? 'target_reached' : g.status,
      }
    }))
    // refresh selected
    setSelected(prev => {
      if (!prev || prev.id !== groupId) return prev
      const updated = groups.find(g => g.id === groupId)
      return updated ? { ...updated, currentQty: updated.currentQty + qty } : prev
    })
  }

  const confirmParticipant = (groupId: string, participantId: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g
      const updatedParticipants = g.participants.map(p =>
        p.id === participantId ? { ...p, confirmed: true } : p
      )
      const allConfirmed = updatedParticipants.every(p => p.confirmed)
      return { ...g, participants: updatedParticipants, status: allConfirmed ? 'confirmed' : g.status }
    }))
    setSelected(prev => {
      if (!prev || prev.id !== groupId) return prev
      const updated = groups.find(g => g.id === groupId)
      return updated || prev
    })
  }

  // Keep selected in sync with groups state
  const currentSelected = selected ? groups.find(g => g.id === selected.id) ?? selected : null

  // ── BROWSE VIEW ───────────────────────────────────────────────────────────
  if (view === 'browse') {
    const stats = {
      active: groups.filter(g => g.status === 'forming').length,
      forming: groups.reduce((s, g) => g.status === 'forming' ? s + g.currentQty : s, 0),
      participants: groups.reduce((s, g) => s + g.participants.length, 0),
      delivered: groups.filter(g => g.status === 'delivered').length,
    }

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ocean-600 to-ocean-900 p-6 sm:p-8">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-20 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/20 rounded-xl"><Users className="w-5 h-5 text-white" /></div>
              <span className="text-white/80 text-sm font-medium">Split a full container · Save 15-25% on freight</span>
            </div>
            <button onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold rounded-xl transition-all border border-white/20">
              <Plus className="w-4 h-4" />Create Group Buy
            </button>
          </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t('page.groupbuy.title')}</h1>
            <p className="text-ocean-100 text-sm sm:text-base max-w-xl leading-relaxed">
              Join buyers from your country to fill a shared container. Reach 20 MT together,
              unlock direct supplier pricing, and track your shipment door-to-door.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
              {[
                { icon: Package,   label: 'Active Groups',     val: stats.active },
                { icon: TrendingUp,label: 'MT Forming',        val: `${stats.forming.toFixed(0)} MT` },
                { icon: Users,     label: 'Participants',      val: stats.participants },
                { icon: CheckCircle, label: 'Delivered',       val: stats.delivered },
              ].map(s => (
                <div key={s.label} className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
                  <s.icon className="w-4 h-4 text-white/70 mx-auto mb-1" />
                  <p className="text-xl font-bold text-white">{s.val}</p>
                  <p className="text-xs text-white/60">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Bar */}
        <PlatformCategoryBar
          selected={categoryFilter}
          onSelect={setCategoryFilter}
          counts={categoryCounts}
        />

        {/* Status filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { val: 'all',           label: 'All Groups' },
            { val: 'forming',       label: `⏳ ${t('page.groupbuy.status.forming')}` },
            { val: 'target_reached',label: `🎯 ${t('page.groupbuy.status.targetReached')}` },
            { val: 'confirmed',     label: `✓ ${t('page.groupbuy.status.confirmed')}` },
            { val: 'in_transit',    label: `🚢 ${t('page.groupbuy.status.inTransit')}` },
            { val: 'delivered',     label: `✅ ${t('page.groupbuy.status.delivered')}` },
          ].map(f => (
            <button key={f.val} onClick={() => setStatusFilter(f.val)}
              className={cn('px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                statusFilter === f.val ? 'bg-ocean-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-ocean-300')}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Groups grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(g => {
            const pct = (g.currentQty / g.targetQty) * 100
            const cfg = STATUS_CONFIG[g.status]
            const remaining = g.targetQty - g.currentQty
            const isAlert = g.status === 'target_reached' && !alertDismissed.includes(g.id)

            return (
              <Card key={g.id} className="overflow-hidden" hover>
                {/* Alert stripe */}
                {isAlert && (
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white text-xs font-semibold">
                      <Zap className="w-3.5 h-3.5" />
                      🎯 20 MT reached! Confirm your order now
                    </div>
                    <button onClick={() => setAlertDismissed(d => [...d, g.id])} className="text-white/70 hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{g.icon}</span>
                      <div>
                        <p className="font-bold text-slate-900 text-sm leading-tight">{g.product}</p>
                        <p className="text-xs text-slate-500">{g.species}</p>
                      </div>
                    </div>
                    <span className={cn('text-xs font-semibold px-2 py-1 rounded-full border', cfg.cls)}>
                      {g.status === 'forming' ? t('page.groupbuy.status.forming') :
                       g.status === 'target_reached' ? t('page.groupbuy.status.targetReached') :
                       g.status === 'confirmed' ? t('page.groupbuy.status.confirmed') :
                       g.status === 'in_transit' ? t('page.groupbuy.status.inTransit') :
                       t('page.groupbuy.status.delivered')}
                    </span>
                  </div>

                  {/* Route */}
                  <div className="flex items-center gap-2 text-sm mb-3">
                    <span>{g.originFlag}</span>
                    <span className="text-slate-600 font-medium">{g.origin}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    <span>{g.destinationFlag}</span>
                    <span className="text-slate-600 font-medium">{g.destinationCountry}</span>
                    <span className="ml-auto text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">{g.containerType}</span>
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-700">{g.currentQty} MT committed</span>
                      <span className="text-slate-400">Target: {g.targetQty} MT</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: g.color }}
                      />
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span style={{ color: g.color }} className="font-bold">{pct.toFixed(0)}% filled</span>
                      {g.status === 'forming' && (
                        <span className="text-slate-400">{remaining.toFixed(1)} MT remaining</span>
                      )}
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
                    <div className="bg-slate-50 rounded-lg p-2">
                      <Users className="w-3.5 h-3.5 text-slate-400 mx-auto mb-0.5" />
                      <p className="font-bold text-slate-800">{g.participants.length}</p>
                      <p className="text-slate-400">Buyers</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400 mx-auto mb-0.5" />
                      <p className="font-bold text-slate-800">${g.price}</p>
                      <p className="text-slate-400">per kg</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 mx-auto mb-0.5" />
                      <p className="font-bold text-slate-800">{g.deadline.slice(5)}</p>
                      <p className="text-slate-400">{t('page.groupbuy.deadline')}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button onClick={() => openDetail(g)}
                      className="flex-1 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                      {t('page.groupbuy.viewDetails')}
                    </button>
                    {g.status === 'forming' ? (
                      <button onClick={() => { setSelected(g); setJoinOpen(true) }}
                        className="flex-1 py-2 rounded-xl text-sm font-semibold text-white transition-colors"
                        style={{ backgroundColor: g.color }}>
                        + {t('page.groupbuy.join')}
                      </button>
                    ) : g.status === 'target_reached' ? (
                      <button onClick={() => openDetail(g)}
                        className="flex-1 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors">
                        Confirm Order
                      </button>
                    ) : (g.status === 'in_transit' || g.status === 'delivered') ? (
                      <button onClick={() => openTrack(g)}
                        className="flex-1 py-2 bg-ocean-600 text-white rounded-xl text-sm font-semibold hover:bg-ocean-700 transition-colors flex items-center justify-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5" />Track
                      </button>
                    ) : (
                      <button onClick={() => openDetail(g)}
                        className="flex-1 py-2 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors">
                        View Order
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Create Group Buy Modal */}
        {showCreateModal && (
          <CreateGroupBuyModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={(newGroup) => {
              setGroups(prev => [newGroup, ...prev])
              setShowCreateModal(false)
            }}
          />
        )}
      </div>
    )
  }

  // ── DETAIL VIEW ───────────────────────────────────────────────────────────
  if (view === 'detail' && currentSelected) {
    const g = currentSelected
    const pct = (g.currentQty / g.targetQty) * 100
    const cfg = STATUS_CONFIG[g.status]
    const chartData = g.participants.map(p => ({ company: p.company.split(' ').slice(0, 2).join(' '), qty: p.quantity, confirmed: p.confirmed }))
    const confirmedCount = g.participants.filter(p => p.confirmed).length

    return (
      <div className="space-y-6">
        {/* Back + header */}
        <div className="flex items-center gap-3">
          <button onClick={() => setView('browse')}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Groups
          </button>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <span className="text-sm font-medium text-slate-700">{g.product}</span>
        </div>

        {/* 20MT Alert Banner */}
        {g.status === 'target_reached' && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-700 p-5 flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-lg mb-1">🎯 20 MT Target Reached!</h3>
              <p className="text-emerald-100 text-sm">
                All <strong>{g.participants.length} participants</strong> must confirm their orders within <strong>48 hours</strong>.
                {confirmedCount}/{g.participants.length} confirmed so far.
              </p>
            </div>
            <Bell className="w-5 h-5 text-white/70 flex-shrink-0 mt-1" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Progress + Chart */}
          <div className="lg:col-span-2 space-y-6">

            {/* Progress card */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-2xl">{g.icon}</span>Quantity Progress
                </h2>
                <span className={cn('text-xs font-semibold px-2 py-1 rounded-full border', cfg.cls)}>
                  {g.status === 'forming' ? t('page.groupbuy.status.forming') :
                   g.status === 'target_reached' ? t('page.groupbuy.status.targetReached') :
                   g.status === 'confirmed' ? t('page.groupbuy.status.confirmed') :
                   g.status === 'in_transit' ? t('page.groupbuy.status.inTransit') :
                   t('page.groupbuy.status.delivered')}
                </span>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative flex-shrink-0">
                  <ProgressArc pct={pct} color={g.color} size={140} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <p className="text-2xl font-bold text-slate-900">{g.currentQty}</p>
                    <p className="text-xs text-slate-400 font-medium">of {g.targetQty} MT</p>
                    <p className="text-sm font-bold mt-0.5" style={{ color: g.color }}>{pct.toFixed(0)}%</p>
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-500">Committed</span>
                      <span className="font-bold text-slate-900">{g.currentQty} MT</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: g.color }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-xs text-slate-400 mb-0.5">Target</p>
                      <p className="font-bold text-slate-900">{g.targetQty} MT</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-xs text-slate-400 mb-0.5">Remaining</p>
                      <p className="font-bold" style={{ color: g.color }}>{Math.max(0, g.targetQty - g.currentQty).toFixed(1)} MT</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-xs text-slate-400 mb-0.5">Participants</p>
                      <p className="font-bold text-slate-900">{g.participants.length} buyers</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-xs text-slate-400 mb-0.5">Deadline</p>
                      <p className="font-bold text-slate-900">{g.deadline}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Participants quantity chart */}
            <Card className="p-6">
              <h2 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-500" />
                Participants — Quantity Breakdown ({g.destinationCountry})
              </h2>
              <p className="text-xs text-slate-500 mb-4">All buyers committed to this container · same destination country</p>
              <ResponsiveContainer width="100%" height={Math.max(160, g.participants.length * 46)}>
                <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={v => `${v} MT`} />
                  <YAxis type="category" dataKey="company" tick={{ fontSize: 11 }} width={130} />
                  <Tooltip formatter={(v) => [`${v} MT`, 'Committed']} contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="qty" radius={[0, 6, 6, 0]}>
                    <LabelList dataKey="qty" position="right" formatter={(v: any) => `${v} MT`} style={{ fontSize: 11, fontWeight: 600 }} />
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={entry.confirmed ? '#059669' : g.color} fillOpacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />Confirmed</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: g.color }} />Pending</span>
              </div>
            </Card>

            {/* Participants table + confirm buttons */}
            <Card className="p-6">
              <h2 className="font-bold text-slate-900 mb-4">Order Confirmations</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-2 px-3 text-xs font-bold text-slate-500 uppercase">Company</th>
                      <th className="text-right py-2 px-3 text-xs font-bold text-slate-500 uppercase">Quantity</th>
                      <th className="text-right py-2 px-3 text-xs font-bold text-slate-500 uppercase">Est. Value</th>
                      <th className="text-center py-2 px-3 text-xs font-bold text-slate-500 uppercase">Joined</th>
                      <th className="text-center py-2 px-3 text-xs font-bold text-slate-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.participants.map(p => (
                      <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 font-medium text-slate-900 flex items-center gap-2">
                          <span>{p.flag}</span>{p.company}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-slate-900">{p.quantity} MT</td>
                        <td className="py-3 px-3 text-right text-slate-500">
                          ${(p.quantity * g.price * 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </td>
                        <td className="py-3 px-3 text-center text-xs text-slate-400">{p.joinedAt}</td>
                        <td className="py-3 px-3 text-center">
                          {p.confirmed ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                              <CheckCircle className="w-3 h-3" />Confirmed
                            </span>
                          ) : g.status === 'target_reached' ? (
                            <button onClick={() => confirmParticipant(g.id, p.id)}
                              className="text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 px-3 py-1 rounded-full transition-colors">
                              Confirm
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">Pending</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {/* Total row */}
                    <tr className="bg-slate-50 font-bold">
                      <td className="py-2.5 px-3 text-slate-700">Total</td>
                      <td className="py-2.5 px-3 text-right text-slate-900">{g.currentQty} MT</td>
                      <td className="py-2.5 px-3 text-right text-slate-900">
                        ${(g.currentQty * g.price * 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </td>
                      <td colSpan={2} className="py-2.5 px-3 text-center text-xs text-slate-500">
                        {confirmedCount}/{g.participants.length} confirmed
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Right: Info sidebar */}
          <div className="space-y-4">
            {/* Price card */}
            <Card className="p-5">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />Pricing
              </h3>
              <div className="space-y-2 text-sm">
                {[
                  ['Group Price/kg', `$${g.price}`, 'font-bold text-ocean-700 text-lg'],
                  ['Market Rate/kg', `$${(g.price * 1.18).toFixed(2)}`, 'text-slate-400 line-through'],
                  ['Your Saving', '~15-25%', 'font-bold text-emerald-600'],
                  ['Container Type', g.containerType, ''],
                  ['Incoterm', 'CIF', ''],
                  ['Payment Terms', '30% deposit / 70% BL', ''],
                ].map(([label, val, cls]) => (
                  <div key={label} className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-500">{label}</span>
                    <span className={cn('font-medium', cls || 'text-slate-900')}>{val}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Shipment details */}
            <Card className="p-5">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Ship className="w-4 h-4 text-ocean-600" />Shipment Info
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  ['Origin', `${g.originFlag} ${g.origin}`],
                  ['Destination', `${g.destinationFlag} ${g.destinationCountry}`],
                  ['Est. Transit', '14–21 days'],
                  ['Cold Chain', '−18°C maintained'],
                  ['Insurance', 'Marine insurance included'],
                  ['Supplier Cert', 'BRC · ASC · ISO 22000'],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-medium text-slate-900 text-right">{val}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Action buttons */}
            <div className="space-y-2">
              {g.status === 'forming' && (
                <button onClick={() => setJoinOpen(true)}
                  className="w-full py-3 rounded-xl font-bold text-white text-sm transition-colors"
                  style={{ backgroundColor: g.color }}>
                  + Join This Group Buy
                </button>
              )}
              {(g.status === 'in_transit' || g.status === 'delivered') && (
                <button onClick={() => setView('track')}
                  className="w-full py-3 bg-ocean-600 text-white rounded-xl font-bold text-sm hover:bg-ocean-700 transition-colors flex items-center justify-center gap-2">
                  <Navigation className="w-4 h-4" />Track Shipment
                </button>
              )}
              <button onClick={() => setView('browse')}
                className="w-full py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                ← Back to All Groups
              </button>
            </div>
          </div>
        </div>

        {/* Join modal */}
        {joinOpen && selected && (
          <JoinModal
            group={selected}
            onClose={() => setJoinOpen(false)}
            onJoin={(qty, company) => { handleJoin(selected.id, qty, company); setJoinOpen(false) }}
          />
        )}
      </div>
    )
  }

  // ── TRACKING VIEW ─────────────────────────────────────────────────────────
  if (view === 'track' && currentSelected) {
    const g = currentSelected
    const milestones = getMilestones(g)
    const activeStep = milestones.find(m => m.status === 'active') || milestones[milestones.length - 1]
    const completedCount = milestones.filter(m => m.status === 'completed').length

    return (
      <div className="space-y-6">
        {/* Back */}
        <div className="flex items-center gap-3">
          <button onClick={() => setView('detail')}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />Back to Details
          </button>
        </div>

        {/* Order header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/3 rounded-full blur-3xl" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{g.icon}</span>
              <div>
                <h2 className="text-lg font-bold text-white">{g.product}</h2>
                <p className="text-slate-400 text-sm">{g.originFlag} {g.origin} → {g.destinationFlag} {g.destinationCountry} · {g.containerType}</p>
                <p className="text-slate-400 text-xs mt-0.5">Order ID: {g.id.toUpperCase()} · {g.participants.length} participants · {g.currentQty} MT</p>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-2xl font-bold text-white">{completedCount}/{milestones.length}</p>
              <p className="text-slate-400 text-xs">Milestones completed</p>
              <div className="mt-2 h-1.5 w-32 bg-white/10 rounded-full overflow-hidden ml-auto">
                <div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${(completedCount / milestones.length) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Current status highlight */}
        {activeStep.status !== 'pending' && (
          <div className="p-4 bg-ocean-50 border border-ocean-200 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 bg-ocean-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <activeStep.icon className="w-5 h-5 text-ocean-600" />
            </div>
            <div>
              <p className="text-xs text-ocean-500 font-semibold uppercase tracking-wide">Current Status</p>
              <p className="font-bold text-ocean-900">{activeStep.title}</p>
              <p className="text-xs text-ocean-600">{activeStep.desc}</p>
            </div>
            {activeStep.status === 'active' && (
              <div className="ml-auto flex items-center gap-2 text-xs font-semibold text-ocean-700 bg-ocean-100 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-ocean-500 rounded-full animate-pulse" />In Progress
              </div>
            )}
          </div>
        )}

        {/* Timeline */}
        <Card className="p-6">
          <h2 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-ocean-600" />
            Shipment Tracking — Full Journey
          </h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-100" />

            <div className="space-y-0">
              {milestones.map((m, idx) => {
                const Icon = m.icon
                const isCompleted = m.status === 'completed'
                const isActive    = m.status === 'active'
                const isPending   = m.status === 'pending'

                return (
                  <div key={m.step} className="relative flex gap-4 pb-6 last:pb-0">
                    {/* Step circle */}
                    <div className={cn(
                      'relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all',
                      isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' :
                      isActive    ? 'bg-ocean-600 border-ocean-600 text-white' :
                                    'bg-white border-slate-200 text-slate-300'
                    )}>
                      {isCompleted
                        ? <CheckCircle className="w-5 h-5" />
                        : isActive
                          ? <Icon className="w-4 h-4" />
                          : <span className="text-xs font-bold">{m.step}</span>
                      }
                      {isActive && (
                        <span className="absolute inset-0 rounded-full bg-ocean-400 animate-ping opacity-30" />
                      )}
                    </div>

                    {/* Content */}
                    <div className={cn(
                      'flex-1 pb-2 pt-1.5',
                      isPending ? 'opacity-40' : ''
                    )}>
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <p className={cn('font-semibold text-sm',
                            isCompleted ? 'text-slate-900' : isActive ? 'text-ocean-700' : 'text-slate-400')}>
                            {m.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed max-w-lg">{m.desc}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          {m.date ? (
                            <span className={cn('text-xs font-semibold px-2 py-1 rounded-lg',
                              isCompleted ? 'bg-emerald-50 text-emerald-700' :
                              isActive    ? 'bg-ocean-50 text-ocean-700' : 'bg-slate-50 text-slate-400')}>
                              {m.date}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-300">Pending</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>

        {/* Participant allocation breakdown */}
        <Card className="p-6">
          <h2 className="font-bold text-slate-900 mb-4">Delivery Allocation per Participant</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {g.participants.map(p => (
              <div key={p.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{p.flag}</span>
                  <p className="font-semibold text-slate-800 text-sm leading-tight">{p.company}</p>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Quantity</span>
                    <span className="font-bold text-slate-900">{p.quantity} MT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Est. Value</span>
                    <span className="font-medium text-slate-700">${(p.quantity * g.price * 1000).toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-slate-500">Order Status</span>
                    <span className={cn('font-semibold px-2 py-0.5 rounded-full text-xs',
                      p.confirmed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-600')}>
                      {p.confirmed ? '✓ Confirmed' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    )
  }

  return null
}
