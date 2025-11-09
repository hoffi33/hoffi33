import { createClient } from '@/lib/supabase/server'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { NewsletterList } from '@/components/dashboard/NewsletterList'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = createClient()

  // Get user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Get user profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get recent newsletters
  const { data: newsletters } = await supabase
    .from('newsletters')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Witaj z powrotem, {profile?.full_name || 'User'}!
          </p>
        </div>

        <Link href="/create">
          <Button size="lg">
            ✨ Stwórz newsletter
          </Button>
        </Link>
      </div>

      <StatsCards
        usageCount={profile?.usage_count || 0}
        usageLimit={profile?.usage_limit || 2}
        planTier={profile?.plan_tier || 'free'}
      />

      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">
          Ostatnie newslettery
        </h2>
        <NewsletterList newsletters={newsletters || []} />
      </div>
    </div>
  )
}
