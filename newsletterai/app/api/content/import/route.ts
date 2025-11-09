import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { fetchYouTubeTranscript } from '@/lib/content/youtube'
import { transcribeAudio, transcribeAudioFromUrl } from '@/lib/ai/whisper'
import { scrapeBlogPost } from '@/lib/content/scraper'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Check auth
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check usage limit
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('usage_count, usage_limit')
      .eq('id', user.id)
      .single()

    if (!profile || profile.usage_count >= profile.usage_limit) {
      return NextResponse.json(
        { error: 'Usage limit exceeded. Please upgrade your plan.' },
        { status: 403 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const type = formData.get('type') as string
    const input = formData.get('input') as string
    const file = formData.get('file') as File | null

    if (!type) {
      return NextResponse.json({ error: 'Type is required' }, { status: 400 })
    }

    let transcript = ''
    let title = ''
    let metadata: any = {}
    let duration = 0

    // Process based on type
    switch (type) {
      case 'youtube':
        if (!input) {
          return NextResponse.json(
            { error: 'YouTube URL is required' },
            { status: 400 }
          )
        }
        const ytData = await fetchYouTubeTranscript(input)
        transcript = ytData.transcript
        title = ytData.title
        duration = ytData.duration
        metadata = { videoId: ytData.videoId, duration: ytData.duration }
        break

      case 'podcast':
        if (file) {
          // Handle file upload
          const transcription = await transcribeAudio(file)
          transcript = transcription.text
          title = file.name.replace(/\.[^/.]+$/, '')
          duration = transcription.duration
          metadata = { filename: file.name, duration: transcription.duration }
        } else if (input) {
          // Handle podcast URL
          const transcription = await transcribeAudioFromUrl(input)
          transcript = transcription.text
          title = new URL(input).pathname.split('/').pop() || 'Podcast'
          duration = transcription.duration
          metadata = { url: input, duration: transcription.duration }
        } else {
          return NextResponse.json(
            { error: 'File or URL is required' },
            { status: 400 }
          )
        }
        break

      case 'blog':
        if (!input) {
          return NextResponse.json(
            { error: 'Blog URL is required' },
            { status: 400 }
          )
        }
        const blogData = await scrapeBlogPost(input)
        transcript = blogData.content
        title = blogData.title
        metadata = { url: input }
        break

      case 'text':
        if (!input) {
          return NextResponse.json(
            { error: 'Text content is required' },
            { status: 400 }
          )
        }
        transcript = input
        title = 'Pasted content'
        metadata = { source: 'text' }
        break

      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    // Validate transcript
    if (!transcript || transcript.length < 50) {
      return NextResponse.json(
        { error: 'Content is too short or could not be extracted' },
        { status: 400 }
      )
    }

    // Calculate word count
    const wordCount = transcript.split(/\s+/).filter(Boolean).length

    // Save to database
    const { data: contentSource, error: dbError } = await supabase
      .from('content_sources')
      .insert({
        user_id: user.id,
        type,
        url: input || null,
        title,
        transcript,
        metadata,
        word_count: wordCount,
        duration_minutes: duration,
        processed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error('Failed to save content')
    }

    // Increment usage
    await supabase
      .from('user_profiles')
      .update({ usage_count: profile.usage_count + 1 })
      .eq('id', user.id)

    // Track event
    await supabase.from('usage_events').insert({
      user_id: user.id,
      event_type: 'content_imported',
      metadata: { type, content_source_id: contentSource.id },
    })

    return NextResponse.json({
      success: true,
      contentSourceId: contentSource.id,
      title: contentSource.title,
      wordCount: contentSource.word_count,
    })
  } catch (error: any) {
    console.error('Import error:', error)
    return NextResponse.json(
      { error: error.message || 'Import failed' },
      { status: 500 }
    )
  }
}
