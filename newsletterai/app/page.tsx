import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container px-4 py-24 mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Zamień podcast w newsletter
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                w 2 minuty
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              AI Copilot dla Twojego newslettera. Import z YouTube, podcastu lub bloga.
              Claude AI pisze profesjonalny newsletter za Ciebie.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8 py-6">
                  Start Free - No Credit Card
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Zobacz cennik
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">
              2 newslettery za darmo. Bez karty kredytowej.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-background">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Jak to działa?</h2>
            <p className="text-xl text-muted-foreground">3 proste kroki do gotowego newslettera</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <CardTitle>Import Content</CardTitle>
                <CardDescription>
                  Wklej link do YouTube, upload podcast (MP3), lub skopiuj artykuł z bloga
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <CardTitle>AI Analiza</CardTitle>
                <CardDescription>
                  Claude AI analizuje content i wyciąga kluczowe insights, cytaty i wnioski
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <CardTitle>Export & Send</CardTitle>
                <CardDescription>
                  Edytuj, wybierz subject line i eksportuj. Wyślij przez swój ESP (Mailchimp, Beehiiv)
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Funkcje</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { icon: '🎬', title: 'YouTube Import', desc: 'Automatyczna transkrypcja filmów' },
              { icon: '🎙️', title: 'Podcast Support', desc: 'Upload MP3 lub link do podcastu' },
              { icon: '📄', title: 'Blog Scraping', desc: 'Wyciągnij content z dowolnego artykułu' },
              { icon: '🤖', title: 'AI Analysis', desc: 'Claude Sonnet 4.5 analizuje content' },
              { icon: '✍️', title: 'Smart Editor', desc: 'Tiptap editor z rich formatting' },
              { icon: '📧', title: '10 Subject Lines', desc: 'AI generuje najlepsze subject lines' },
            ].map((feature, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Gotowy aby zacząć?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Dołącz do twórców którzy zaoszczędzili setki godzin na pisaniu newsletterów
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Start Free Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="font-bold text-lg">NewsletterAI</p>
              <p className="text-sm text-muted-foreground">
                AI-powered newsletter generator
              </p>
            </div>
            <div className="flex gap-6">
              <Link href="/pricing" className="text-sm hover:underline">
                Pricing
              </Link>
              <Link href="/login" className="text-sm hover:underline">
                Login
              </Link>
              <Link href="/register" className="text-sm hover:underline">
                Sign Up
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            © 2024 NewsletterAI. Built with Next.js, Claude AI & Supabase.
          </div>
        </div>
      </footer>
    </main>
  )
}
