import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'ocean' | 'outline'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center font-medium rounded-full',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
      variant === 'default' && 'bg-slate-100 text-slate-700',
      variant === 'success' && 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      variant === 'warning' && 'bg-amber-50 text-amber-700 border border-amber-200',
      variant === 'danger' && 'bg-red-50 text-red-700 border border-red-200',
      variant === 'ocean' && 'bg-ocean-100 text-ocean-700 border border-ocean-200',
      variant === 'outline' && 'border border-slate-200 text-slate-600 bg-white',
      className
    )}>
      {children}
    </span>
  )
}
