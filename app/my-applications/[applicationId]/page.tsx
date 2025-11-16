import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { formatDate, formatDateTime } from '@/lib/utils'
import { notFound } from 'next/navigation'

const statusColors: Record<string, string> = {
  Draft: 'bg-gray-100 text-gray-800',
  Submitted: 'bg-blue-100 text-blue-800',
  'Under Review': 'bg-yellow-100 text-yellow-800',
  'Phone Screen': 'bg-purple-100 text-purple-800',
  Interview: 'bg-indigo-100 text-indigo-800',
  'Reference Check': 'bg-pink-100 text-pink-800',
  Offered: 'bg-green-100 text-green-800',
  Hired: 'bg-green-200 text-green-900',
  Rejected: 'bg-red-100 text-red-800',
  Withdrawn: 'bg-gray-100 text-gray-800',
}

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ applicationId: string }>
}) {
  const { applicationId } = await params
  const user = await requireAuth()
  const supabase = await createClient()

  // Get application with related data
  const { data: application } = await supabase
    .from('applications')
    .select(`
      *,
      job_postings (*),
      applicants (*),
      application_stage_history (
        *,
        users (name)
      ),
      interviews (
        *,
        interview_feedback (
          *,
          users (name)
        )
      )
    `)
    .eq('id', applicationId)
    .single()

  if (!application) {
    notFound()
  }

  // Verify user owns this application
  const { data: applicant } = await supabase
    .from('applicants')
    .select('*')
    .eq('email', user.email)
    .single()

  if (application.applicant_id !== applicant?.id) {
    notFound()
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {application.job_postings?.title}
            </h1>
            <p className="text-gray-600">{application.job_postings?.school_site}</p>
          </div>

          {/* Status */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Application Status</h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  statusColors[application.status] || statusColors.Draft
                }`}
              >
                {application.status}
              </span>
            </div>
          </div>

          {/* Timeline */}
          {application.application_stage_history && application.application_stage_history.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
              <div className="flow-root">
                <ul className="-mb-8">
                  {application.application_stage_history
                    .sort((a: any, b: any) => new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime())
                    .map((history: any, idx: number) => (
                      <li key={history.id}>
                        <div className="relative pb-8">
                          {idx !== application.application_stage_history.length - 1 && (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          )}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center ring-8 ring-white">
                                <span className="h-2 w-2 rounded-full bg-white"></span>
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-500">
                                  Status changed to <span className="font-medium">{history.to_status}</span>
                                </p>
                                {history.comment && (
                                  <p className="text-sm text-gray-400 mt-1">{history.comment}</p>
                                )}
                                {history.users && (
                                  <p className="text-xs text-gray-400 mt-1">
                                    by {history.users.name}
                                  </p>
                                )}
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                {formatDateTime(history.changed_at)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          )}

          {/* Interviews */}
          {application.interviews && application.interviews.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Interviews</h2>
              <div className="space-y-4">
                {application.interviews.map((interview: any) => (
                  <div key={interview.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{interview.stage}</h3>
                      <span className="text-sm text-gray-500">{interview.status}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Scheduled: {formatDateTime(interview.scheduled_at)}
                    </p>
                    {interview.location && (
                      <p className="text-sm text-gray-600">Location: {interview.location}</p>
                    )}
                    {interview.join_link && (
                      <a
                        href={interview.join_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        Join Interview →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Application Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Details</h2>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Years of Experience</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {application.years_experience || 'Not specified'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Certifications</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {application.certifications || 'None listed'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Submitted</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {application.submitted_at
                    ? formatDateTime(application.submitted_at)
                    : formatDateTime(application.created_at)}
                </dd>
              </div>
              {application.resume_url && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Resume</dt>
                  <dd className="mt-1 text-sm">
                    <a
                      href={application.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      View Resume →
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

