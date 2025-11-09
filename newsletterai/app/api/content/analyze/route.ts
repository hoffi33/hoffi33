import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { analyzeContent } from '@/lib/ai/claude'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { contentSourceId } = await request.json()

    if (!contentSourceId) {
      return NextResponse.json(
        { error: 'contentSourceId is required' },
        { status: 400 }
      )
    }

    // Fetch content source
    const { data: contentSource, error: fetchError } = await supabase
      .from('content_sources')
      .select('*')
      .eq('id', contentSourceId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !contentSource) {
      return NextResponse.json(
        { error: 'Content source not found' },
        { status: 404 }
      )
    }

    // Analyze content with Claude
    const analysis = await analyzeContent(contentSource.transcript!)

    // Save analysis to DB
    const { data: savedAnalysis, error: saveError } = await supabase
      .from('content_analyses')
      .insert({
        content_source_id: contentSourceId,
        main_topic: analysis.mainTopic,
        sub_topics: analysis.subTopics,
        key_takeaways: analysis.keyTakeaways,
        quotes: analysis.quotes,
        target_audience: analysis.targetAudience,
        pain_points: analysis.painPoints,
        suggested_ctas: analysis.suggestedCTAs,
        sentiment: analysis.sentiment,
        difficulty: analysis.difficulty,
        full_analysis: analysis as any,
      })
      .select()
      .single()

    if (saveError) {
      console.error('Save error:', saveError)
      throw new Error('Failed to save analysis')
    }

    return NextResponse.json({
      success: true,
      analysisId: savedAnalysis.id,
      analysis: savedAnalysis,
    })
  } catch (error: any) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: error.message || 'Analysis failed' },
      { status: 500 }
    )
  }
}
