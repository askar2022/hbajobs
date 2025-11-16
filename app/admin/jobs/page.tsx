import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

const statusColors: Record<string, string> = {
  Draft: 'bg-gray-100 text-gray-800',
  Published: 'bg-green-100 text-green-800',
  Closed: 'bg-red-100 text-red-800',
}

export default async function AdminJobsPage() {
  const user = await requireRole(['HR', 'Admin', 'Principal', 'HiringManager'])
  const supabase = await createClient()

  // Filter by school if user is not HR/Admin
  let query = supabase.from('job_postings').select('*').order('created_at', { ascending: false })

  if (!['HR', 'Admin'].includes(user.role)) {
    query = query.eq('school_site', user.school_site)
  }

  const { data: jobs } = await query

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Navigation */}
        {['HR', 'Admin'].includes(user.role) && (
          <div className="mb-6 flex gap-2">
            <Link
              href="/admin"
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              🏠 Dashboard
            </Link>
            <Link
              href="/admin/jobs"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
            >
              📋 Job Postings
            </Link>
            <Link
              href="/admin/users"
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              👥 User Management
            </Link>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Postings</h1>
            <p className="text-gray-600 mt-1">Create and manage job listings</p>
          </div>
          {['HR', 'Admin'].includes(user.role) && (
            <Link
              href="/admin/jobs/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Create New Job
            </Link>
          )}
        </div>

        {jobs && jobs.length > 0 ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    School
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{job.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.school_site}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.department || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          statusColors[job.posting_status] || statusColors.Draft
                        }`}
                      >
                        {job.posting_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(job.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        href={`/admin/jobs/${job.id}/applications`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        View Applications
                      </Link>
                      {['HR', 'Admin'].includes(user.role) && (
                        <Link
                          href={`/admin/jobs/${job.id}/edit`}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Edit
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No job postings found.</p>
            {['HR', 'Admin'].includes(user.role) && (
              <Link
                href="/admin/jobs/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Create Your First Job Posting
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

