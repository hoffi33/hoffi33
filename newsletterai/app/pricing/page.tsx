'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: 0,
    priceId: null,
    newsletters: 2,
    features: [
      '2 newslettery / miesiąc',
      'Import z YouTube, podcast, blog',
      'AI analiza contentu',
      'Podstawowy edytor',
      'Export HTML, Markdown',
    ],
  },
  {
    name: 'Basic',
    price: 39,
    priceId: 'price_basic', // Replace with real Stripe Price ID
    newsletters: 10,
    features: [
      '10 newsletterów / miesiąc',
      'Wszystko z planu Free',
      '10 subject lines AI',
      'Test email wysyłka',
      'Priority support',
    ],
    popular: true,
  },
  {
    name: 'Pro',
    price: 97,
    priceId: 'price_pro', // Replace with real Stripe Price ID
    newsletters: -1, // unlimited
    features: [
      'Unlimited newslettery',
      'Wszystko z planu Basic',
      'Brand voice training',
      'Batch processing',
      'Advanced analytics',
      'Dedicated support',
    ],
  },
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (priceId: string | null, planName: string) => {
    if (!priceId) {
      // Free plan - redirect to dashboard
      window.location.href = '/dashboard'
      return
    }

    setLoading(planName)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error('Checkout error:', err)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Cennik</h1>
          <p className="text-xl text-muted-foreground">
            Wybierz plan dopasowany do Twoich potrzeb
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={plan.popular ? 'border-primary shadow-lg' : ''}
            >
              {plan.popular && (
                <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium rounded-t-lg">
                  Najpopularniejszy
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-4xl font-bold text-foreground">
                    ${plan.price}
                  </span>
                  {plan.price > 0 && <span className="text-muted-foreground">/msc</span>}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => handleSubscribe(plan.priceId, plan.name)}
                  disabled={loading === plan.name}
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {loading === plan.name
                    ? 'Przekierowywanie...'
                    : plan.price === 0
                    ? 'Start Free'
                    : 'Wybierz plan'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>Wszystkie plany zawierają 14-dniowy okres próbny</p>
          <p>Możesz anulować w dowolnym momencie</p>
        </div>
      </div>
    </div>
  )
}
