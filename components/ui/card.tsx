import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glass?: boolean
  onClick?: () => void
}

export function Card({ children, className, hover = false, glass = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl border border-slate-100 bg-white shadow-card',
        hover && 'card-hover cursor-pointer',
        glass && 'glass border-white/20',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-6 py-4 border-b border-slate-50', className)}>{children}</div>
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-6 py-4', className)}>{children}</div>
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-6 py-4 border-t border-slate-50 bg-slate-50/50 rounded-b-2xl', className)}>{children}</div>
}

export function StatCard({
  label,
  value,
  change,
  changePositive,
  icon,
  color = 'blue',
  className
}: {
  label: string
  value: string | number
  change?: string
  changePositive?: boolean
  icon?: React.ReactNode
  color?: 'blue' | 'emerald' | 'amber' | 'coral'
  className?: string
}) {
  const colorMap = {
    blue: 'from-ocean-500 to-ocean-700',
    emerald: 'from-emerald-500 to-teal-600',
    amber: 'from-amber-500 to-orange-600',
    coral: 'from-orange-500 to-red-600',
  }
  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            {change && (
              <p className={cn('text-sm mt-1 font-medium', changePositive ? 'text-emerald-600' : 'text-red-500')}>
                {changePositive ? '▲' : '▼'} {change}
              </p>
            )}
          </div>
          {icon && (
            <div className={cn('p-3 rounded-xl bg-gradient-to-br text-white shadow-md', colorMap[color])}>
              {icon}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
