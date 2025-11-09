import Anthropic from '@anthropic-ai/sdk'
import { ContentAnalysis } from '@/types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function analyzeContent(transcript: string): Promise<ContentAnalysis> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: getAnalysisPrompt(transcript),
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    // Parse JSON from response
    const analysis = JSON.parse(content.text)

    return analysis as ContentAnalysis
  } catch (error: any) {
    console.error('Content analysis error:', error)
    throw new Error(`Analysis failed: ${error.message}`)
  }
}

function getAnalysisPrompt(transcript: string): string {
  return `
Przeanalizuj poniższy content i wyciągnij kluczowe informacje.

CONTENT:
${transcript}

ZADANIE:
Zwróć JSON z następującymi polami:

1. mainTopic (string): Główny temat w 5-8 słowach
2. subTopics (array): 3-5 pod-tematów
3. keyTakeaways (array): 5-7 najważniejszych wniosków
   - Każdy takeaway musi być actionable i specific
   - Unikaj ogólników
4. quotes (array): 3-5 najlepszych cytatów z contentu
   - Wybierz najbardziej impact-owe fragmenty
5. examples (array): Case studies, statystyki, przykłady
   Format: { type: "case_study" | "statistic" | "example", description: string }
6. targetAudience (string): Dla kogo jest ten content
7. audienceLevel (string): "beginner" | "intermediate" | "advanced"
8. painPoints (array): Jakie problemy adresuje
9. suggestedCTAs (array): 3-5 propozycji call-to-action
10. sentiment (string): "educational" | "inspirational" | "entertaining" | "authoritative"
11. difficulty (string): "easy" | "medium" | "hard"

Zwróć TYLKO poprawny JSON, bez żadnego dodatkowego tekstu przed ani po.
`.trim()
}

export async function generateNewsletter(params: {
  transcript: string
  analysis: ContentAnalysis
  tone: string
  length: string
  structure: string
}) {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      messages: [
        {
          role: 'user',
          content: getNewsletterPrompt(params),
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    const newsletter = JSON.parse(content.text)

    return newsletter
  } catch (error: any) {
    console.error('Newsletter generation error:', error)
    throw new Error(`Newsletter generation failed: ${error.message}`)
  }
}

function getNewsletterPrompt(params: any): string {
  const estimatedWords: any = {
    quick: 300,
    standard: 800,
    deep: 1500,
  }

  const wordCount = estimatedWords[params.length] || 800

  return `
Jesteś ekspertem od pisania newsletterów, który tworzy engaging, actionable content.

KONTEKST:
Treść źródłowa: ${params.transcript.substring(0, 3000)}...
Analiza AI: ${JSON.stringify(params.analysis)}

PREFERENCJE UŻYTKOWNIKA:
- Ton: ${params.tone} (professional/friendly/casual/educational)
- Długość: ${params.length} (~${wordCount} słów)
- Struktura: ${params.structure} (story-led/listicle/tutorial/mixed)

TWOJE ZADANIE:
Napisz kompletny newsletter email na podstawie powyższego contentu.

WYMAGANIA:

1. TYTUŁY (3 warianty):
   Stwórz 3 tytuły używając różnych formuł:
   * Curiosity-driven (intrygujący)
   * Number-based (konkretna obietnica z liczbą)
   * Question-based (bezpośrednie pytanie)

   Każdy tytuł 40-60 znaków.

2. OPENING HOOK (50 słów):
   - Pattern interrupt (historia, stat, pytanie)
   - Relatable
   - Curiosity gap

3. GŁÓWNA TREŚĆ (~${wordCount} słów):
   Struktura zależna od ${params.structure}:

   ${getStructureGuidance(params.structure)}

4. KEY TAKEAWAYS:
   - 3-5 najważniejszych rzeczy
   - Actionable
   - Format: "💡 [treść]"

5. ZAKOŃCZENIE + CTA (80-100 słów):
   - Podsumowanie
   - Jasny CTA (specific, low-friction, valuable)

ZASADY PISANIA:
- Akapity: max 2-3 zdania
- Active voice
- Używaj "Ty" i "Ja"
- Konkretne przykłady
- Zero clichés

FORMATOWANIE (Markdown):
- ## dla głównych sekcji
- ### dla pod-sekcji
- **Bold** dla emphasis
- > Blockquote dla insightów

OUTPUT FORMAT JSON:
{
  "subjectLines": [
    { "text": "...", "type": "curiosity", "predictedOpenRate": 0.32, "reasoning": "..." },
    { "text": "...", "type": "number", "predictedOpenRate": 0.35, "reasoning": "..." },
    { "text": "...", "type": "question", "predictedOpenRate": 0.28, "reasoning": "..." }
  ],
  "content": "... [pełny newsletter w markdown] ...",
  "metadata": {
    "wordCount": 789,
    "readingTimeMinutes": 5,
    "keyTopics": ["temat1", "temat2"],
    "sentimentScore": 0.75,
    "engagementPrediction": "high"
  }
}

Zwróć TYLKO JSON bez żadnego preamble.
`.trim()
}

function getStructureGuidance(structure: string): string {
  const guides: any = {
    'story-led': `
   - Opening story (150 słów)
   - Transition do lekcji
   - Main points (3-5)
   - Każdy: nagłówek + wyjaśnienie + przykład
    `,
    'listicle': `
   - Krótkie intro (50 słów)
   - Numerowana lista (3-7 itemów)
   - Każdy: nagłówek + 2-3 zdania + actionable tip
    `,
    'tutorial': `
   - Problem (100 słów)
   - Solution overview (100 słów)
   - Step-by-step (krok po kroku)
   - Expected results
    `,
    'mixed': `
   - Mix storytelling + lista + tutorial
   - Dostosuj do contentu
    `,
  }

  return guides[structure] || guides['mixed']
}

export async function generateSubjectLines(params: {
  newsletterSummary: string
  topic: string
  audience: string
}) {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: getSubjectLinesPrompt(params),
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    const subjectLines = JSON.parse(content.text)

    return subjectLines
  } catch (error: any) {
    console.error('Subject line generation error:', error)
    throw new Error(`Subject line generation failed: ${error.message}`)
  }
}

function getSubjectLinesPrompt(params: any): string {
  return `
Wygeneruj 10 high-performing email subject lines dla tego newslettera.

NEWSLETTER TOPIC: ${params.topic}
NEWSLETTER SUMMARY: ${params.newsletterSummary}
TARGET AUDIENCE: ${params.audience}

REQUIREMENTS:
Stwórz 10 subject lines używając tych formuł:

1-2. CURIOSITY-DRIVEN:
- Knowledge gap
- Słowa: "prawda", "sekret", "nikt nie mówi"
Przykład: "Sekret SEO o którym Google Ci nie powie"

3-4. NUMBER-BASED:
- Konkretna liczba (3, 5, 7)
- Format: "X [rzeczy] które [rezultat]"
Przykład: "5 AI toolów które obniżyły czas o 60%"

5-6. QUESTION-BASED:
- Pain point question
- Start: "Czy", "Co jeśli", "Dlaczego"
Przykład: "Czy robisz te błędy w newsletterze?"

7-8. BENEFIT-FOCUSED:
- Lead z outcome
- "Jak..." lub result-oriented
Przykład: "Jak zwiększyć listę o 1000 w 30 dni"

9-10. FOMO/URGENCY:
- Fear of missing out
- Słowa: "ostatnia szansa", "zanim", "pilne"
Przykład: "Ostatnia szansa na ten trend"

Dla każdego podaj:
- text (40-60 chars)
- category
- predictedOpenRate (0-1)
- confidence (0-1)
- reasoning (krótko dlaczego działa)
- powerWords (array)
- length
- score (0-10)

OUTPUT: JSON array
[
  {
    "text": "...",
    "category": "curiosity",
    "predictedOpenRate": 0.34,
    "confidence": 0.87,
    "reasoning": "...",
    "powerWords": ["sekret", "nikt"],
    "length": 52,
    "score": 8.7
  },
  ...
]

Zwróć TYLKO JSON.
`.trim()
}
