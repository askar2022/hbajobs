import { NextRequest, NextResponse } from 'next/server'
import { sendInterviewScheduledEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { applicantEmail, applicantName, jobTitle, interviewDetails } = await request.json()

    // Send interview scheduled email
    await sendInterviewScheduledEmail(
      applicantEmail,
      applicantName,
      jobTitle,
      interviewDetails
    )

    return NextResponse.json({ success: true, message: 'Interview scheduled email sent' })
  } catch (error: any) {
    console.error('Error sending interview scheduled email:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

