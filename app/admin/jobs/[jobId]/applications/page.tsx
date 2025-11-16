import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
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

export default async function JobApplicationsPage({
  params,
}: {
  params: Promise<{ jobId: string }>
}) {
  const { jobId } = await params
  const user = await requireRole(['HR', 'Admin', 'Principal', 'HiringManager'])
  const supabase = await createClient()

  // Get job posting
  const { data: job } = await supabase
    .from('job_postings')
    .select('*')
    .eq('id', jobId)
    .single()

  if (!job) {
    notFound()
  }

  // Check access
  if (!['HR', 'Admin'].includes(user.role) && job.hiring_manager_id !== user.id) {
    notFound()
  }

  // Get applications
  const { data: applications } = await supabase
    .from('applications')
    .select(`
      *,
      applicants (*)
    `)
    .eq('job_posting_id', jobId)
    .order('created_at', { ascending: false })

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href="/admin/jobs"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium mb-4 inline-block"
          >
            ← Back to Jobs
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
              <p className="text-gray-600 mt-2">
                {job.title} • {job.school_site} • {job.department}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {applications?.length || 0} Total
            </div>
          </div>
        </div>

        {applications && applications.length > 0 ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Certifications
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((app: any) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {app.applicants?.first_name} {app.applicants?.last_name}
                      </div>
                      <div className="text-sm text-gray-500">{app.applicants?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {app.years_experience ? `${app.years_experience} years` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {app.certifications || 'None'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          statusColors[app.status] || statusColors.Draft
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {app.submitted_at ? formatDate(app.submitted_at) : formatDate(app.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/admin/applicants/${app.id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-12 text-center">
            <p className="text-gray-500 text-lg">No applications received yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

