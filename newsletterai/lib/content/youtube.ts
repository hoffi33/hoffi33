import { YoutubeTranscript } from 'youtube-transcript'

export async function fetchYouTubeTranscript(url: string) {
  try {
    // Extract video ID
    const videoId = extractVideoId(url)
    if (!videoId) {
      throw new Error('Invalid YouTube URL')
    }

    // Fetch transcript
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId)

    // Combine transcript pieces
    const fullText = transcriptItems.map(item => item.text).join(' ')

    // Calculate approximate duration
    const duration = Math.ceil(transcriptItems.length / 150) // rough estimate

    // Get video title (simplified - in production you'd use YouTube Data API)
    const title = `YouTube Video ${videoId}`

    return {
      transcript: fullText,
      title,
      videoId,
      duration,
    }
  } catch (error: any) {
    console.error('YouTube fetch error:', error)
    throw new Error(`YouTube import failed: ${error.message}`)
  }
}

function extractVideoId(url: string): string | null {
  // Support multiple YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}
