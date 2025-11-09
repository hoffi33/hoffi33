'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Download, Mail, Copy, FileText } from 'lucide-react'
import { markdownToPlainText } from '@/lib/utils/markdown'

interface ExportOptionsProps {
  newsletterId: string
  html: string
  markdown: string
}

export function ExportOptions({
  newsletterId,
  html,
  markdown,
}: ExportOptionsProps) {
  const [testEmailOpen, setTestEmailOpen] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [sending, setSending] = useState(false)

  const copyToClipboard = async (text: string, format: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert(`${format} skopiowany do schowka!`)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  const downloadHTML = () => {
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter-${newsletterId}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const sendTestEmail = async () => {
    if (!testEmail) return

    setSending(true)
    try {
      const response = await fetch('/api/newsletter/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newsletterId,
          recipientEmail: testEmail,
        }),
      })

      if (!response.ok) throw new Error('Failed to send')

      alert('Test email wysłany!')
      setTestEmailOpen(false)
      setTestEmail('')
    } catch (err) {
      alert('Błąd podczas wysyłania')
      console.error('Send error:', err)
    } finally {
      setSending(false)
    }
  }

  const plainText = markdown ? markdownToPlainText(markdown) : ''

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            Export <Download className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => copyToClipboard(html, 'HTML')}>
            <Copy className="mr-2 h-4 w-4" />
            Copy HTML
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => copyToClipboard(markdown, 'Markdown')}>
            <FileText className="mr-2 h-4 w-4" />
            Copy Markdown
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => copyToClipboard(plainText, 'Plain text')}>
            <FileText className="mr-2 h-4 w-4" />
            Copy Plain Text
          </DropdownMenuItem>

          <DropdownMenuItem onClick={downloadHTML}>
            <Download className="mr-2 h-4 w-4" />
            Download HTML
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setTestEmailOpen(true)}>
            <Mail className="mr-2 h-4 w-4" />
            Send Test Email
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Test Email Dialog */}
      <Dialog open={testEmailOpen} onOpenChange={setTestEmailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Wyślij test email</DialogTitle>
            <DialogDescription>
              Wpisz adres email na który chcesz wysłać testowego newslettera
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="test-email">Email</Label>
              <Input
                id="test-email"
                type="email"
                placeholder="twoj@email.pl"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
            </div>

            <Button
              onClick={sendTestEmail}
              disabled={!testEmail || sending}
              className="w-full"
            >
              {sending ? 'Wysyłam...' : 'Wyślij test'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
