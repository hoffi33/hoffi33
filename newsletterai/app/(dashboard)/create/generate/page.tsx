'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'

export default function GeneratePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const contentSourceId = searchParams.get('contentSourceId')
  const analysisId = searchParams.get('analysisId')
  const tone = searchParams.get('tone') || 'professional'
  const length = searchParams.get('length') || 'standard'
  const structure = searchParams.get('structure') || 'mixed'

  useEffect(() => {
    if (!contentSourceId || !analysisId) {
      setError('Missing required parameters')
      return
    }

    generateNewsletter()
  }, [contentSourceId, analysisId])

  const generateNewsletter = async () => {
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 500)

      const response = await fetch('/api/newsletter/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentSourceId,
          analysisId,
          tone,
          length,
          structure,
        }),
      })

      clearInterval(progressInterval)
      setProgress(100)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed')
      }

      // Small delay to show 100% completion
      setTimeout(() => {
        router.push(`/create/edit/${data.newsletterId}`)
      }, 500)
    } catch (err: any) {
      setError(err.message)
      setProgress(0)
    }
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-destructive">
                Błąd generowania
              </h3>
              <p className="text-sm text-muted-foreground mt-2">{error}</p>
              <button
                onClick={() => router.back()}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
              >
                Wróć
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">
                Claude pisze Twój newsletter...
              </h3>
              <p className="text-sm text-muted-foreground">
                To może potrwać 30-60 sekund
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-md">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Postęp</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Progress steps */}
            <div className="w-full max-w-md space-y-2 mt-4">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${progress >= 10 ? 'bg-primary' : 'bg-muted'}`} />
                <span className="text-sm">Analizuję content...</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${progress >= 30 ? 'bg-primary' : 'bg-muted'}`} />
                <span className="text-sm">Tworzę strukturę newslettera...</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${progress >= 60 ? 'bg-primary' : 'bg-muted'}`} />
                <span className="text-sm">Piszę treść...</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${progress >= 80 ? 'bg-primary' : 'bg-muted'}`} />
                <span className="text-sm">Generuję subject lines...</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${progress >= 100 ? 'bg-primary' : 'bg-muted'}`} />
                <span className="text-sm">Finalizuję...</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
