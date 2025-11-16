-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('HR', 'Principal', 'HiringManager', 'Interviewer', 'Admin', 'Applicant')),
  school_site TEXT CHECK (school_site IN ('Harvest', 'Wakanda', 'Sankofa')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job postings table
CREATE TABLE IF NOT EXISTS job_postings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  school_site TEXT NOT NULL CHECK (school_site IN ('Harvest', 'Wakanda', 'Sankofa')),
  department TEXT,
  employment_type TEXT CHECK (employment_type IN ('Full-time', 'Part-time', 'Contract')),
  location TEXT,
  description TEXT,
  requirements TEXT,
  salary_range_min DECIMAL(10, 2),
  salary_range_max DECIMAL(10, 2),
  posting_status TEXT NOT NULL DEFAULT 'Draft' CHECK (posting_status IN ('Draft', 'Published', 'Closed')),
  created_by UUID REFERENCES users(id),
  hiring_manager_id UUID REFERENCES users(id),
  pipeline_template_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Applicants table
CREATE TABLE IF NOT EXISTS applicants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  linked_in TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_posting_id UUID NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES applicants(id) ON DELETE CASCADE,
  source TEXT,
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN (
    'Draft', 'Submitted', 'Under Review', 'Phone Screen', 
    'Interview', 'Reference Check', 'Offered', 'Hired', 'Rejected', 'Withdrawn'
  )),
  resume_url TEXT,
  cover_letter_url TEXT,
  additional_docs JSONB,
  years_experience INTEGER,
  certifications TEXT,
  notes_internal TEXT,
  submitted_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_posting_id, applicant_id)
);

-- Application answers table (custom questions per job)
CREATE TABLE IF NOT EXISTS application_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Application stage history
CREATE TABLE IF NOT EXISTS application_stage_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  from_status TEXT,
  to_status TEXT NOT NULL,
  changed_by UUID REFERENCES users(id),
  comment TEXT,
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interviews table
CREATE TABLE IF NOT EXISTS interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  stage TEXT NOT NULL CHECK (stage IN ('Phone Screen', 'Panel Interview', 'Demo Lesson', 'Final Interview')),
  scheduled_at TIMESTAMPTZ NOT NULL,
  location TEXT,
  created_by UUID REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Completed', 'Cancelled', 'No-Show')),
  join_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interview feedback table
CREATE TABLE IF NOT EXISTS interview_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES users(id),
  rating_overall INTEGER CHECK (rating_overall >= 1 AND rating_overall <= 5),
  ratings_json JSONB,
  comments TEXT,
  recommendation TEXT CHECK (recommendation IN ('Strong Hire', 'Hire', 'Maybe', 'No Hire')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(interview_id, reviewer_id)
);

-- Interview participants (many-to-many)
CREATE TABLE IF NOT EXISTS interview_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'Interviewer',
  UNIQUE(interview_id, user_id)
);

-- Offers table
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Sent', 'Accepted', 'Declined')),
  salary DECIMAL(10, 2),
  start_date DATE,
  offer_letter_url TEXT,
  sent_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hires table
CREATE TABLE IF NOT EXISTS hires (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  employee_internal_id TEXT,
  school_site TEXT NOT NULL CHECK (school_site IN ('Harvest', 'Wakanda', 'Sankofa')),
  position_title TEXT NOT NULL,
  start_date DATE,
  onboarding_status TEXT DEFAULT 'Not Started' CHECK (onboarding_status IN ('Not Started', 'In Progress', 'Completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Onboarding tasks table
CREATE TABLE IF NOT EXISTS onboarding_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hire_id UUID NOT NULL REFERENCES hires(id) ON DELETE CASCADE,
  task_name TEXT NOT NULL,
  task_type TEXT CHECK (task_type IN ('Background Check', 'I-9', 'W-4', 'Fingerprinting', 'Licensure Verification', 'Orientation', 'System Accounts')),
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed')),
  assigned_to UUID REFERENCES users(id),
  due_date DATE,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_applications_job_posting ON applications(job_posting_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant ON applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_job_postings_status ON job_postings(posting_status);
CREATE INDEX IF NOT EXISTS idx_job_postings_school ON job_postings(school_site);
CREATE INDEX IF NOT EXISTS idx_interviews_application ON interviews(application_id);
CREATE INDEX IF NOT EXISTS idx_interview_feedback_interview ON interview_feedback(interview_id);
CREATE INDEX IF NOT EXISTS idx_offers_application ON offers(application_id);
CREATE INDEX IF NOT EXISTS idx_hires_application ON hires(application_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers (drop if exists to allow re-running migration)
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_job_postings_updated_at ON job_postings;
DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
DROP TRIGGER IF EXISTS update_interviews_updated_at ON interviews;
DROP TRIGGER IF EXISTS update_interview_feedback_updated_at ON interview_feedback;
DROP TRIGGER IF EXISTS update_offers_updated_at ON offers;
DROP TRIGGER IF EXISTS update_hires_updated_at ON hires;
DROP TRIGGER IF EXISTS update_onboarding_tasks_updated_at ON onboarding_tasks;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_postings_updated_at BEFORE UPDATE ON job_postings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interviews_updated_at BEFORE UPDATE ON interviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interview_feedback_updated_at BEFORE UPDATE ON interview_feedback FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON offers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hires_updated_at BEFORE UPDATE ON hires FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_onboarding_tasks_updated_at BEFORE UPDATE ON onboarding_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE hires ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (can be customized based on your needs)
-- Users can read their own data
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);

-- Public can read published job postings
CREATE POLICY "Public can read published jobs" ON job_postings FOR SELECT USING (posting_status = 'Published');

-- Applicants can read their own applications
CREATE POLICY "Applicants can read own applications" ON applications FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM applicants 
      WHERE applicants.id = applications.applicant_id 
      AND applicants.email = (SELECT email FROM users WHERE id = auth.uid())
    )
  );

-- HR/Admin can read all applications
CREATE POLICY "HR can read all applications" ON applications FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('HR', 'Admin')
    )
  );

-- Hiring managers can read applications for their jobs
CREATE POLICY "Hiring managers can read their job applications" ON applications FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM job_postings jp
      JOIN users u ON u.id = jp.hiring_manager_id
      WHERE jp.id = applications.job_posting_id
      AND u.id = auth.uid()
    )
  );

