'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

interface NavbarProps {
  userEmail?: string
  userName?: string
}

export function Navbar({ userEmail, userName }: NavbarProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">NewsletterAI</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium">{userName || 'User'}</span>
            <span className="text-xs text-muted-foreground">{userEmail}</span>
          </div>

          <Button variant="outline" onClick={handleLogout}>
            Wyloguj
          </Button>
        </div>
      </div>
    </header>
  )
}
