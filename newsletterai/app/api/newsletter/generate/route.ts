import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateNewsletter } from '@/lib/ai/claude'
import { markdownToHtml } from '@/lib/utils/markdown'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { contentSourceId, analysisId, tone, length, structure } =
      await request.json()

    if (!contentSourceId || !analysisId) {
      return NextResponse.json(
        { error: 'contentSourceId and analysisId are required' },
        { status: 400 }
      )
    }

    // Fetch content source
    const { data: contentSource } = await supabase
      .from('content_sources')
      .select('*')
      .eq('id', contentSourceId)
      .eq('user_id', user.id)
      .single()

    if (!contentSource) {
      return NextResponse.json(
        { error: 'Content source not found' },
        { status: 404 }
      )
    }

    // Fetch analysis
    const { data: analysis } = await supabase
      .from('content_analyses')
      .select('*')
      .eq('id', analysisId)
      .single()

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      )
    }

    // Generate newsletter with Claude
    const newsletterData = await generateNewsletter({
      transcript: contentSource.transcript!,
      analysis: analysis.full_analysis as any,
      tone: tone || 'professional',
      length: length || 'standard',
      structure: structure || 'mixed',
    })

    // Convert markdown to HTML
    const contentHtml = markdownToHtml(newsletterData.content)

    // Calculate reading time
    const wordCount = newsletterData.metadata?.wordCount ||
      newsletterData.content.split(/\s+/).filter(Boolean).length
    const readingTime = Math.ceil(wordCount / 200)

    // Save newsletter to database
    const { data: newsletter, error: saveError } = await supabase
      .from('newsletters')
      .insert({
        user_id: user.id,
        content_source_id: contentSourceId,
        analysis_id: analysisId,
        title: contentSource.title,
        subject_lines: newsletterData.subjectLines,
        selected_subject_line: newsletterData.subjectLines?.[0]?.text || null,
        content_markdown: newsletterData.content,
        content_html: contentHtml,
        tone,
        length,
        structure,
        word_count: wordCount,
        reading_time_minutes: readingTime,
        status: 'draft',
        metadata: newsletterData.metadata,
      })
      .select()
      .single()

    if (saveError) {
      console.error('Save newsletter error:', saveError)
      throw new Error('Failed to save newsletter')
    }

    // Track event
    await supabase.from('usage_events').insert({
      user_id: user.id,
      event_type: 'newsletter_generated',
      metadata: { newsletter_id: newsletter.id },
    })

    return NextResponse.json({
      success: true,
      newsletterId: newsletter.id,
      newsletter,
    })
  } catch (error: any) {
    console.error('Newsletter generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Newsletter generation failed' },
      { status: 500 }
    )
  }
}
