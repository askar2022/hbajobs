'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

function ScheduleInterviewForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const applicationId = searchParams.get('applicationId')
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [users, setUsers] = useState<any[]>([])
  const [formData, setFormData] = useState({
    application_id: applicationId || '',
    stage: 'Phone Screen',
    scheduled_at: '',
    location: '',
    join_link: '',
    participants: [] as string[],
  })

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase
        .from('users')
        .select('*')
        .in('role', ['HR', 'Principal', 'HiringManager', 'Interviewer'])
      setUsers(data || [])
    }
    fetchUsers()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Create interview
      const { data: interview, error: interviewError } = await supabase
        .from('interviews')
        .insert({
          application_id: formData.application_id,
          stage: formData.stage,
          scheduled_at: formData.scheduled_at,
          location: formData.location || null,
          join_link: formData.join_link || null,
          created_by: user.id,
        })
        .select()
        .single()

      if (interviewError) throw interviewError

      // Add participants
      if (formData.participants.length > 0) {
        const participants = formData.participants.map((userId) => ({
          interview_id: interview.id,
          user_id: userId,
        }))
        await supabase.from('interview_participants').insert(participants)
      }

      // Update application status
      await supabase
        .from('applications')
        .update({ status: formData.stage === 'Phone Screen' ? 'Phone Screen' : 'Interview' })
        .eq('id', formData.application_id)

      // Create stage history
      await supabase.from('application_stage_history').insert({
        application_id: formData.application_id,
        to_status: formData.stage === 'Phone Screen' ? 'Phone Screen' : 'Interview',
        changed_by: user.id,
        comment: `Interview scheduled: ${formData.stage}`,
      })

      router.push(`/admin/applicants/${formData.application_id}`)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href={applicationId ? `/admin/applicants/${applicationId}` : '/admin/jobs'}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium mb-4 inline-block"
          >
            ← Back
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Schedule Interview</h1>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-800">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Interview Stage *</label>
            <select
              required
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="Phone Screen">Phone Screen</option>
              <option value="Panel Interview">Panel Interview</option>
              <option value="Demo Lesson">Demo Lesson</option>
              <option value="Final Interview">Final Interview</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Scheduled Date & Time *</label>
            <input
              type="datetime-local"
              required
              value={formData.scheduled_at}
              onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="In-person address or 'Zoom'"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Join Link (if online)</label>
            <input
              type="url"
              value={formData.join_link}
              onChange={(e) => setFormData({ ...formData, join_link: e.target.value })}
              placeholder="https://zoom.us/j/..."
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Interview Participants</label>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3">
              {users.map((user) => (
                <label key={user.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.participants.includes(user.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          participants: [...formData.participants, user.id],
                        })
                      } else {
                        setFormData({
                          ...formData,
                          participants: formData.participants.filter((id) => id !== user.id),
                        })
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    {user.name} ({user.role})
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <Link
              href={applicationId ? `/admin/applicants/${applicationId}` : '/admin/jobs'}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Scheduling...' : 'Schedule Interview'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ScheduleInterviewPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="text-center">Loading...</div>
      </div>
    }>
      <ScheduleInterviewForm />
    </Suspense>
  )
}

