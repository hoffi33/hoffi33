import { marked } from 'marked'

export function markdownToHtml(markdown: string): string {
  // Configure marked options
  marked.setOptions({
    breaks: true,
    gfm: true,
  })

  // Convert markdown to HTML
  const rawHtml = marked.parse(markdown) as string

  // Add email-safe inline styles
  return addEmailStyles(rawHtml)
}

function addEmailStyles(html: string): string {
  // Wrap in email-safe container
  const styledHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.25;
      color: #1a1a1a;
    }
    h1 { font-size: 32px; }
    h2 { font-size: 24px; }
    h3 { font-size: 20px; }
    h4 { font-size: 16px; }
    p {
      margin-top: 0;
      margin-bottom: 16px;
      font-size: 16px;
      line-height: 1.6;
    }
    a {
      color: #0066cc;
      text-decoration: underline;
    }
    a:hover {
      color: #0052a3;
    }
    strong {
      font-weight: 600;
      color: #000000;
    }
    em {
      font-style: italic;
    }
    ul, ol {
      margin-top: 0;
      margin-bottom: 16px;
      padding-left: 24px;
    }
    li {
      margin-bottom: 8px;
    }
    blockquote {
      margin: 16px 0;
      padding-left: 16px;
      border-left: 4px solid #ddd;
      color: #555555;
      font-style: italic;
    }
    code {
      background-color: #f5f5f5;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 14px;
    }
    pre {
      background-color: #f5f5f5;
      padding: 16px;
      border-radius: 6px;
      overflow-x: auto;
    }
    pre code {
      background-color: transparent;
      padding: 0;
    }
    hr {
      border: none;
      border-top: 1px solid #e1e4e8;
      margin: 24px 0;
    }
    img {
      max-width: 100%;
      height: auto;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 16px;
    }
    table th, table td {
      padding: 8px 12px;
      border: 1px solid #ddd;
      text-align: left;
    }
    table th {
      background-color: #f5f5f5;
      font-weight: 600;
    }
  </style>
</head>
<body>
${html}
</body>
</html>
  `.trim()

  return styledHtml
}

export function markdownToPlainText(markdown: string): string {
  // Remove markdown formatting
  return markdown
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links, keep text
    .replace(/`(.+?)`/g, '$1') // Remove inline code
    .replace(/>\s/g, '') // Remove blockquotes
    .replace(/[-*+]\s/g, '') // Remove list markers
    .replace(/\d+\.\s/g, '') // Remove numbered lists
    .trim()
}

export function generateEmailHtml(params: {
  subject: string
  content: string
  preheader?: string
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${params.subject}</title>
  ${params.preheader ? `<style>.preheader { display: none !important; }</style>` : ''}
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  ${params.preheader ? `<div class="preheader" style="display: none; max-height: 0; overflow: hidden;">${params.preheader}</div>` : ''}

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px 30px;">
              ${params.content}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
