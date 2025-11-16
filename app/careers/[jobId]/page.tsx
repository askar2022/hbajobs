import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>
}) {
  const { jobId } = await params
  const supabase = await createClient()
  const { data: job } = await supabase
    .from('job_postings')
    .select('*')
    .eq('id', jobId)
    .eq('posting_status', 'Published')
    .single()

  if (!job) {
    notFound()
  }

  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href="/careers"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            ← Back to all positions
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded">
                {job.school_site}
              </span>
              {job.employment_type && (
                <span className="text-sm text-gray-600">{job.employment_type}</span>
              )}
              {job.department && (
                <span className="text-sm text-gray-600">• {job.department}</span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
            {job.location && (
              <p className="text-lg text-gray-600 mb-2">📍 {job.location}</p>
            )}
            {job.salary_range_min && job.salary_range_max && (
              <p className="text-lg text-gray-700 font-medium">
                ${job.salary_range_min.toLocaleString()} - ${job.salary_range_max.toLocaleString()}
              </p>
            )}
          </div>

          <div className="prose max-w-none mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Job Description</h2>
            <div className="text-gray-700 whitespace-pre-wrap mb-8">
              {job.description || 'No description provided.'}
            </div>

            {job.requirements && (
              <>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Requirements</h2>
                <div className="text-gray-700 whitespace-pre-wrap mb-8">
                  {job.requirements}
                </div>
              </>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Posted on {formatDate(job.created_at)}
                </p>
                {job.published_at && (
                  <p className="text-sm text-gray-500">
                    Published on {formatDate(job.published_at)}
                  </p>
                )}
              </div>
              <Link
                href={`/apply/${job.id}`}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 shadow-sm"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

