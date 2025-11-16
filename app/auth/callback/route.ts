import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
    
    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // Check if user exists in our users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, role')
        .eq('id', user.id)
        .single()

      // If user doesn't exist in users table, create them as Applicant
      if (!existingUser) {
        await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email!,
            name: user.user_metadata.full_name || user.email!.split('@')[0],
            role: 'Applicant',
          })
        
        // Redirect applicants to my-applications
        return NextResponse.redirect(new URL('/my-applications', requestUrl.origin))
      }

      // Redirect based on existing user role
      const isAdmin = ['HR', 'Admin', 'Principal', 'HiringManager'].includes(existingUser.role)
      const redirectPath = isAdmin ? '/admin/jobs' : '/my-applications'
      return NextResponse.redirect(new URL(redirectPath, requestUrl.origin))
    }
  }

  // If no code or authentication failed, redirect to login with error
  return NextResponse.redirect(new URL('/login?error=auth_failed', requestUrl.origin))
}

