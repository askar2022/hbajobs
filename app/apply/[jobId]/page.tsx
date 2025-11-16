'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ApplyPage() {
  const params = useParams()
  const jobId = params?.jobId as string
  const router = useRouter()
  const [job, setJob] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    yearsExperience: '',
    certifications: '',
    source: 'Website',
    resume: null as File | null,
    coverLetter: null as File | null,
    answers: {} as Record<string, string>,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        // Not logged in, redirect to login with return URL
        router.push(`/login?returnUrl=/apply/${jobId}`)
        return
      }

      // Get user data from users table
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (userData) {
        setUser(userData)
        // Pre-fill form with user data
        setFormData(prev => ({
          ...prev,
          firstName: userData.name?.split(' ')[0] || '',
          lastName: userData.name?.split(' ').slice(1).join(' ') || '',
          email: userData.email || '',
        }))
      }
      
      setCheckingAuth(false)
    }
    checkAuth()
  }, [jobId, router])

  useEffect(() => {
    if (!jobId || checkingAuth) return
    const fetchJob = async () => {
      const { data } = await supabase
        .from('job_postings')
        .select('*')
        .eq('id', jobId)
        .single()
      setJob(data)
    }
    fetchJob()
  }, [jobId, checkingAuth, supabase])

  const handleFileChange = (field: 'resume' | 'coverLetter', file: File | null) => {
    setFormData({ ...formData, [field]: file })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!jobId) return
    setError('')
    setLoading(true)

    try {
      // Check if applicant exists
      let { data: applicant } = await supabase
        .from('applicants')
        .select('*')
        .eq('email', formData.email)
        .single()

      if (!applicant) {
        // Create new applicant
        const { data: newApplicant, error: applicantError } = await supabase
          .from('applicants')
          .insert({
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
          })
          .select()
          .single()

        if (applicantError) throw applicantError
        applicant = newApplicant
      } else {
        // Update existing applicant
        const { error: updateError } = await supabase
          .from('applicants')
          .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
          })
          .eq('id', applicant.id)

        if (updateError) throw updateError
      }

      // Upload files
      let resumeUrl = null
      let coverLetterUrl = null

      if (formData.resume) {
        const fileExt = formData.resume.name.split('.').pop()
        const fileName = `${applicant.id}/resume_${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('applications')
          .upload(fileName, formData.resume)
        if (uploadError) throw uploadError
        const { data: urlData } = supabase.storage
          .from('applications')
          .getPublicUrl(fileName)
        resumeUrl = urlData.publicUrl
      }

      if (formData.coverLetter) {
        const fileExt = formData.coverLetter.name.split('.').pop()
        const fileName = `${applicant.id}/cover_${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('applications')
          .upload(fileName, formData.coverLetter)
        if (uploadError) throw uploadError
        const { data: urlData } = supabase.storage
          .from('applications')
          .getPublicUrl(fileName)
        coverLetterUrl = urlData.publicUrl
      }

      // Create application
      const { data: application, error: appError } = await supabase
        .from('applications')
        .insert({
          job_posting_id: jobId,
          applicant_id: applicant.id,
          source: formData.source,
          status: 'Submitted',
          resume_url: resumeUrl,
          cover_letter_url: coverLetterUrl,
          years_experience: formData.yearsExperience ? parseInt(formData.yearsExperience) : null,
          certifications: formData.certifications || null,
          submitted_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (appError) throw appError

      // Save application answers if any
      if (Object.keys(formData.answers).length > 0) {
        const answers = Object.entries(formData.answers).map(([question, answer]) => ({
          application_id: application.id,
          question,
          answer,
        }))
        await supabase.from('application_answers').insert(answers)
      }

      // Create stage history
      await supabase.from('application_stage_history').insert({
        application_id: application.id,
        to_status: 'Submitted',
        comment: 'Application submitted',
      })

      // Send email notifications (don't wait for it, send in background)
      fetch('/api/emails/application-submitted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: application.id }),
      }).catch(err => console.error('Failed to send email:', err))

      router.push(`/apply/${jobId}/success`)
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your application')
    } finally {
      setLoading(false)
    }
  }

  if (checkingAuth) {
    return <div className="p-8 text-center">Checking authentication...</div>
  }

  if (!job) {
    return <div className="p-8 text-center">Loading job details...</div>
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href={`/careers/${jobId}`}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            ← Back to job posting
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Apply for {job.title}</h1>
          <p className="text-gray-600 mb-8">{job.school_site}</p>

          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  readOnly
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-600 cursor-not-allowed"
                  title="Email from your account"
                />
              </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Experience */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Experience & Qualifications</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.yearsExperience}
                    onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Certifications & Licenses</label>
                  <textarea
                    value={formData.certifications}
                    onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                    rows={3}
                    placeholder="e.g., K-6 License, ESL Endorsement, SPED Certification"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Documents */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Documents</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Resume *</label>
                  <input
                    type="file"
                    required
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange('resume', e.target.files?.[0] || null)}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cover Letter</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange('coverLetter', e.target.files?.[0] || null)}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                </div>
              </div>
            </div>

            {/* Application Questions */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Questions</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why do you want to work at {job.school_site}?
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.answers['Why do you want to work here?'] || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        answers: { ...formData.answers, 'Why do you want to work here?': e.target.value },
                      })
                    }
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe your experience working with multilingual learners.
                  </label>
                  <textarea
                    rows={4}
                    value={formData.answers['Experience with multilingual learners'] || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        answers: {
                          ...formData.answers,
                          'Experience with multilingual learners': e.target.value,
                        },
                      })
                    }
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6 border-t">
              <Link
                href={`/careers/${jobId}`}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
