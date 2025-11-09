import { ContentImporter } from '@/components/content/ContentImporter'

export default function CreatePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Stwórz nowy newsletter
        </h1>
        <p className="text-muted-foreground mt-2">
          Zacznij od zaimportowania contentu z YouTube, podcastu, bloga lub wklejenia własnego tekstu
        </p>
      </div>

      <ContentImporter />
    </div>
  )
}
