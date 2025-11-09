'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { NewsletterEditor } from '@/components/editor/NewsletterEditor'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ExportOptions } from '@/components/editor/ExportOptions'
import { SubjectLineSelector } from '@/components/editor/SubjectLineSelector'
import { Save, Eye } from 'lucide-react'
import { markdownToHtml } from '@/lib/utils/markdown'

export default function EditorPage() {
  const params = useParams()
  const router = useRouter()
  const newsletterId = params.id as string
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newsletter, setNewsletter] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [contentMarkdown, setContentMarkdown] = useState('')
  const [contentHtml, setContentHtml] = useState('')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  useEffect(() => {
    loadNewsletter()
  }, [newsletterId])

  // Auto-save every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (contentMarkdown || title) {
        handleSave(true)
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [contentMarkdown, title, selectedSubject])

  const loadNewsletter = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletters')
        .select('*')
        .eq('id', newsletterId)
        .single()

      if (error) throw error

      setNewsletter(data)
      setTitle(data.title || '')
      setSelectedSubject(data.selected_subject_line || '')
      setContentMarkdown(data.content_markdown || '')
      setContentHtml(data.content_html || '')
    } catch (err) {
      console.error('Load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = useCallback(
    async (isAutoSave = false) => {
      if (!contentMarkdown) return

      setSaving(true)
      try {
        const html = markdownToHtml(contentMarkdown)
        const wordCount = contentMarkdown.split(/\s+/).filter(Boolean).length

        const { error } = await supabase
          .from('newsletters')
          .update({
            title,
            selected_subject_line: selectedSubject,
            content_markdown: contentMarkdown,
            content_html: html,
            word_count: wordCount,
            reading_time_minutes: Math.ceil(wordCount / 200),
            updated_at: new Date().toISOString(),
          })
          .eq('id', newsletterId)

        if (error) throw error

        setLastSaved(new Date())
        setContentHtml(html)

        if (!isAutoSave) {
          // Show success message for manual saves
          console.log('Saved successfully')
        }
      } catch (err) {
        console.error('Save error:', err)
      } finally {
        setSaving(false)
      }
    },
    [contentMarkdown, title, selectedSubject, newsletterId, supabase]
  )

  const handleEditorUpdate = (markdown: string, html: string) => {
    setContentMarkdown(markdown)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!newsletter) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold">Newsletter nie znaleziony</h3>
            <Button onClick={() => router.push('/dashboard')} className="mt-4">
              Wróć do dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edytuj newsletter</h1>
          {lastSaved && (
            <p className="text-sm text-muted-foreground mt-1">
              Ostatnio zapisano: {lastSaved.toLocaleTimeString('pl-PL')}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Zapisuję...' : 'Zapisz'}
          </Button>

          <ExportOptions
            newsletterId={newsletterId}
            html={contentHtml}
            markdown={contentMarkdown}
          />
        </div>
      </div>

      {/* Title */}
      <Card>
        <CardHeader>
          <CardTitle>Tytuł newslettera</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Wpisz tytuł..."
            className="text-lg"
          />
        </CardContent>
      </Card>

      {/* Subject Lines */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Subject Line</CardTitle>
            <SubjectLineSelector
              subjectLines={newsletter.subject_lines || []}
              selectedSubject={selectedSubject}
              onSelect={setSelectedSubject}
              newsletterId={newsletterId}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm">
              {selectedSubject || 'Wybierz subject line →'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Treść newslettera</CardTitle>
        </CardHeader>
        <CardContent>
          <NewsletterEditor
            initialContent={contentMarkdown}
            onUpdate={handleEditorUpdate}
          />
        </CardContent>
      </Card>
    </div>
  )
}
