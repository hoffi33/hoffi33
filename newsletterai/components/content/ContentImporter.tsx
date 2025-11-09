'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

type ContentType = 'youtube' | 'podcast' | 'blog' | 'text'

export function ContentImporter() {
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleImport = async (type: ContentType) => {
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('type', type)

      if (type === 'podcast' && file) {
        formData.append('file', file)
      } else if (input) {
        formData.append('input', input)
      } else {
        setError('Proszę podać URL lub wkleić tekst')
        setLoading(false)
        return
      }

      const response = await fetch('/api/content/import', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Import failed')
      }

      // Redirect to analysis page
      router.push(`/create/analyze/${data.contentSourceId}`)
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd podczas importu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Importuj content</CardTitle>
        <CardDescription>
          Wybierz źródło swojego contentu
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <Tabs defaultValue="youtube" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="youtube">🎬 YouTube</TabsTrigger>
            <TabsTrigger value="podcast">🎙️ Podcast</TabsTrigger>
            <TabsTrigger value="blog">📄 Blog</TabsTrigger>
            <TabsTrigger value="text">✍️ Tekst</TabsTrigger>
          </TabsList>

          <TabsContent value="youtube" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="youtube-url">URL YouTube</Label>
              <Input
                id="youtube-url"
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Wklej link do filmu YouTube
              </p>
            </div>
            <Button
              onClick={() => handleImport('youtube')}
              disabled={!input || loading}
              className="w-full"
            >
              {loading ? 'Importuję...' : 'Importuj z YouTube'}
            </Button>
          </TabsContent>

          <TabsContent value="podcast" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="podcast-file">Plik audio</Label>
              <Input
                id="podcast-file"
                type="file"
                accept=".mp3,.wav,.m4a,.ogg"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Wspierane formaty: MP3, WAV, M4A, OGG (max 25MB)
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Lub
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="podcast-url">URL podcastu</Label>
              <Input
                id="podcast-url"
                type="url"
                placeholder="https://example.com/podcast.mp3"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button
              onClick={() => handleImport('podcast')}
              disabled={(!file && !input) || loading}
              className="w-full"
            >
              {loading ? 'Importuję...' : 'Importuj Podcast'}
            </Button>
          </TabsContent>

          <TabsContent value="blog" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="blog-url">URL artykułu</Label>
              <Input
                id="blog-url"
                type="url"
                placeholder="https://example.com/blog-post"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Wklej link do artykułu na blogu
              </p>
            </div>
            <Button
              onClick={() => handleImport('blog')}
              disabled={!input || loading}
              className="w-full"
            >
              {loading ? 'Importuję...' : 'Importuj Blog Post'}
            </Button>
          </TabsContent>

          <TabsContent value="text" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text-content">Treść</Label>
              <Textarea
                id="text-content"
                placeholder="Wklej dowolny tekst, który chcesz przekształcić w newsletter..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                rows={10}
                className="min-h-[200px]"
              />
              <p className="text-xs text-muted-foreground">
                Min. 100 słów zalecane
              </p>
            </div>
            <Button
              onClick={() => handleImport('text')}
              disabled={!input || loading}
              className="w-full"
            >
              {loading ? 'Przetwarzam...' : 'Użyj tego tekstu'}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
