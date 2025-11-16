import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default async function CareersPage() {
  const supabase = await createClient()
  const { data: jobs } = await supabase
    .from('job_postings')
    .select('*')
    .eq('posting_status', 'Published')
    .order('created_at', { ascending: false })

  const schools = ['Harvest', 'Wakanda', 'Sankofa']
  const departments = Array.from(new Set(jobs?.map(j => j.department).filter(Boolean) || []))

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Open Positions
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Join our team and make a difference in education
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4">
          <select className="px-4 py-2 border border-gray-300 rounded-md">
            <option value="">All Schools</option>
            {schools.map((school) => (
              <option key={school} value={school}>
                {school}
              </option>
            ))}
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-md">
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Jobs List */}
        {jobs && jobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                        {job.school_site}
                      </span>
                      {job.employment_type && (
                        <span className="text-xs text-gray-500">{job.employment_type}</span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {job.title}
                    </h3>
                    {job.department && (
                      <p className="text-sm text-gray-600 mb-3">{job.department}</p>
                    )}
                    {job.location && (
                      <p className="text-sm text-gray-500 mb-4">📍 {job.location}</p>
                    )}
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {job.description?.substring(0, 200)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Posted {formatDate(job.created_at)}
                      </span>
                      <Link
                        href={`/careers/${job.id}`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No open positions at this time.</p>
            <p className="text-gray-400 text-sm mt-2">
              Check back later for new opportunities.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

