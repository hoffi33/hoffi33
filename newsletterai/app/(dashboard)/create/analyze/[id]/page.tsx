'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export default function AnalyzePage() {
  const router = useRouter()
  const params = useParams()
  const contentSourceId = params.id as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [analysisId, setAnalysisId] = useState<string | null>(null)

  // Settings for newsletter
  const [tone, setTone] = useState('professional')
  const [length, setLength] = useState('standard')
  const [structure, setStructure] = useState('mixed')

  useEffect(() => {
    analyzeContent()
  }, [contentSourceId])

  const analyzeContent = async () => {
    try {
      const response = await fetch('/api/content/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentSourceId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed')
      }

      setAnalysis(data.analysis)
      setAnalysisId(data.analysisId)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateNewsletter = async () => {
    router.push(
      `/create/generate?contentSourceId=${contentSourceId}&analysisId=${analysisId}&tone=${tone}&length=${length}&structure=${structure}`
    )
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">Analizuję content...</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Claude AI analizuje Twój content i wyciąga kluczowe insights
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-destructive">Błąd analizy</h3>
              <p className="text-sm text-muted-foreground mt-2">{error}</p>
              <Button onClick={() => router.push('/create')} className="mt-4">
                Wróć
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analiza zakończona!</h1>
        <p className="text-muted-foreground mt-2">
          Przejrzyj wyniki analizy i dostosuj ustawienia newslettera
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Wyniki analizy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Główny temat</Label>
            <p className="text-lg mt-1">{analysis?.main_topic}</p>
          </div>

          <div>
            <Label className="text-sm font-medium">Pod-tematy</Label>
            <ul className="list-disc list-inside mt-1 space-y-1">
              {analysis?.sub_topics?.map((topic: string, i: number) => (
                <li key={i} className="text-sm">{topic}</li>
              ))}
            </ul>
          </div>

          <div>
            <Label className="text-sm font-medium">Kluczowe wnioski</Label>
            <ul className="list-disc list-inside mt-1 space-y-1">
              {analysis?.key_takeaways?.map((takeaway: string, i: number) => (
                <li key={i} className="text-sm">{takeaway}</li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <Label className="text-xs text-muted-foreground">Audience</Label>
              <p className="text-sm font-medium capitalize">{analysis?.target_audience}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Sentiment</Label>
              <p className="text-sm font-medium capitalize">{analysis?.sentiment}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Difficulty</Label>
              <p className="text-sm font-medium capitalize">{analysis?.difficulty}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ustawienia newslettera</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Ton</Label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="casual">Casual</option>
              <option value="educational">Educational</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Długość</Label>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="quick">Quick (~300 słów)</option>
              <option value="standard">Standard (~800 słów)</option>
              <option value="deep">Deep Dive (~1500 słów)</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Struktura</Label>
            <select
              value={structure}
              onChange={(e) => setStructure(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="story-led">Story-led</option>
              <option value="listicle">Listicle</option>
              <option value="tutorial">Tutorial</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          <Button onClick={handleGenerateNewsletter} className="w-full" size="lg">
            Generuj newsletter →
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
