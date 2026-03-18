'use client'

import { cn } from '@/lib/utils'

export interface PlatformCategory {
  id: string
  name: string
  shortName: string
  icon: string
  gradient: string
  activeBg: string
  hoverBorder: string
  textColor: string
  description: string
  species: string[]
}

export const PLATFORM_CATEGORIES_NAV: PlatformCategory[] = [
  {
    id: 'all',
    name: 'All Products',
    shortName: 'All',
    icon: '🌊',
    gradient: 'from-slate-700 to-slate-900',
    activeBg: 'bg-gradient-to-br from-slate-700 to-slate-900',
    hoverBorder: 'hover:border-slate-400',
    textColor: 'text-slate-700',
    description: 'Complete platform catalog',
    species: [],
  },
  {
    id: 'frozen-seafood',
    name: 'Frozen Seafood',
    shortName: 'Frozen',
    icon: '🧊',
    gradient: 'from-sky-500 to-sky-700',
    activeBg: 'bg-gradient-to-br from-sky-500 to-sky-700',
    hoverBorder: 'hover:border-sky-400',
    textColor: 'text-sky-700',
    description: 'Salmon · Tuna · Tilapia · Shrimp · Lobster · Hamachi',
    species: ['Atlantic Salmon','Yellowfin Tuna','Tilapia','Shrimp','Lobster','Yellowtail / Hamachi'],
  },
  {
    id: 'frozen-value-added',
    name: 'Frozen Value Added',
    shortName: 'Value Added',
    icon: '⭐',
    gradient: 'from-violet-500 to-violet-700',
    activeBg: 'bg-gradient-to-br from-violet-500 to-violet-700',
    hoverBorder: 'hover:border-violet-400',
    textColor: 'text-violet-700',
    description: 'Breaded · Marinated · Burgers · Seafood Mix',
    species: ['Value Added Seafood'],
  },
  {
    id: 'seafood-specials',
    name: 'Seafood Specials',
    shortName: 'Specials',
    icon: '🍽️',
    gradient: 'from-orange-500 to-orange-700',
    activeBg: 'bg-gradient-to-br from-orange-500 to-orange-700',
    hoverBorder: 'hover:border-orange-400',
    textColor: 'text-orange-700',
    description: 'Caviar · Bottarga · Carpaccio · Ceviche · King Crab',
    species: ['Seafood Specials','Caviar','Bottarga','Octopus','King Crab'],
  },
  {
    id: 'fresh-seafood',
    name: 'Fresh Seafood',
    shortName: 'Fresh',
    icon: '🐟',
    gradient: 'from-emerald-500 to-emerald-700',
    activeBg: 'bg-gradient-to-br from-emerald-500 to-emerald-700',
    hoverBorder: 'hover:border-emerald-400',
    textColor: 'text-emerald-700',
    description: 'Bluefin Tuna · Sea Bass · Halibut · Cod · Mahi-Mahi',
    species: ['Fresh Seafood','Bluefin Tuna','Sea Bass','Sea Bream','Halibut','Cod','Grouper','Red Snapper','Mahi-Mahi','Swordfish','Mackerel','King Salmon'],
  },
]

interface PlatformCategoryBarProps {
  selected: string
  onSelect: (id: string) => void
  counts?: Record<string, number>
  /** 'cards' = large card tiles (default), 'tabs' = compact pill tabs */
  variant?: 'cards' | 'tabs'
  className?: string
}

export function PlatformCategoryBar({
  selected, onSelect, counts, variant = 'cards', className,
}: PlatformCategoryBarProps) {
  if (variant === 'tabs') {
    return (
      <div className={cn('flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide', className)}>
        {PLATFORM_CATEGORIES_NAV.map(cat => {
          const isActive = selected === cat.id
          const count = counts?.[cat.id]
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap font-semibold text-sm transition-all border-2 shrink-0',
                isActive
                  ? `bg-gradient-to-r ${cat.gradient} text-white border-transparent shadow-lg shadow-black/10 scale-[1.02]`
                  : `bg-white text-gray-600 border-gray-200 ${cat.hoverBorder} hover:bg-gray-50`
              )}
            >
              <span className="text-base">{cat.icon}</span>
              <span>{cat.shortName}</span>
              {count !== undefined && (
                <span className={cn(
                  'text-xs px-1.5 py-0.5 rounded-full font-bold',
                  isActive ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'
                )}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  // Default: cards variant
  return (
    <div className={cn('w-full', className)}>
      <div className="grid grid-cols-5 gap-3">
        {PLATFORM_CATEGORIES_NAV.map(cat => {
          const isActive = selected === cat.id
          const count = counts?.[cat.id]
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={cn(
                'relative overflow-hidden rounded-2xl border-2 text-left transition-all duration-300 cursor-pointer group',
                isActive
                  ? 'border-white/40 shadow-2xl shadow-black/20 scale-[1.03] ring-2 ring-white/30'
                  : 'border-white/20 shadow-md hover:shadow-xl hover:scale-[1.02]'
              )}
            >
              {/* Gradient background — always visible */}
              <div className={cn('absolute inset-0 bg-gradient-to-br', cat.gradient)} />

              {/* White wash overlay — inactive = muted (45% white), active = slight shimmer only */}
              <div className={cn(
                'absolute inset-0 transition-opacity duration-300 pointer-events-none',
                isActive
                  ? 'bg-gradient-to-br from-white/12 to-transparent opacity-100'
                  : 'bg-white/45 group-hover:bg-white/30'
              )} />

              <div className="relative z-10 p-4">
                {/* Icon */}
                <div className={cn(
                  'text-4xl mb-3 transition-transform duration-200',
                  isActive ? 'drop-shadow-lg scale-110' : 'group-hover:scale-110',
                )}>
                  {cat.icon}
                </div>

                {/* Name */}
                <div className={cn(
                  'font-bold text-sm leading-tight mb-1.5 transition-colors duration-200',
                  isActive ? 'text-white drop-shadow-sm' : 'text-white/90'
                )}>
                  {cat.name}
                </div>

                {/* Description */}
                <div className={cn(
                  'text-[11px] leading-tight transition-colors duration-200',
                  isActive ? 'text-white/85' : 'text-white/65'
                )}>
                  {cat.description}
                </div>

                {/* Count badge */}
                {count !== undefined && (
                  <div className="mt-3">
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-sm transition-colors duration-200',
                      isActive
                        ? 'bg-white/25 text-white'
                        : 'bg-black/15 text-white/90'
                    )}>
                      {count} {count === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                )}
              </div>

              {/* Active glow ring */}
              {isActive && (
                <div className="absolute inset-0 rounded-2xl ring-inset ring-2 ring-white/20 pointer-events-none" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
