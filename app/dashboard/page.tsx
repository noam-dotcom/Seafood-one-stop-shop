'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Bell, Shield, Package, DollarSign, MessageSquare, Star, Globe2,
  Activity, CheckCircle, Clock, FileText, Heart, LogOut, ChevronRight,
  Edit, Camera, ShoppingCart, LayoutDashboard, Eye,
  GripVertical, Plus, Minus, ArrowRight
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  WIDGET_DEFS, WIDGET_CATEGORIES, DEFAULT_WIDGETS,
  STORAGE_KEY, type WidgetDef, type DashboardPrefs
} from '@/lib/widgetDefs'
import { useT } from '@/lib/i18n'

// ── Static data ───────────────────────────────────────────────────────

const USER_PROFILE = {
  name: 'David Chen',
  title: 'Global Sourcing Director',
  company: 'Pacific Trade Foods Inc.',
  country: '🇺🇸 United States',
  memberSince: 'January 2023',
  verificationLevel: 'Premium Verified',
  rating: 4.8,
  totalReviews: 156,
  responseTime: '< 1 hour',
}

const ACTIVITY_ITEMS = [
  { text: 'Ordered 25 MT Norwegian Salmon from Nordic Seas AS',      time: '2h ago',  icon: ShoppingCart,  color: 'text-ocean-600 bg-ocean-50'    },
  { text: 'Sent inquiry for Ecuador Shrimp 21/25 to Oceano Fresco',  time: '4h ago',  icon: MessageSquare, color: 'text-purple-600 bg-purple-50'  },
  { text: 'Price alert: Salmon rose above $5.90/kg threshold',       time: '6h ago',  icon: Bell,          color: 'text-amber-600 bg-amber-50'    },
  { text: 'Saved Bluefin Tuna Sashimi Grade listing',                time: '1d ago',  icon: Heart,         color: 'text-rose-600 bg-rose-50'      },
  { text: 'Bill of Lading uploaded for Order #SEA-2026-0841',        time: '2d ago',  icon: FileText,      color: 'text-emerald-600 bg-emerald-50' },
]

const RECENT_ORDERS = [
  { id: 'SEA-2026-0841', product: 'Atlantic Salmon Fillet', qty: '25 MT',  amount: '$146,250', status: 'In Transit', date: 'Mar 1, 2026'  },
  { id: 'SEA-2026-0799', product: 'Vannamei Shrimp HLSO',  qty: '50 MT',  amount: '$360,000', status: 'Delivered',  date: 'Feb 15, 2026' },
  { id: 'SEA-2026-0750', product: 'Icelandic Cod Loins',   qty: '10 MT',  amount: '$89,500',  status: 'Delivered',  date: 'Feb 1, 2026'  },
]

const SAVED_PRODUCTS = [
  { name: 'Bluefin Tuna Sashimi Grade', price: '$89.00/kg', supplier: 'Toyosu Premium',      icon: '🐠' },
  { name: 'Maine Lobster Live',          price: '$28.50/kg', supplier: 'Maine Coast Seafood', icon: '🦞' },
  { name: 'Snow Crab Clusters',          price: '$18.20/kg', supplier: 'Arctic Crab Co.',    icon: '🦀' },
]

const PRICE_ALERTS = [
  { species: '🐟 Salmon', condition: 'Below $5.50/kg',  status: 'Active',    triggered: false },
  { species: '🦐 Shrimp', condition: 'Above $8.00/kg',  status: 'Active',    triggered: false },
  { species: '🐠 Tuna',   condition: 'Below $11.00/kg', status: 'Triggered', triggered: true  },
]

const TABS = ['Overview', 'Orders', 'Saved', 'Alerts', 'Documents', 'Settings']

// ── Widget Picker Panel ──────────────────────────────────────────────

function WidgetPickerPanel({
  activeWidgetIds,
  onToggle,
  onReset,
}: {
  activeWidgetIds: Set<string>
  onToggle: (id: string) => void
  onReset: () => void
}) {
  const [activeCat, setActiveCat] = useState<string>('all')

  const filtered = activeCat === 'all'
    ? WIDGET_DEFS
    : WIDGET_DEFS.filter(w => w.category === activeCat)

  return (
    <div>
      {/* Category tabs */}
      <div className="flex gap-1.5 flex-wrap mb-5">
        <button
          onClick={() => setActiveCat('all')}
          className={cn(
            'text-xs font-semibold px-3 py-1.5 rounded-full transition-colors',
            activeCat === 'all' ? 'bg-ocean-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          )}
        >
          All ({WIDGET_DEFS.length})
        </button>
        {WIDGET_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            className={cn(
              'text-xs font-semibold px-3 py-1.5 rounded-full transition-colors',
              activeCat === cat.id ? 'bg-ocean-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            )}
          >
            {cat.icon} {cat.label} ({WIDGET_DEFS.filter(w => w.category === cat.id).length})
          </button>
        ))}
      </div>

      {/* Widget grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((widget: WidgetDef) => {
          const isActive = activeWidgetIds.has(widget.id)
          return (
            <button
              key={widget.id}
              onClick={() => onToggle(widget.id)}
              className={cn(
                'flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all group',
                isActive
                  ? 'bg-ocean-50 border-ocean-300 hover:border-ocean-400'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white'
              )}
            >
              <span className="text-2xl flex-shrink-0">{widget.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-semibold leading-tight', isActive ? 'text-ocean-800' : 'text-slate-700')}>
                  {widget.label}
                </p>
                <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{widget.description}</p>
              </div>
              <div className={cn(
                'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors',
                isActive ? 'bg-ocean-500 text-white' : 'bg-slate-200 text-slate-400 group-hover:bg-slate-300'
              )}>
                {isActive ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              </div>
            </button>
          )
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
        <p className="text-sm text-slate-500">
          <span className="font-bold text-slate-800">{activeWidgetIds.size}</span> widget{activeWidgetIds.size !== 1 ? 's' : ''} on your homepage
        </p>
        <div className="flex gap-3">
          <button onClick={onReset} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
            Reset to defaults
          </button>
          <Link href="/?edit=1">
            <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors">
              Reorder on homepage <ArrowRight className="w-3 h-3" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

// ── Main Dashboard Page ──────────────────────────────────────────────

export default function DashboardPage() {
  const [activeTab, setActiveTab]         = useState('Overview')
  const [pickerOpen, setPickerOpen]       = useState(false)
  const [activeWidgetIds, setActiveWidgetIds] = useState<Set<string>>(new Set(DEFAULT_WIDGETS))
  const [widgetOrder, setWidgetOrder]     = useState<string[]>([...DEFAULT_WIDGETS])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const prefs: DashboardPrefs = JSON.parse(raw)
        const hidden = new Set(prefs.hidden || [])
        const order  = prefs.order || DEFAULT_WIDGETS
        setWidgetOrder(order)
        setActiveWidgetIds(new Set(order.filter(id => !hidden.has(id))))
      }
    } catch {}
  }, [])

  const savePrefs = (ids: Set<string>, order: string[]) => {
    try {
      const active   = order.filter(id => ids.has(id))
      const inactive = WIDGET_DEFS.filter(w => !ids.has(w.id)).map(w => w.id)
      const prefs: DashboardPrefs = {
        order:  [...active, ...inactive],
        hidden: inactive,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
    } catch {}
  }

  const toggleWidget = (id: string) => {
    const next = new Set(activeWidgetIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
      if (!widgetOrder.includes(id)) setWidgetOrder(prev => [...prev, id])
    }
    setActiveWidgetIds(next)
    savePrefs(next, widgetOrder)
  }

  const resetWidgets = () => {
    const defaults = new Set(DEFAULT_WIDGETS)
    setActiveWidgetIds(defaults)
    setWidgetOrder([...DEFAULT_WIDGETS])
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <div className="space-y-6">

      {/* ── Profile Header ── */}
      <Card className="overflow-hidden">
        <div className="bg-ocean-gradient h-24 relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -bottom-4 right-10 w-40 h-40 rounded-full border-4 border-white" />
          </div>
        </div>
        <div className="px-6 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10">
            <div className="flex items-end gap-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-ocean-500 to-ocean-700 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">DC</span>
                </div>
                <button className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-sm border border-slate-100">
                  <Camera className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
              <div className="mb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">{USER_PROFILE.name}</h2>
                  <Badge variant="success">✓ {USER_PROFILE.verificationLevel}</Badge>
                </div>
                <p className="text-slate-600 text-sm">{USER_PROFILE.title} · {USER_PROFILE.company}</p>
                <p className="text-slate-400 text-xs mt-0.5">{USER_PROFILE.country} · Member since {USER_PROFILE.memberSince}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm"><Edit className="w-4 h-4" /> Edit Profile</Button>
              <Button variant="ghost" size="sm" className="text-slate-400"><LogOut className="w-4 h-4" /></Button>
            </div>
          </div>
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-100">
            <div className="text-center">
              <p className="font-bold text-slate-900 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />{USER_PROFILE.rating}
              </p>
              <p className="text-xs text-slate-500">{USER_PROFILE.totalReviews} reviews</p>
            </div>
            <div className="text-center"><p className="font-bold text-slate-900">$596K</p><p className="text-xs text-slate-500">Total traded</p></div>
            <div className="text-center"><p className="font-bold text-slate-900">38</p><p className="text-xs text-slate-500">Orders placed</p></div>
            <div className="text-center"><p className="font-bold text-slate-900">{USER_PROFILE.responseTime}</p><p className="text-xs text-slate-500">Avg. response</p></div>
          </div>
        </div>
      </Card>

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn('flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
              activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900')}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Overview Tab ── */}
      {activeTab === 'Overview' && (
        <div className="space-y-6">

          {/* ══ My Dashboard Card ══ */}
          <Card className="overflow-hidden border-2 border-ocean-100">

            {/* Header bar */}
            <div className="bg-gradient-to-r from-ocean-600 to-ocean-800 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/15 rounded-xl">
                    <LayoutDashboard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg leading-tight">My Dashboard</h3>
                    <p className="text-ocean-200 text-sm">
                      {activeWidgetIds.size} of {WIDGET_DEFS.length} widgets active on your homepage
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPickerOpen(v => !v)}
                    className={cn(
                      'flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-md',
                      pickerOpen
                        ? 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
                        : 'bg-white text-ocean-700 hover:bg-ocean-50'
                    )}
                  >
                    {pickerOpen ? <Eye className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {pickerOpen ? 'Close' : 'Choose Widgets'}
                  </button>
                  <Link href="/?edit=1">
                    <button className="flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-white/20 transition-colors">
                      <GripVertical className="w-4 h-4" /> Reorder
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Active widgets pill row */}
            <div className="px-6 py-3 border-b border-slate-100 bg-slate-50 flex gap-2 flex-wrap min-h-[52px] items-center">
              {WIDGET_DEFS.filter(w => activeWidgetIds.has(w.id)).map(w => (
                <span key={w.id} className="inline-flex items-center gap-1.5 text-xs font-medium bg-white border border-ocean-200 text-ocean-700 px-2.5 py-1 rounded-full shadow-sm">
                  {w.icon} {w.label}
                </span>
              ))}
              {activeWidgetIds.size === 0 && (
                <span className="text-xs text-slate-400 italic">No widgets selected — click &quot;Choose Widgets&quot; to add some</span>
              )}
            </div>

            {/* Widget Picker (expandable) */}
            {pickerOpen && (
              <div className="px-6 py-6 border-b border-slate-100">
                <WidgetPickerPanel
                  activeWidgetIds={activeWidgetIds}
                  onToggle={toggleWidget}
                  onReset={resetWidgets}
                />
              </div>
            )}
          </Card>

          {/* ══ Account Overview + Activity ══ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="lg:col-span-1 space-y-4">
              <h2 className="font-semibold text-slate-900">Account Overview</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Open Orders',  value: '3',  icon: Package,       color: 'text-ocean-600',  bg: 'bg-ocean-50'  },
                  { label: 'Saved Items',  value: '12', icon: Heart,         color: 'text-rose-600',   bg: 'bg-rose-50'   },
                  { label: 'Price Alerts', value: '3',  icon: Bell,          color: 'text-amber-600',  bg: 'bg-amber-50'  },
                  { label: 'Messages',     value: '8',  icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map(s => {
                  const Icon = s.icon
                  return (
                    <Card key={s.label} className="p-3">
                      <div className={`p-2 rounded-lg ${s.bg} w-fit mb-2`}><Icon className={`w-4 h-4 ${s.color}`} /></div>
                      <p className="text-xl font-bold text-slate-900">{s.value}</p>
                      <p className="text-xs text-slate-500">{s.label}</p>
                    </Card>
                  )
                })}
              </div>
              <Card className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-emerald-900">Trust Score</span>
                </div>
                <div className="space-y-2">
                  {[{l:'Identity Verified',d:true},{l:'Business Registered',d:true},{l:'Trade History',d:true},{l:'Premium KYC',d:false}].map(item => (
                    <div key={item.l} className="flex items-center gap-2 text-sm">
                      <CheckCircle className={cn('w-4 h-4', item.d ? 'text-emerald-500' : 'text-slate-300')} />
                      <span className={item.d ? 'text-slate-700' : 'text-slate-400'}>{item.l}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-emerald-700 font-medium">Trust Level</span>
                    <span className="text-emerald-700 font-bold">75%</span>
                  </div>
                  <div className="h-2 bg-white rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h2 className="font-semibold text-slate-900">Recent Activity</h2>
              <div className="space-y-3">
                {ACTIVITY_ITEMS.map((item, i) => {
                  const Icon = item.icon
                  return (
                    <Card key={i} className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${item.color.split(' ')[1]}`}>
                          <Icon className={`w-4 h-4 ${item.color.split(' ')[0]}`} />
                        </div>
                        <div className="flex-1 min-w-0"><p className="text-sm text-slate-700">{item.text}</p></div>
                        <span className="text-xs text-slate-400 whitespace-nowrap flex items-center gap-1 flex-shrink-0">
                          <Clock className="w-3 h-3" />{item.time}
                        </span>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Order History</h2>
            <Button variant="secondary" size="sm">Export CSV</Button>
          </div>
          <div className="space-y-3">
            {RECENT_ORDERS.map(order => (
              <Card key={order.id} className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-mono font-bold text-slate-700">{order.id}</span>
                      <Badge variant={order.status === 'Delivered' ? 'success' : 'warning'}>{order.status}</Badge>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{order.product}</p>
                    <p className="text-xs text-slate-500">{order.qty} · {order.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-bold text-slate-900">{order.amount}</p>
                    <Button variant="secondary" size="sm">View Docs</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Saved' && (
        <div className="space-y-4">
          <h2 className="font-semibold text-slate-900">Saved Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SAVED_PRODUCTS.map(p => (
              <Card key={p.name} className="p-4" hover>
                <div className="text-3xl mb-2">{p.icon}</div>
                <h3 className="font-semibold text-slate-900 text-sm mb-1">{p.name}</h3>
                <p className="text-ocean-600 font-bold text-sm">{p.price}</p>
                <p className="text-xs text-slate-500">{p.supplier}</p>
                <div className="flex gap-2 mt-3">
                  <Button variant="primary" size="sm" className="flex-1">Get Quote</Button>
                  <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50">
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Alerts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Price Alerts</h2>
            <Button variant="primary" size="sm"><Bell className="w-4 h-4" /> Add Alert</Button>
          </div>
          <div className="space-y-3">
            {PRICE_ALERTS.map((alert, i) => (
              <Card key={i} className={cn('p-4', alert.triggered && 'border-amber-200 bg-amber-50')}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{alert.species.split(' ')[0]}</span>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{alert.species}</p>
                      <p className="text-xs text-slate-600">Alert: {alert.condition}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={alert.triggered ? 'warning' : 'success'}>
                      {alert.triggered ? '⚡ Triggered' : '● Active'}
                    </Badge>
                    <button className="text-xs text-slate-400 hover:text-slate-600">Edit</button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Documents' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Digital Document Archive</h2>
            <Button variant="primary" size="sm">Upload Document</Button>
          </div>
          <div className="space-y-2">
            {[
              { name: 'Bill of Lading — Order #SEA-2026-0841',         type: 'B/L',         date: 'Mar 3, 2026',  order: '#SEA-2026-0841' },
              { name: 'Commercial Invoice — 25 MT Norwegian Salmon',   type: 'Invoice',     date: 'Mar 1, 2026',  order: '#SEA-2026-0841' },
              { name: 'Health Certificate — MSC Atlantic Salmon',      type: 'Health Cert', date: 'Feb 28, 2026', order: '#SEA-2026-0841' },
              { name: 'Phytosanitary Certificate — Iceland Cod',       type: 'Phyto Cert',  date: 'Feb 3, 2026',  order: '#SEA-2026-0799' },
              { name: 'Customs Declaration — Shrimp Import USA',       type: 'Customs',     date: 'Feb 20, 2026', order: '#SEA-2026-0799' },
            ].map((doc, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-ocean-50 rounded-lg"><FileText className="w-4 h-4 text-ocean-600" /></div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{doc.name}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Badge variant="default">{doc.type}</Badge>
                        <span>{doc.date}</span><span>Order {doc.order}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Download</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Settings' && (
        <div className="space-y-4 max-w-xl">
          <h2 className="font-semibold text-slate-900">Account Settings</h2>
          {[
            { label: 'Notification Preferences', desc: 'Email, SMS, and push notifications', icon: Bell        },
            { label: 'Language & Region',         desc: 'Language, timezone, and currency',  icon: Globe2      },
            { label: 'Privacy & Visibility',      desc: 'Control who sees your profile',     icon: Shield      },
            { label: 'Payment Methods',           desc: 'Cards, wire transfer, escrow',      icon: DollarSign  },
            { label: 'Verification Documents',    desc: 'KYC and business verification',     icon: CheckCircle },
            { label: 'API Access',                desc: 'For enterprise data integrations',  icon: Activity    },
          ].map(setting => {
            const Icon = setting.icon
            return (
              <Card key={setting.label} className="p-4 cursor-pointer" hover>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-100 rounded-xl"><Icon className="w-5 h-5 text-slate-600" /></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{setting.label}</p>
                    <p className="text-xs text-slate-500">{setting.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </Card>
            )
          })}
        </div>
      )}

    </div>
  )
}
