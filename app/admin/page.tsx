import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth'
import Link from 'next/link'
import { PrintButton } from '@/components/admin/PrintButton'

export default async function AdminDashboard() {
  const user = await requireRole(['HR', 'Admin'])
  const supabase = await createClient()

  // Get job statistics
  const { data: jobs } = await supabase
    .from('job_postings')
    .select('posting_status')

  const openPositions = jobs?.filter(j => j.posting_status === 'Published').length || 0
  const closedPositions = jobs?.filter(j => j.posting_status === 'Closed').length || 0
  const totalPositions = jobs?.length || 0

  // Get application statistics
  const { data: applications } = await supabase
    .from('applications')
    .select('status')

  const hiredCount = applications?.filter(a => a.status === 'Hired').length || 0
  const rejectedCount = applications?.filter(a => a.status === 'Rejected').length || 0
  const totalApplications = applications?.length || 0
  const activeApplications = applications?.filter(a => 
    !['Hired', 'Rejected', 'Withdrawn'].includes(a.status)
  ).length || 0

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Quick Navigation */}
        <div className="mb-6 flex gap-2">
          <Link
            href="/admin"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
          >
            🏠 Dashboard
          </Link>
          <Link
            href="/admin/jobs"
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
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

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Manage users, system settings, and administrative functions
            </p>
          </div>
          <PrintButton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:hidden">
          {/* User Management Card */}
          <Link
            href="/admin/users"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200 hover:border-blue-500"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
                <p className="text-sm text-gray-600 mt-1">Create and manage Admin & HR accounts</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-blue-600 font-medium">
              Manage Users
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Job Postings Card */}
          <Link
            href="/admin/jobs"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200 hover:border-green-500"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Job Postings</h2>
                <p className="text-sm text-gray-600 mt-1">Create and manage job listings</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-600 font-medium">
              View Jobs
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Email Notifications Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Email Notifications</h2>
                <p className="text-sm text-gray-600 mt-1">Automatic notifications configured</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                HR: mwelch-collins@thebestacademy.org
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Executive Director: epeterson@thebestacademy.org
              </div>
            </div>
          </div>
        </div>

        {/* HR Analytics Dashboard */}
        <div className="mt-8 space-y-6">
          {/* Print-only header */}
          <div className="hidden print:block mb-6">
            <h2 className="text-2xl font-bold text-gray-900">HR Analytics Report</h2>
            <p className="text-gray-600">Generated: {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            <p className="text-gray-600">Harvest, Wakanda, and Sankofa Schools</p>
          </div>

          {/* Job Postings Overview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Job Postings Overview</h3>
              <span className="text-sm text-gray-500">Total: {totalPositions}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div className="text-3xl font-bold text-green-600">{openPositions}</div>
                <div className="text-sm text-gray-600 mt-1">Open Positions</div>
                <div className="text-xs text-gray-500 mt-1">Currently accepting applications</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                <div className="text-3xl font-bold text-red-600">{closedPositions}</div>
                <div className="text-sm text-gray-600 mt-1">Closed Positions</div>
                <div className="text-xs text-gray-500 mt-1">No longer accepting applications</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-gray-500">
                <div className="text-3xl font-bold text-gray-600">{totalPositions - openPositions - closedPositions}</div>
                <div className="text-sm text-gray-600 mt-1">Draft Positions</div>
                <div className="text-xs text-gray-500 mt-1">Not yet published</div>
              </div>
            </div>
          </div>

          {/* Applications Overview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Applications Overview</h3>
              <span className="text-sm text-gray-500">Total: {totalApplications}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div className="text-3xl font-bold text-blue-600">{activeApplications}</div>
                <div className="text-sm text-gray-600 mt-1">In Progress</div>
                <div className="text-xs text-gray-500 mt-1">Under review/interview</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div className="text-3xl font-bold text-green-600">{hiredCount}</div>
                <div className="text-sm text-gray-600 mt-1">Hired</div>
                <div className="text-xs text-gray-500 mt-1">Successful hires</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                <div className="text-3xl font-bold text-red-600">{rejectedCount}</div>
                <div className="text-sm text-gray-600 mt-1">Rejected</div>
                <div className="text-xs text-gray-500 mt-1">Not selected</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <div className="text-3xl font-bold text-purple-600">
                  {hiredCount > 0 ? Math.round((hiredCount / totalApplications) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600 mt-1">Success Rate</div>
                <div className="text-xs text-gray-500 mt-1">Applications to hires</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

