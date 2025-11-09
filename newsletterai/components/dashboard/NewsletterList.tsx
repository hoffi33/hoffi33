import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Database } from '@/types/database.types'

type Newsletter = Database['public']['Tables']['newsletters']['Row']

interface NewsletterListProps {
  newsletters: Newsletter[]
}

export function NewsletterList({ newsletters }: NewsletterListProps) {
  if (!newsletters || newsletters.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-4xl mb-4">📭</div>
          <h3 className="text-lg font-semibold mb-2">Brak newsletterów</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Rozpocznij tworząc swój pierwszy newsletter
          </p>
          <Link href="/create">
            <Button>Stwórz newsletter</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {newsletters.map((newsletter) => (
        <Card key={newsletter.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <CardTitle className="text-lg">
                  {newsletter.title || 'Bez tytułu'}
                </CardTitle>
                <CardDescription>
                  Utworzono: {new Date(newsletter.created_at).toLocaleDateString('pl-PL')}
                  {' • '}
                  Status: <span className="capitalize">{newsletter.status}</span>
                  {newsletter.word_count && ` • ${newsletter.word_count} słów`}
                </CardDescription>
              </div>

              <div className="flex gap-2 ml-4">
                <Link href={`/newsletters/${newsletter.id}`}>
                  <Button variant="outline" size="sm">
                    Zobacz
                  </Button>
                </Link>
                {newsletter.status === 'draft' && (
                  <Link href={`/create/edit/${newsletter.id}`}>
                    <Button size="sm">
                      Edytuj
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </CardHeader>

          {newsletter.selected_subject_line && (
            <CardContent>
              <p className="text-sm">
                <span className="font-medium">Temat:</span> {newsletter.selected_subject_line}
              </p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
