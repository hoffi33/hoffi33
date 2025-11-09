import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function transcribeAudio(file: File) {
  try {
    // Convert File to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Create temp directory if it doesn't exist
    const tempDir = path.join(process.cwd(), 'tmp')
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    // Save temporarily
    const tempPath = path.join(tempDir, `${Date.now()}-${file.name}`)
    fs.writeFileSync(tempPath, buffer)

    try {
      // Transcribe
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(tempPath),
        model: 'whisper-1',
        language: 'pl', // or auto-detect by omitting this
      })

      // Calculate duration estimate
      const duration = Math.ceil(transcription.text.split(/\s+/).length / 150)

      return {
        text: transcription.text,
        duration,
      }
    } finally {
      // Clean up temp file
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath)
      }
    }
  } catch (error: any) {
    console.error('Whisper transcription error:', error)
    throw new Error(`Transcription failed: ${error.message}`)
  }
}

export async function transcribeAudioFromUrl(url: string) {
  try {
    // Download audio file
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to download audio: ${response.statusText}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Create temp directory if it doesn't exist
    const tempDir = path.join(process.cwd(), 'tmp')
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    // Get file extension from URL or default to mp3
    const ext = path.extname(new URL(url).pathname) || '.mp3'
    const tempPath = path.join(tempDir, `${Date.now()}${ext}`)
    fs.writeFileSync(tempPath, buffer)

    try {
      // Transcribe
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(tempPath),
        model: 'whisper-1',
        language: 'pl',
      })

      const duration = Math.ceil(transcription.text.split(/\s+/).length / 150)

      return {
        text: transcription.text,
        duration,
      }
    } finally {
      // Clean up
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath)
      }
    }
  } catch (error: any) {
    console.error('Whisper URL transcription error:', error)
    throw new Error(`URL transcription failed: ${error.message}`)
  }
}
