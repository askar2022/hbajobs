'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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

export function ApplicationActions({ application, currentUser }: { application: any; currentUser: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(application.status)

  const updateStatus = async (newStatus: string, comment?: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/applications/${application.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, comment }),
      })

      if (response.ok) {
        setStatus(newStatus)
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setLoading(false)
    }
  }

  const statusOptions = [
    'Under Review',
    'Phone Screen',
    'Interview',
    'Reference Check',
    'Offered',
    'Hired',
    'Rejected',
  ]

  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-6">
      {/* Current Status */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Current Status</h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            statusColors[status] || statusColors.Draft
          }`}
        >
          {status}
        </span>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <Link
            href={`/admin/interviews/schedule?applicationId=${application.id}`}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md border border-gray-300"
          >
            Schedule Interview
          </Link>
          {status === 'Interview' && (
            <Link
              href={`/admin/interviews/${application.interviews?.[0]?.id}/feedback`}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md border border-gray-300"
            >
              Add Interview Feedback
            </Link>
          )}
          {['Interview', 'Reference Check'].includes(status) && (
            <button
              onClick={() => updateStatus('Offered', 'Moving to offer stage')}
              disabled={loading}
              className="block w-full text-left px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50"
            >
              Move to Offer
            </button>
          )}
        </div>
      </div>

      {/* Change Status */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3">Change Status</h3>
        <select
          value={status}
          onChange={(e) => updateStatus(e.target.value)}
          disabled={loading}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Internal Notes */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Internal Notes</h3>
        <textarea
          defaultValue={application.notes_internal || ''}
          rows={4}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          placeholder="Add internal notes..."
        />
      </div>
    </div>
  )
}

