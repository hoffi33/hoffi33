import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface StatsCardsProps {
  usageCount: number
  usageLimit: number
  planTier: string
}

export function StatsCards({ usageCount, usageLimit, planTier }: StatsCardsProps) {
  const usagePercentage = (usageCount / usageLimit) * 100

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Newslettery ten miesiąc
          </CardTitle>
          <span className="text-2xl">📝</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{usageCount}</div>
          <p className="text-xs text-muted-foreground">
            utworzonych newsletterów
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Limit użycia
          </CardTitle>
          <span className="text-2xl">📊</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {usageCount} / {usageLimit}
          </div>
          <div className="mt-2 h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {usageLimit - usageCount} pozostało
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Plan
          </CardTitle>
          <span className="text-2xl">💎</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold capitalize">{planTier}</div>
          <p className="text-xs text-muted-foreground">
            {planTier === 'free' && 'Darmowy plan startowy'}
            {planTier === 'basic' && '10 newsletterów / msc'}
            {planTier === 'pro' && 'Unlimited newslettery'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
