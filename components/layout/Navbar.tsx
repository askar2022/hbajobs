'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
        console.log('Auth user:', authUser, 'Auth error:', authError)
        
        if (authUser) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single()
          
          console.log('User data:', userData, 'User error:', userError)
          setUser(userData)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }
    getUser()

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        getUser()
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center space-x-3">
              {/* HBA Logo */}
              <Image 
                src="/hba.png" 
                alt="HBA Logo" 
                width={40} 
                height={40}
                className="object-contain"
              />
              <span className="text-xl font-bold text-gray-900">HBA Jobs</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/careers"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/careers')
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Careers
              </Link>
              {user && (
                <>
                  {['HR', 'Admin', 'Principal', 'HiringManager'].includes(user.role) ? (
                    <Link
                      href="/admin"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        pathname.startsWith('/admin')
                          ? 'border-primary-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      Admin
                    </Link>
                  ) : (
                    <Link
                      href="/my-applications"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive('/my-applications')
                          ? 'border-primary-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      My Applications
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {loading ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">{user.name || user.email}</span>
                <Link
                  href="/settings"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Settings
                </Link>
                <button
                  onClick={async () => {
                    await supabase.auth.signOut()
                    setUser(null)
                    router.push('/')
                    router.refresh()
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

