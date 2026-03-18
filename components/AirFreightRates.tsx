'use client'

import { useState } from 'react'
import { Plane, Thermometer, Clock, RefreshCw, ChevronDown, Star, AlertCircle, TrendingUp } from 'lucide-react'
import {
  AIR_FREIGHT_CARRIERS,
  FRESH_PREMIUM_AIR_ROUTES,
  type AirFreightRoute,
  type AirFreightCarrier,
} from '@/lib/data'

const CARRIER_COLORS: Record<string, string> = {
  lh: 'from-yellow-400 to-yellow-600',
  qr: 'from-rose-700 to-rose-900',
  ek: 'from-red-500 to-red-700',
  ba: 'from-blue-800 to-blue-950',
  cv: 'from-sky-600 to-sky-800',
}

const CARRIER_ACCENT: Record<string, string> = {
  lh: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  qr: 'text-rose-700 bg-rose-50 border-rose-200',
  ek: 'text-red-600 bg-red-50 border-red-200',
  ba: 'text-blue-800 bg-blue-50 border-blue-200',
  cv: 'text-sky-700 bg-sky-50 border-sky-200',
}

function CarrierBadge({ carrierId }: { carrierId: string }) {
  const c = AIR_FREIGHT_CARRIERS.find(c => c.id === carrierId)
  if (!c) return null
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${CARRIER_ACCENT[carrierId] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
      ✈ {c.iata}
    </span>
  )
}

function PriorityDot({ p }: { p: AirFreightCarrier['perishablesPriority'] }) {
  if (p === 'Ultra-Express') return <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1" title="Ultra-Express" />
  if (p === 'Express') return <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1" title="Express" />
  return <span className="inline-block w-2 h-2 rounded-full bg-gray-400 mr-1" title="Standard" />
}

export function AirFreightRates() {
  const [selectedRouteId, setSelectedRouteId] = useState<string>(FRESH_PREMIUM_AIR_ROUTES[0].id)
  const [sortBy, setSortBy] = useState<'rate' | 'transit'>('rate')
  const [showCarrierInfo, setShowCarrierInfo] = useState(false)

  const route = FRESH_PREMIUM_AIR_ROUTES.find(r => r.id === selectedRouteId) ?? FRESH_PREMIUM_AIR_ROUTES[0]

  const sortedCarriers = [...route.carriers].sort((a, b) =>
    sortBy === 'rate'
      ? (a.ratePerKg + a.coldChainFee) - (b.ratePerKg + b.coldChainFee)
      : a.transitHours - b.transitHours
  )

  const bestRate = Math.min(...route.carriers.map(c => c.ratePerKg + c.coldChainFee))
  const fastestTransit = Math.min(...route.carriers.map(c => c.transitHours))

  return (
    <div className="mt-8 rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50/60 to-blue-50/40 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-800 to-blue-900 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/20">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg leading-tight">Premium Air Freight</h3>
            <p className="text-sky-200 text-sm">Live carrier rates · Cold-chain certified routes</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-sky-200">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Updated: {route.lastUpdated}</span>
        </div>
      </div>

      {/* Alert banner */}
      <div className="flex items-center gap-2 px-6 py-3 bg-amber-50 border-b border-amber-100 text-amber-800 text-sm">
        <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
        <span>Rates shown are indicative USD/kg for fresh perishables with active cold-chain. Final rates depend on chargeable weight, routing date and customs handling. Contact carrier for confirmed quotation.</span>
      </div>

      <div className="p-6">
        {/* Route selector */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">Select Origin → Destination Route</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('rate')}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-colors ${sortBy === 'rate' ? 'bg-sky-700 text-white border-sky-700' : 'bg-white text-gray-600 border-gray-200 hover:border-sky-300'}`}
              >
                Sort: Best Rate
              </button>
              <button
                onClick={() => setSortBy('transit')}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-colors ${sortBy === 'transit' ? 'bg-sky-700 text-white border-sky-700' : 'bg-white text-gray-600 border-gray-200 hover:border-sky-300'}`}
              >
                Sort: Fastest
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {FRESH_PREMIUM_AIR_ROUTES.map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRouteId(r.id)}
                className={`text-left px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                  r.id === selectedRouteId
                    ? 'bg-sky-700 text-white border-sky-700 shadow-sm'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-sky-300 hover:bg-sky-50'
                }`}
              >
                <div className="font-bold mb-0.5">{r.originCode} → {r.destinationCode}</div>
                <div className={r.id === selectedRouteId ? 'text-sky-200' : 'text-gray-500'}>{r.destinationRegion}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Route headline */}
        <div className="flex flex-wrap items-center gap-4 mb-5 pb-5 border-b border-sky-100">
          <div>
            <div className="text-xl font-bold text-gray-900">{route.origin} ({route.originCode})</div>
            <div className="text-sm text-gray-500">{route.originCountry}</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-sky-400 text-2xl">✈ ─ ─ ─ ─ ─ ▶</div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-gray-900">{route.destination} ({route.destinationCode})</div>
            <div className="text-sm text-gray-500">{route.destinationRegion}</div>
          </div>
          <div className="w-full sm:w-auto flex gap-4 mt-2 sm:mt-0">
            <div className="text-center px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="text-xs text-emerald-600 font-medium">Best Rate</div>
              <div className="text-lg font-bold text-emerald-700">${bestRate.toFixed(2)}/kg</div>
            </div>
            <div className="text-center px-4 py-2 bg-blue-50 rounded-xl border border-blue-100">
              <div className="text-xs text-blue-600 font-medium">Fastest</div>
              <div className="text-lg font-bold text-blue-700">{fastestTransit}h</div>
            </div>
          </div>
        </div>

        {/* Carrier comparison table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 rounded-xl">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 rounded-l-xl">Carrier</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500">Rate/kg</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500">Cold Chain</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500">Total/kg</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500">Transit</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500">Freq/wk</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 rounded-r-xl">Min Kg</th>
              </tr>
            </thead>
            <tbody>
              {sortedCarriers.map((cr, i) => {
                const carrier = AIR_FREIGHT_CARRIERS.find(c => c.id === cr.carrierId)
                const total = cr.ratePerKg + cr.coldChainFee
                const isBestRate = total === bestRate
                const isFastest = cr.transitHours === fastestTransit
                return (
                  <tr
                    key={cr.carrierId}
                    className={`border-b border-gray-50 hover:bg-sky-50/50 transition-colors ${i === 0 && sortBy === 'rate' ? 'bg-emerald-50/40' : ''}`}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${CARRIER_COLORS[cr.carrierId] ?? 'from-gray-400 to-gray-600'} flex items-center justify-center shrink-0`}>
                          <Plane className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                            {carrier?.name}
                            {isBestRate && <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">BEST RATE</span>}
                            {isFastest && !isBestRate && <span className="text-[9px] font-bold px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full">FASTEST</span>}
                          </div>
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            <PriorityDot p={carrier?.perishablesPriority ?? 'Standard'} />
                            {carrier?.perishablesPriority} · {carrier?.headquarters}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="font-semibold text-gray-800">${cr.ratePerKg.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="text-orange-600 font-medium">+${cr.coldChainFee.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`font-bold text-base ${isBestRate ? 'text-emerald-700' : 'text-gray-900'}`}>
                        ${total.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span className={`font-semibold ${isFastest ? 'text-blue-700' : 'text-gray-700'}`}>{cr.transitHours}h</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="font-medium text-gray-700">{cr.weeklyFrequency}×</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="text-gray-600 text-xs">{cr.minChargeableKg} kg</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Notes row */}
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Thermometer className="w-3.5 h-3.5 text-sky-500" />
            All routes cold-chain certified (0–4°C for fresh / -20°C for frozen)
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            Rates include fuel surcharge. Ex. customs clearance &amp; documentation
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
            Prices updated daily · {route.lastUpdated}
          </div>
        </div>

        {/* Carrier info toggle */}
        <button
          onClick={() => setShowCarrierInfo(v => !v)}
          className="mt-5 flex items-center gap-1.5 text-sm font-medium text-sky-700 hover:text-sky-900 transition-colors"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${showCarrierInfo ? 'rotate-180' : ''}`} />
          {showCarrierInfo ? 'Hide' : 'Show'} Carrier Profiles
        </button>

        {showCarrierInfo && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-5 gap-3">
            {AIR_FREIGHT_CARRIERS.map(c => (
              <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-3.5 shadow-sm">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${CARRIER_COLORS[c.id] ?? 'from-gray-400 to-gray-600'} flex items-center justify-center mb-2.5`}>
                  <Plane className="w-5 h-5 text-white" />
                </div>
                <div className="font-bold text-gray-900 text-sm mb-0.5">{c.name}</div>
                <div className="text-xs text-gray-500 mb-2">{c.headquarters}</div>
                <div className="flex items-center gap-1 mb-2">
                  <PriorityDot p={c.perishablesPriority} />
                  <span className="text-xs text-gray-600">{c.perishablesPriority}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {c.hubAirports.map(h => (
                    <span key={h} className="px-1.5 py-0.5 bg-sky-50 text-sky-700 rounded text-[10px] font-semibold">{h}</span>
                  ))}
                </div>
                <div className="mt-2 flex flex-col gap-0.5">
                  {c.specialties.slice(0, 3).map(s => (
                    <span key={s} className="text-[10px] text-gray-500">• {s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
