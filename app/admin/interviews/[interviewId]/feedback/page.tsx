'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function InterviewFeedbackPage({ params }: { params: { interviewId: string } }) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [interviewId, setInterviewId] = useState('')
  const [interview, setInterview] = useState<any>(null)
  const [formData, setFormData] = useState({
    rating_overall: 3,
    ratings_json: {
      communication: 3,
      classroom_management: 3,
      culture_fit: 3,
      subject_knowledge: 3,
    },
    comments: '',
    recommendation: 'Maybe',
  })

  useEffect(() => {
    const initializeParams = async () => {
      const resolvedParams = await params
      setInterviewId(resolvedParams.interviewId)
    }
    initializeParams()
  }, [])

  useEffect(() => {
    if (!interviewId) return
    const fetchInterview = async () => {
      const { data } = await supabase
        .from('interviews')
        .select('*, applications(*, job_postings(*), applicants(*))')
        .eq('id', interviewId)
        .single()
      setInterview(data)
    }
    fetchInterview()
  }, [interviewId, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error: feedbackError } = await supabase.from('interview_feedback').upsert({
        interview_id: interviewId,
        reviewer_id: user.id,
        rating_overall: formData.rating_overall,
        ratings_json: formData.ratings_json,
        comments: formData.comments,
        recommendation: formData.recommendation,
      })

      if (feedbackError) throw feedbackError

      router.push(`/admin/applicants/${interview?.application_id}`)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!interview) {
    return <div className="p-8 text-center">Loading...</div>
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href={`/admin/applicants/${interview.application_id}`}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium mb-4 inline-block"
          >
            ← Back to Application
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Interview Feedback</h1>
          <p className="text-gray-600 mt-2">
            {interview.applications?.applicants?.first_name}{' '}
            {interview.applications?.applicants?.last_name} - {interview.stage}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-800">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overall Rating (1-5) *
            </label>
            <input
              type="number"
              min="1"
              max="5"
              required
              value={formData.rating_overall}
              onChange={(e) =>
                setFormData({ ...formData, rating_overall: parseInt(e.target.value) })
              }
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Detailed Ratings (1-5)
            </label>
            <div className="space-y-4">
              {Object.entries(formData.ratings_json).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm text-gray-700 mb-1 capitalize">
                    {key.replace('_', ' ')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ratings_json: {
                          ...formData.ratings_json,
                          [key]: parseInt(e.target.value),
                        },
                      })
                    }
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recommendation *</label>
            <select
              required
              value={formData.recommendation}
              onChange={(e) =>
                setFormData({ ...formData, recommendation: e.target.value })
              }
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="Strong Hire">Strong Hire</option>
              <option value="Hire">Hire</option>
              <option value="Maybe">Maybe</option>
              <option value="No Hire">No Hire</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
            <textarea
              rows={6}
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Share your thoughts about the candidate..."
            />
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <Link
              href={`/admin/applicants/${interview.application_id}`}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

