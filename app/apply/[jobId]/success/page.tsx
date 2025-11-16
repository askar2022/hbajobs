'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircleIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ApplicationSuccessPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)
    }
    checkAuth()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your interest. We've received your application and will review it shortly.
          You'll receive a confirmation email shortly.
        </p>
        <div className="space-y-3">
          {isLoggedIn ? (
            <Link
              href="/my-applications"
              className="block w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              View My Applications
            </Link>
          ) : (
            <Link
              href="/login"
              className="block w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              Sign In to View Application
            </Link>
          )}
          <Link
            href="/careers"
            className="block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Browse More Positions
          </Link>
        </div>
      </div>
    </div>
  )
}

