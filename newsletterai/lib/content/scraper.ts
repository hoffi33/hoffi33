import * as cheerio from 'cheerio'
import axios from 'axios'

export async function scrapeBlogPost(url: string) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      timeout: 15000,
    })

    const $ = cheerio.load(response.data)

    // Remove unwanted elements
    $('script, style, nav, header, footer, aside, .ad, .advertisement').remove()

    // Try common article selectors
    const selectors = [
      'article',
      '[role="article"]',
      '.post-content',
      '.entry-content',
      '.article-content',
      '.content',
      'main article',
      'main',
    ]

    let content = ''
    let title = ''

    // Try to get title
    title =
      $('h1').first().text().trim() ||
      $('title').text().trim() ||
      $('meta[property="og:title"]').attr('content') ||
      'Untitled'

    // Try to get content from article selectors
    for (const selector of selectors) {
      const el = $(selector)
      if (el.length > 0) {
        content = el.text().trim()
        if (content.length > 200) {
          // Only use if substantial content
          break
        }
      }
    }

    // Fallback: get all paragraphs
    if (!content || content.length < 200) {
      content = $('p')
        .map((_, el) => $(el).text().trim())
        .get()
        .join('\n\n')
    }

    // Clean up whitespace
    content = content
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n\n')
      .trim()

    if (!content) {
      throw new Error('Could not extract content from the page')
    }

    return {
      title,
      content,
    }
  } catch (error: any) {
    console.error('Scraping error:', error)
    throw new Error(`Scraping failed: ${error.message}`)
  }
}
