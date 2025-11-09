import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse body
    const { newsletterId, recipientEmail } = await request.json()

    if (!newsletterId || !recipientEmail) {
      return NextResponse.json(
        { error: 'newsletterId and recipientEmail are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(recipientEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Fetch newsletter
    const { data: newsletter } = await supabase
      .from('newsletters')
      .select('*')
      .eq('id', newsletterId)
      .eq('user_id', user.id)
      .single()

    if (!newsletter) {
      return NextResponse.json(
        { error: 'Newsletter not found' },
        { status: 404 }
      )
    }

    // Send via Resend
    const { data, error: resendError } = await resend.emails.send({
      from: 'NewsletterAI <onboarding@resend.dev>', // Update with your verified domain
      to: recipientEmail,
      subject: `[TEST] ${newsletter.selected_subject_line || newsletter.title || 'Newsletter'}`,
      html: newsletter.content_html || '<p>No content</p>',
    })

    if (resendError) {
      console.error('Resend error:', resendError)
      throw new Error('Failed to send email')
    }

    // Log test email
    await supabase.from('test_emails').insert({
      newsletter_id: newsletterId,
      user_id: user.id,
      recipient_email: recipientEmail,
      subject_line: newsletter.selected_subject_line,
    })

    return NextResponse.json({
      success: true,
      emailId: data?.id,
      message: `Test email sent to ${recipientEmail}`,
    })
  } catch (error: any) {
    console.error('Test email error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send test email' },
      { status: 500 }
    )
  }
}
