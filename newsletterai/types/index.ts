// Content types
export type ContentType = 'youtube' | 'podcast' | 'blog' | 'text'

// Newsletter settings
export type NewsletterTone = 'professional' | 'friendly' | 'casual' | 'educational'
export type NewsletterLength = 'quick' | 'standard' | 'deep'
export type NewsletterStructure = 'story-led' | 'listicle' | 'tutorial' | 'mixed'

// Plan tiers
export type PlanTier = 'free' | 'basic' | 'pro' | 'agency'

// Newsletter status
export type NewsletterStatus = 'draft' | 'ready' | 'archived'

// Subject line types
export interface SubjectLine {
  text: string
  type: 'curiosity' | 'number' | 'question' | 'benefit' | 'fomo'
  predictedOpenRate: number
  confidence?: number
  reasoning?: string
  powerWords?: string[]
  length?: number
  score?: number
}

// Content analysis
export interface ContentAnalysis {
  mainTopic: string
  subTopics: string[]
  keyTakeaways: string[]
  quotes: string[]
  examples?: Array<{
    type: 'case_study' | 'statistic' | 'example'
    description: string
  }>
  targetAudience: string
  audienceLevel: 'beginner' | 'intermediate' | 'advanced'
  painPoints: string[]
  suggestedCTAs: string[]
  sentiment: 'educational' | 'inspirational' | 'entertaining' | 'authoritative'
  difficulty: 'easy' | 'medium' | 'hard'
}

// Newsletter metadata
export interface NewsletterMetadata {
  wordCount: number
  readingTimeMinutes: number
  keyTopics: string[]
  sentimentScore: number
  engagementPrediction: 'low' | 'medium' | 'high'
}
