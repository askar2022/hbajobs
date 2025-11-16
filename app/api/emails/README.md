# Email Notifications API

This directory is for email notification endpoints. The application structure supports email notifications, but you'll need to implement the actual email sending logic based on your preferred email service.

## Recommended Email Services

- **Resend** (https://resend.com) - Simple, developer-friendly
- **SendGrid** (https://sendgrid.com) - Robust, feature-rich
- **AWS SES** (https://aws.amazon.com/ses/) - Cost-effective at scale
- **Postmark** (https://postmarkapp.com) - Great deliverability

## Email Templates Needed

1. **Application Received** - Sent to applicant when they submit an application
2. **Application Status Update** - Sent when application status changes
3. **Interview Scheduled** - Sent to applicant and interviewers
4. **Interview Reminder** - Sent 24 hours before interview
5. **Offer Sent** - Sent to applicant with offer details
6. **Offer Accepted** - Sent to HR, payroll, IT when offer is accepted
7. **Rejection** - Sent when application is rejected

## Example Implementation with Resend

```typescript
// app/api/emails/send/route.ts
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const { to, subject, html, text } = await request.json()
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'HBA Jobs <noreply@yourdomain.com>',
      to,
      subject,
      html,
      text,
    })

    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
```

## Integration Points

Add email sending calls in:
- `app/apply/[jobId]/page.tsx` - After application submission
- `app/api/applications/[applicationId]/status/route.ts` - On status changes
- `app/admin/interviews/schedule/page.tsx` - After scheduling interview
- Offer creation endpoints (to be implemented)

