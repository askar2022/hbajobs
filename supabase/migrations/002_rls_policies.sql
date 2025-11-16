-- Additional Row Level Security Policies
-- This migration adds comprehensive RLS policies for all tables
-- Note: Drops existing policies first to allow re-running

-- ============================================
-- APPLICANTS TABLE
-- ============================================
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Applicants can read own data" ON applicants;
DROP POLICY IF EXISTS "HR can read all applicants" ON applicants;
DROP POLICY IF EXISTS "HR can insert applicants" ON applicants;
DROP POLICY IF EXISTS "HR can update applicants" ON applicants;

-- Applicants can read their own data
CREATE POLICY "Applicants can read own data" ON applicants FOR SELECT
  USING (
    email = (SELECT email FROM users WHERE id = auth.uid())
  );

-- HR/Admin can read all applicants
CREATE POLICY "HR can read all applicants" ON applicants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin')
    )
  );

-- HR/Admin can insert applicants
CREATE POLICY "HR can insert applicants" ON applicants FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin')
    )
  );

-- HR/Admin can update applicants
CREATE POLICY "HR can update applicants" ON applicants FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin')
    )
  );

-- ============================================
-- APPLICATION_ANSWERS TABLE
-- ============================================
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Applicants can read own answers" ON application_answers;
DROP POLICY IF EXISTS "HR can read all answers" ON application_answers;
DROP POLICY IF EXISTS "Anyone can insert answers" ON application_answers;
DROP POLICY IF EXISTS "HR can update answers" ON application_answers;
DROP POLICY IF EXISTS "HR can delete answers" ON application_answers;

-- Applicants can read their own application answers
CREATE POLICY "Applicants can read own answers" ON application_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      JOIN applicants ap ON ap.id = a.applicant_id
      WHERE a.id = application_answers.application_id
      AND ap.email = (SELECT email FROM users WHERE id = auth.uid())
    )
  );

-- HR/Admin/Hiring Managers can read all answers
CREATE POLICY "HR can read all answers" ON application_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin', 'Principal', 'HiringManager')
    )
  );

-- Anyone can insert answers (for application submission)
CREATE POLICY "Anyone can insert answers" ON application_answers FOR INSERT
  WITH CHECK (true);

-- Only HR/Admin can update or delete answers
CREATE POLICY "HR can update answers" ON application_answers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin')
    )
  );

CREATE POLICY "HR can delete answers" ON application_answers FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin')
    )
  );

-- ============================================
-- APPLICATION_STAGE_HISTORY TABLE
-- ============================================
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Applicants can read own history" ON application_stage_history;
DROP POLICY IF EXISTS "HR can read all history" ON application_stage_history;
DROP POLICY IF EXISTS "HR can insert history" ON application_stage_history;
DROP POLICY IF EXISTS "HR can update history" ON application_stage_history;
DROP POLICY IF EXISTS "HR can delete history" ON application_stage_history;

-- Applicants can read history for their own applications
CREATE POLICY "Applicants can read own history" ON application_stage_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      JOIN applicants ap ON ap.id = a.applicant_id
      WHERE a.id = application_stage_history.application_id
      AND ap.email = (SELECT email FROM users WHERE id = auth.uid())
    )
  );

-- HR/Admin/Hiring Managers can read all history
CREATE POLICY "HR can read all history" ON application_stage_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin', 'Principal', 'HiringManager')
    )
  );

-- HR/Admin/Hiring Managers can insert history
CREATE POLICY "HR can insert history" ON application_stage_history FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin', 'Principal', 'HiringManager')
    )
  );

-- Only HR/Admin can update or delete history
CREATE POLICY "HR can update history" ON application_stage_history FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin')
    )
  );

CREATE POLICY "HR can delete history" ON application_stage_history FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin')
    )
  );

-- ============================================
-- INTERVIEWS TABLE
-- ============================================
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Applicants can read own interviews" ON interviews;
DROP POLICY IF EXISTS "HR can read all interviews" ON interviews;
DROP POLICY IF EXISTS "Interviewers can read assigned interviews" ON interviews;
DROP POLICY IF EXISTS "HR can manage interviews" ON interviews;

-- Applicants can read interviews for their applications
CREATE POLICY "Applicants can read own interviews" ON interviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      JOIN applicants ap ON ap.id = a.applicant_id
      WHERE a.id = interviews.application_id
      AND ap.email = (SELECT email FROM users WHERE id = auth.uid())
    )
  );

-- HR/Admin/Hiring Managers can read all interviews
CREATE POLICY "HR can read all interviews" ON interviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin', 'Principal', 'HiringManager')
    )
  );

-- Interviewers can read assigned interviews
CREATE POLICY "Interviewers can read assigned interviews" ON interviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM interview_participants ip
      WHERE ip.interview_id = interviews.id
      AND ip.user_id = auth.uid()
    )
  );

-- HR/Admin/Hiring Managers can insert/update interviews
CREATE POLICY "HR can manage interviews" ON interviews FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin', 'Principal', 'HiringManager')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin', 'Principal', 'HiringManager')
    )
  );

-- ============================================
-- INTERVIEW_PARTICIPANTS TABLE
-- ============================================
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Participants can read own assignments" ON interview_participants;
DROP POLICY IF EXISTS "HR can read all participants" ON interview_participants;
DROP POLICY IF EXISTS "HR can manage participants" ON interview_participants;
DROP POLICY IF EXISTS "Participants can update own assignments" ON interview_participants;

-- Participants can read their own assignments
CREATE POLICY "Participants can read own assignments" ON interview_participants FOR SELECT
  USING (user_id = auth.uid());

-- HR/Admin/Hiring Managers can read all participants
CREATE POLICY "HR can read all participants" ON interview_participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin', 'Principal', 'HiringManager')
    )
  );

-- HR/Admin/Hiring Managers can manage participants
CREATE POLICY "HR can manage participants" ON interview_participants FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin', 'Principal', 'HiringManager')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin', 'Principal', 'HiringManager')
    )
  );

-- Participants can update their own assignments (e.g., to mark as attending)
CREATE POLICY "Participants can update own assignments" ON interview_participants FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================
-- INTERVIEW_FEEDBACK TABLE
-- ============================================
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Reviewers can read own feedback" ON interview_feedback;
DROP POLICY IF EXISTS "HR can read all feedback" ON interview_feedback;
DROP POLICY IF EXISTS "Interviewers can manage own feedback" ON interview_feedback;

-- Reviewers can read their own feedback
CREATE POLICY "Reviewers can read own feedback" ON interview_feedback FOR SELECT
  USING (reviewer_id = auth.uid());

-- HR/Admin/Hiring Managers can read all feedback
CREATE POLICY "HR can read all feedback" ON interview_feedback FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin', 'Principal', 'HiringManager')
    )
  );

-- Interviewers can insert/update their own feedback
CREATE POLICY "Interviewers can manage own feedback" ON interview_feedback FOR ALL
  USING (reviewer_id = auth.uid())
  WITH CHECK (reviewer_id = auth.uid());

-- ============================================
-- OFFERS TABLE
-- ============================================
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Applicants can read own offers" ON offers;
DROP POLICY IF EXISTS "HR can read all offers" ON offers;
DROP POLICY IF EXISTS "HR can manage offers" ON offers;

-- Applicants can read offers for their applications
CREATE POLICY "Applicants can read own offers" ON offers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      JOIN applicants ap ON ap.id = a.applicant_id
      WHERE a.id = offers.application_id
      AND ap.email = (SELECT email FROM users WHERE id = auth.uid())
    )
  );

-- HR/Admin/Hiring Managers can read all offers
CREATE POLICY "HR can read all offers" ON offers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin', 'Principal', 'HiringManager')
    )
  );

-- HR/Admin can manage offers
CREATE POLICY "HR can manage offers" ON offers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin')
    )
  );

-- ============================================
-- HIRES TABLE
-- ============================================
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "HR can read all hires" ON hires;
DROP POLICY IF EXISTS "HR can manage hires" ON hires;

-- HR/Admin can read all hires
CREATE POLICY "HR can read all hires" ON hires FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin')
    )
  );

-- HR/Admin can manage hires
CREATE POLICY "HR can manage hires" ON hires FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin')
    )
  );

-- ============================================
-- ONBOARDING_TASKS TABLE
-- ============================================
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "HR can read all onboarding tasks" ON onboarding_tasks;
DROP POLICY IF EXISTS "HR can manage onboarding tasks" ON onboarding_tasks;
DROP POLICY IF EXISTS "Users can read assigned tasks" ON onboarding_tasks;
DROP POLICY IF EXISTS "Users can update assigned tasks" ON onboarding_tasks;

-- HR/Admin can read all onboarding tasks
CREATE POLICY "HR can read all onboarding tasks" ON onboarding_tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin')
    )
  );

-- HR/Admin can manage onboarding tasks
CREATE POLICY "HR can manage onboarding tasks" ON onboarding_tasks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin')
    )
  );

-- Assigned users can read their own tasks
CREATE POLICY "Users can read assigned tasks" ON onboarding_tasks FOR SELECT
  USING (assigned_to = auth.uid());

-- Assigned users can update their own tasks (e.g., mark as completed)
CREATE POLICY "Users can update assigned tasks" ON onboarding_tasks FOR UPDATE
  USING (assigned_to = auth.uid())
  WITH CHECK (assigned_to = auth.uid());

-- ============================================
-- JOB_POSTINGS TABLE (Additional policies)
-- ============================================
-- Drop existing policies if they exist (keep the public read policy from initial migration)
DROP POLICY IF EXISTS "HR can manage all jobs" ON job_postings;
DROP POLICY IF EXISTS "Hiring managers can read own jobs" ON job_postings;

-- HR/Admin can manage all job postings
CREATE POLICY "HR can manage all jobs" ON job_postings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin')
    )
  );

-- Hiring Managers can read their own job postings
CREATE POLICY "Hiring managers can read own jobs" ON job_postings FOR SELECT
  USING (
    hiring_manager_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin')
    )
  );

-- ============================================
-- APPLICATIONS TABLE (Additional policies)
-- ============================================
-- Drop existing policies if they exist (keep policies from initial migration)
DROP POLICY IF EXISTS "HR can manage all applications" ON applications;
DROP POLICY IF EXISTS "Hiring managers can update their applications" ON applications;
DROP POLICY IF EXISTS "Anyone can insert applications" ON applications;

-- HR/Admin can manage all applications
CREATE POLICY "HR can manage all applications" ON applications FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin')
    )
  );

-- Hiring Managers can update applications for their jobs
CREATE POLICY "Hiring managers can update their applications" ON applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM job_postings jp
      WHERE jp.id = applications.job_posting_id
      AND jp.hiring_manager_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM job_postings jp
      WHERE jp.id = applications.job_posting_id
      AND jp.hiring_manager_id = auth.uid()
    )
  );

-- Anyone can insert applications (for public application submission)
CREATE POLICY "Anyone can insert applications" ON applications FOR INSERT
  WITH CHECK (true);

