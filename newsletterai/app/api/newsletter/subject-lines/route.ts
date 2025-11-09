import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateSubjectLines } from '@/lib/ai/claude'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { newsletterId } = await request.json()

    if (!newsletterId) {
      return NextResponse.json(
        { error: 'newsletterId is required' },
        { status: 400 }
      )
    }

    // Fetch newsletter and analysis
    const { data: newsletter } = await supabase
      .from('newsletters')
      .select('*, content_analyses(*)')
      .eq('id', newsletterId)
      .eq('user_id', user.id)
      .single()

    if (!newsletter) {
      return NextResponse.json(
        { error: 'Newsletter not found' },
        { status: 404 }
      )
    }

    // Generate subject lines with Claude
    const subjectLines = await generateSubjectLines({
      newsletterSummary: newsletter.content_markdown?.substring(0, 500) || '',
      topic: newsletter.title || 'Newsletter',
      audience: (newsletter as any).content_analyses?.target_audience || 'general',
    })

    // Update newsletter with new subject lines
    await supabase
      .from('newsletters')
      .update({
        subject_lines: subjectLines,
      })
      .eq('id', newsletterId)

    return NextResponse.json({
      success: true,
      subjectLines,
    })
  } catch (error: any) {
    console.error('Subject line generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Subject line generation failed' },
      { status: 500 }
    )
  }
}
