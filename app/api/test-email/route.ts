import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function GET() {
  try {
    // Check environment variables
    const apiKey = process.env.RESEND_API_KEY
    const fromEmail = process.env.RESEND_FROM_EMAIL
    const hrEmail = process.env.HR_NOTIFICATION_EMAIL
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'RESEND_API_KEY not found in environment',
        env: { apiKey: '❌', fromEmail, hrEmail }
      }, { status: 500 })
    }

    // Try to send a test email
    const resend = new Resend(apiKey)
    
    const { data, error } = await resend.emails.send({
      from: fromEmail || 'notifications@hbajobs.org',
      to: hrEmail || 'aabdimalik@hotmail.com',
      subject: 'Test Email from HBA Jobs',
      html: '<h1>Test Email</h1><p>If you receive this, email setup is working!</p>',
    })

    if (error) {
      return NextResponse.json({ 
        error: 'Failed to send email',
        details: error,
        env: { apiKey: '✅', fromEmail, hrEmail }
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Test email sent!',
      emailId: data?.id,
      env: { apiKey: '✅', fromEmail, hrEmail }
    })
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 })
  }
}



