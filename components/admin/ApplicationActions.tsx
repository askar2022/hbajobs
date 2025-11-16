'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import * as Dialog from '@radix-ui/react-dialog'

const statusColors: Record<string, string> = {
  Draft: 'bg-gray-100 text-gray-800',
  Submitted: 'bg-blue-100 text-blue-800',
  'Under Review': 'bg-yellow-100 text-yellow-800',
  'Phone Screen': 'bg-purple-100 text-purple-800',
  Interview: 'bg-indigo-100 text-indigo-800',
  'Reference Check': 'bg-pink-100 text-pink-800',
  Offer: 'bg-green-100 text-green-800',
  Offered: 'bg-green-100 text-green-800',
  Hired: 'bg-green-200 text-green-900',
  Rejected: 'bg-red-100 text-red-800',
  Withdrawn: 'bg-gray-100 text-gray-800',
}

export function ApplicationActions({ application, currentUser }: { application: any; currentUser: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(application.status)
  const [selectedStatus, setSelectedStatus] = useState(application.status)
  const [comment, setComment] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const handleUpdateStatusClick = () => {
    // Show confirmation dialog before updating
    setShowConfirmDialog(true)
  }

  const confirmUpdateStatus = async () => {
    setLoading(true)
    setShowConfirmDialog(false)
    
    try {
      const response = await fetch(`/api/applications/${application.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: selectedStatus, comment }),
      })

      if (response.ok) {
        setStatus(selectedStatus)
        setComment('') // Clear comment after successful update
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleQuickOffer = () => {
    setSelectedStatus('Offer')
    setComment('Moving to offer stage')
    setShowConfirmDialog(true)
  }

  const statusOptions = [
    'Under Review',
    'Phone Screen',
    'Interview',
    'Reference Check',
    'Offer',
    'Hired',
    'Rejected',
  ]

  const getEmailMessage = () => {
    if (selectedStatus === 'Offer') {
      return '🎉 Job offer email will be sent'
    } else if (selectedStatus === 'Hired') {
      return '🌟 Welcome email will be sent'
    } else if (selectedStatus === 'Phone Screen' || selectedStatus === 'Interview') {
      return '📧 Status update email will be sent'
    } else if (selectedStatus === 'Rejected') {
      return '📧 Rejection notification will be sent'
    } else {
      return '📧 Status update email will be sent'
    }
  }

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
              onClick={handleQuickOffer}
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
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          disabled={loading}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 mb-3"
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {/* Comment/Note field */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Comment {['Offer', 'Hired', 'Offered'].includes(selectedStatus) && '(Include start date)'}
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            disabled={loading}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
            placeholder={
              ['Offer', 'Offered'].includes(selectedStatus)
                ? 'e.g., Start Date: January 15, 2025'
                : selectedStatus === 'Hired'
                ? 'e.g., Start Date: January 15, 2025'
                : 'Optional comment...'
            }
          />
          {['Offer', 'Offered', 'Hired'].includes(selectedStatus) && (
            <p className="mt-1 text-xs text-blue-600">
              💡 Tip: Include start date for automated email
            </p>
          )}
        </div>

        {/* Update Status Button */}
        <button
          onClick={handleUpdateStatusClick}
          disabled={loading || selectedStatus === status}
          className="w-full px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Updating...' : selectedStatus === status ? 'Status is current' : 'Update Status'}
        </button>
      </div>

      {/* Confirmation Dialog */}
      <Dialog.Root open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-full max-w-md z-50">
            <Dialog.Title className="text-xl font-bold text-gray-900 mb-4">
              ⚠️ Confirm Status Change
            </Dialog.Title>
            
            <Dialog.Description className="text-gray-600 mb-6 space-y-3">
              <p>
                Status will change from <span className="font-semibold text-gray-900">"{status}"</span> to{' '}
                <span className="font-semibold text-gray-900">"{selectedStatus}"</span>
              </p>
              
              {comment && (
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <p className="text-sm font-medium text-gray-700">Comment:</p>
                  <p className="text-sm text-gray-600 mt-1">{comment}</p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-sm font-medium text-blue-900">
                  {getEmailMessage()}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Applicant: {application.applicants?.email || application.applicants?.[0]?.email || 'applicant'}
                </p>
              </div>
            </Dialog.Description>

            <div className="flex space-x-3">
              <Dialog.Close asChild>
                <button
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
                  disabled={loading}
                >
                  Cancel
                </button>
              </Dialog.Close>
              
              <button
                onClick={confirmUpdateStatus}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Confirm & Send Email'}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

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

