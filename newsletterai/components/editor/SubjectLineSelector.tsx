'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'
import { SubjectLine } from '@/types'
import { Check } from 'lucide-react'

interface SubjectLineSelectorProps {
  subjectLines: SubjectLine[]
  selectedSubject: string
  onSelect: (subject: string) => void
  newsletterId: string
}

export function SubjectLineSelector({
  subjectLines,
  selectedSubject,
  onSelect,
  newsletterId,
}: SubjectLineSelectorProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSelect = (subject: string) => {
    onSelect(subject)
    setOpen(false)
  }

  const handleGenerateMore = async () => {
    setLoading(true)
    try {
      // Call API to generate more subject lines
      // This would be implemented in ETAP 8
      console.log('Generating more subject lines...')
    } catch (err) {
      console.error('Generate error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {subjectLines && subjectLines.length > 0
            ? `Wybierz (${subjectLines.length})`
            : 'Generuj subject lines'}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Subject Lines</DialogTitle>
          <DialogDescription>
            Wybierz najlepszy subject line dla swojego newslettera
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {subjectLines && subjectLines.length > 0 ? (
            subjectLines.map((line, index) => (
              <div
                key={index}
                onClick={() => handleSelect(line.text)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-accent ${
                  selectedSubject === line.text
                    ? 'border-primary bg-accent'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium">{line.text}</span>
                      {selectedSubject === line.text && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="capitalize">{line.type}</span>
                      <span>
                        Open rate: {(line.predictedOpenRate * 100).toFixed(1)}%
                      </span>
                      {line.score && <span>Score: {line.score}/10</span>}
                    </div>

                    {line.reasoning && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {line.reasoning}
                      </p>
                    )}

                    {line.powerWords && line.powerWords.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {line.powerWords.map((word, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded"
                          >
                            {word}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Brak subject lines. Wygeneruj teraz!
              </p>
              <Button onClick={handleGenerateMore} disabled={loading}>
                {loading ? 'Generuję...' : 'Generuj 10 opcji'}
              </Button>
            </div>
          )}
        </div>

        {subjectLines && subjectLines.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleGenerateMore}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Generuję...' : 'Generuj więcej opcji'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
