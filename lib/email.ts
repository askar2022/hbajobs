import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'notifications@hbajobs.org'
const HR_EMAIL = process.env.HR_NOTIFICATION_EMAIL || 'hr@hbajobs.org'

// Email Templates
export const emailTemplates = {
  applicationSubmitted: (applicantName: string, jobTitle: string, schoolSite: string) => ({
    subject: `Application Received - ${jobTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Application Submitted!</h1>
            </div>
            <div class="content">
              <p>Dear ${applicantName},</p>
              <p>Thank you for applying to the <strong>${jobTitle}</strong> position at <strong>${schoolSite}</strong>.</p>
              <p>We have received your application and our hiring team will review it shortly. You will receive an email notification when there are updates to your application status.</p>
              <p>You can track your application status at any time:</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/my-applications" class="button">View My Applications</a>
              <p>If you have any questions, please don't hesitate to contact our HR team.</p>
              <p>Best regards,<br>HBA Jobs Team</p>
            </div>
            <div class="footer">
              <p>Harvest, Wakanda, and Sankofa Schools</p>
              <p>© ${new Date().getFullYear()} HBA Jobs. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  statusUpdate: (applicantName: string, jobTitle: string, newStatus: string, comment?: string) => ({
    subject: `Application Update - ${jobTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .status-badge { display: inline-block; padding: 8px 16px; background: #dbeafe; color: #1e40af; border-radius: 20px; font-weight: bold; margin: 10px 0; }
            .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
            .comment-box { background: white; padding: 15px; border-left: 4px solid #2563eb; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Application Status Update</h1>
            </div>
            <div class="content">
              <p>Dear ${applicantName},</p>
              <p>There's an update on your application for <strong>${jobTitle}</strong>.</p>
              <p>Your application status has been changed to:</p>
              <div class="status-badge">${newStatus}</div>
              ${comment ? `<div class="comment-box"><strong>Note from Hiring Team:</strong><br>${comment}</div>` : ''}
              <p>You can view the full details of your application:</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/my-applications" class="button">View Application Details</a>
              <p>Best regards,<br>HBA Jobs Team</p>
            </div>
            <div class="footer">
              <p>Harvest, Wakanda, and Sankofa Schools</p>
              <p>© ${new Date().getFullYear()} HBA Jobs. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  jobOffer: (applicantName: string, jobTitle: string, schoolSite: string, startDate: string, salary?: string) => ({
    subject: `🎉 Job Offer - ${jobTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .details-box { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #10b981; }
            .detail-row { margin: 10px 0; }
            .detail-label { font-weight: bold; color: #4b5563; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
            .celebration { font-size: 48px; text-align: center; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎊 Congratulations!</h1>
            </div>
            <div class="content">
              <div class="celebration">🎉</div>
              <p>Dear ${applicantName},</p>
              <p>We are thrilled to extend an offer for the <strong>${jobTitle}</strong> position at <strong>${schoolSite}</strong>!</p>
              <p>After careful consideration of your application and interview, we are confident that you will be an excellent addition to our team.</p>
              <div class="details-box">
                <h3 style="margin-top: 0; color: #10b981;">Offer Details:</h3>
                <div class="detail-row">
                  <span class="detail-label">Position:</span> ${jobTitle}
                </div>
                <div class="detail-row">
                  <span class="detail-label">School:</span> ${schoolSite}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Proposed Start Date:</span> ${startDate}
                </div>
                ${salary ? `<div class="detail-row"><span class="detail-label">Salary:</span> ${salary}</div>` : ''}
              </div>
              <p><strong>Next Steps:</strong></p>
              <ul>
                <li>Review the complete offer details</li>
                <li>Contact HR with any questions</li>
                <li>Respond to accept or discuss the offer</li>
              </ul>
              <p>We hope you will join the HBA family and are looking forward to working with you!</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/my-applications" class="button">View Application</a>
              <p>Warm regards,<br>HBA Jobs Hiring Team</p>
            </div>
            <div class="footer">
              <p>Harvest, Wakanda, and Sankofa Schools</p>
              <p>© ${new Date().getFullYear()} HBA Jobs. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  welcomeHired: (applicantName: string, jobTitle: string, schoolSite: string, startDate: string) => ({
    subject: `Welcome to HBA! - ${jobTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .welcome-box { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px; border-radius: 6px; margin: 20px 0; text-align: center; }
            .button { display: inline-block; padding: 12px 24px; background: #8b5cf6; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .checklist { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .checklist-item { margin: 10px 0; padding: 10px; border-left: 3px solid #8b5cf6; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌟 Welcome to the HBA Family!</h1>
            </div>
            <div class="content">
              <div class="welcome-box">
                <h2 style="margin: 0; color: #92400e;">Welcome Aboard, ${applicantName}!</h2>
              </div>
              <p>Dear ${applicantName},</p>
              <p>Congratulations on officially joining <strong>${schoolSite}</strong> as our new <strong>${jobTitle}</strong>!</p>
              <p>We're excited to have you on our team and look forward to the contributions you'll make to our students and community.</p>
              
              <div class="checklist">
                <h3 style="margin-top: 0; color: #8b5cf6;">📋 Before Your Start Date (${startDate}):</h3>
                <div class="checklist-item">✓ Complete onboarding paperwork</div>
                <div class="checklist-item">✓ Submit required documents (ID, certifications, etc.)</div>
                <div class="checklist-item">✓ Arrange for background check (if not completed)</div>
                <div class="checklist-item">✓ Review employee handbook</div>
              </div>

              <p><strong>What to Expect on Your First Day:</strong></p>
              <ul>
                <li>Orientation with HR team</li>
                <li>Meet your colleagues and supervisors</li>
                <li>Workspace setup and IT access</li>
                <li>Introduction to school policies and procedures</li>
              </ul>

              <p>If you have any questions before your start date, please don't hesitate to reach out to our HR team.</p>
              
              <p>We're thrilled to have you join us in making a difference in our students' lives!</p>
              
              <p>Best regards,<br><strong>The HBA Team</strong></p>
            </div>
            <div class="footer">
              <p>Harvest, Wakanda, and Sankofa Schools</p>
              <p>© ${new Date().getFullYear()} HBA Jobs. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  interviewScheduled: (applicantName: string, jobTitle: string, interviewDetails: any) => ({
    subject: `Interview Scheduled - ${jobTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .details-box { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .detail-row { margin: 10px 0; }
            .detail-label { font-weight: bold; color: #4b5563; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Interview Scheduled!</h1>
            </div>
            <div class="content">
              <p>Dear ${applicantName},</p>
              <p>Great news! Your interview for the <strong>${jobTitle}</strong> position has been scheduled.</p>
              <div class="details-box">
                <div class="detail-row">
                  <span class="detail-label">Interview Type:</span> ${interviewDetails.stage}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date & Time:</span> ${new Date(interviewDetails.scheduled_at).toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                ${interviewDetails.location ? `<div class="detail-row"><span class="detail-label">Location:</span> ${interviewDetails.location}</div>` : ''}
                ${interviewDetails.join_link ? `<div class="detail-row"><span class="detail-label">Join Link:</span> <a href="${interviewDetails.join_link}">${interviewDetails.join_link}</a></div>` : ''}
              </div>
              <p>Please make sure to arrive on time and prepare for the interview. Good luck!</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/my-applications" class="button">View Application</a>
              <p>Best regards,<br>HBA Jobs Team</p>
            </div>
            <div class="footer">
              <p>Harvest, Wakanda, and Sankofa Schools</p>
              <p>© ${new Date().getFullYear()} HBA Jobs. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  hrNotification: (applicantName: string, applicantEmail: string, jobTitle: string, schoolSite: string, applicationId: string) => ({
    subject: `New Application - ${jobTitle} at ${schoolSite}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .details-box { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .detail-row { margin: 10px 0; }
            .detail-label { font-weight: bold; color: #4b5563; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📋 New Application Received</h1>
            </div>
            <div class="content">
              <p>Hello HR Team,</p>
              <p>A new application has been submitted for the <strong>${jobTitle}</strong> position at <strong>${schoolSite}</strong>.</p>
              <div class="details-box">
                <div class="detail-row">
                  <span class="detail-label">Applicant:</span> ${applicantName}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email:</span> ${applicantEmail}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Position:</span> ${jobTitle}
                </div>
                <div class="detail-row">
                  <span class="detail-label">School:</span> ${schoolSite}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Submitted:</span> ${new Date().toLocaleString()}
                </div>
              </div>
              <p>Please review the application at your earliest convenience.</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/applicants/${applicationId}" class="button">Review Application</a>
              <p>Best regards,<br>HBA Jobs System</p>
            </div>
            <div class="footer">
              <p>This is an automated notification from HBA Jobs</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
}

// Send email function
export async function sendEmail(to: string | string[], subject: string, html: string) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured. Skipping email send.')
      return { success: false, error: 'Email not configured' }
    }

    const recipients = Array.isArray(to) ? to : [to]

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: recipients,
      subject,
      html,
    })

    if (error) {
      console.error('Email send error:', error)
      return { success: false, error }
    }

    console.log('Email sent successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Email send exception:', error)
    return { success: false, error }
  }
}

// Send application submitted emails
export async function sendApplicationSubmittedEmails(
  applicantEmail: string,
  applicantName: string,
  jobTitle: string,
  schoolSite: string,
  applicationId: string
) {
  // Send confirmation to applicant
  const applicantTemplate = emailTemplates.applicationSubmitted(applicantName, jobTitle, schoolSite)
  await sendEmail(applicantEmail, applicantTemplate.subject, applicantTemplate.html)

  // Send notification to HR
  const hrTemplate = emailTemplates.hrNotification(applicantName, applicantEmail, jobTitle, schoolSite, applicationId)
  await sendEmail(HR_EMAIL, hrTemplate.subject, hrTemplate.html)
}

// Send status update email
export async function sendStatusUpdateEmail(
  applicantEmail: string,
  applicantName: string,
  jobTitle: string,
  newStatus: string,
  comment?: string
) {
  const template = emailTemplates.statusUpdate(applicantName, jobTitle, newStatus, comment)
  await sendEmail(applicantEmail, template.subject, template.html)
}

// Send interview scheduled email
export async function sendInterviewScheduledEmail(
  applicantEmail: string,
  applicantName: string,
  jobTitle: string,
  interviewDetails: any
) {
  const template = emailTemplates.interviewScheduled(applicantName, jobTitle, interviewDetails)
  await sendEmail(applicantEmail, template.subject, template.html)
}

// Send job offer email
export async function sendJobOfferEmail(
  applicantEmail: string,
  applicantName: string,
  jobTitle: string,
  schoolSite: string,
  startDate: string,
  salary?: string
) {
  const template = emailTemplates.jobOffer(applicantName, jobTitle, schoolSite, startDate, salary)
  await sendEmail(applicantEmail, template.subject, template.html)
}

// Send welcome/hired email
export async function sendWelcomeEmail(
  applicantEmail: string,
  applicantName: string,
  jobTitle: string,
  schoolSite: string,
  startDate: string
) {
  const template = emailTemplates.welcomeHired(applicantName, jobTitle, schoolSite, startDate)
  await sendEmail(applicantEmail, template.subject, template.html)
}

