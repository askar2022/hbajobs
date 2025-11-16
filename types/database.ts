export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: 'HR' | 'Principal' | 'HiringManager' | 'Interviewer' | 'Admin' | 'Applicant'
          school_site: 'Harvest' | 'Wakanda' | 'Sankofa' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          role: 'HR' | 'Principal' | 'HiringManager' | 'Interviewer' | 'Admin' | 'Applicant'
          school_site?: 'Harvest' | 'Wakanda' | 'Sankofa' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'HR' | 'Principal' | 'HiringManager' | 'Interviewer' | 'Admin' | 'Applicant'
          school_site?: 'Harvest' | 'Wakanda' | 'Sankofa' | null
          created_at?: string
          updated_at?: string
        }
      }
      job_postings: {
        Row: {
          id: string
          title: string
          school_site: 'Harvest' | 'Wakanda' | 'Sankofa'
          department: string | null
          employment_type: 'Full-time' | 'Part-time' | 'Contract' | null
          location: string | null
          description: string | null
          requirements: string | null
          salary_range_min: number | null
          salary_range_max: number | null
          posting_status: 'Draft' | 'Published' | 'Closed'
          created_by: string | null
          hiring_manager_id: string | null
          pipeline_template_id: string | null
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          title: string
          school_site: 'Harvest' | 'Wakanda' | 'Sankofa'
          department?: string | null
          employment_type?: 'Full-time' | 'Part-time' | 'Contract' | null
          location?: string | null
          description?: string | null
          requirements?: string | null
          salary_range_min?: number | null
          salary_range_max?: number | null
          posting_status?: 'Draft' | 'Published' | 'Closed'
          created_by?: string | null
          hiring_manager_id?: string | null
          pipeline_template_id?: string | null
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          school_site?: 'Harvest' | 'Wakanda' | 'Sankofa'
          department?: string | null
          employment_type?: 'Full-time' | 'Part-time' | 'Contract' | null
          location?: string | null
          description?: string | null
          requirements?: string | null
          salary_range_min?: number | null
          salary_range_max?: number | null
          posting_status?: 'Draft' | 'Published' | 'Closed'
          created_by?: string | null
          hiring_manager_id?: string | null
          pipeline_template_id?: string | null
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
      applicants: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          zip: string | null
          linked_in: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          linked_in?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          linked_in?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          job_posting_id: string
          applicant_id: string
          source: string | null
          status: 'Draft' | 'Submitted' | 'Under Review' | 'Phone Screen' | 'Interview' | 'Reference Check' | 'Offered' | 'Hired' | 'Rejected' | 'Withdrawn'
          resume_url: string | null
          cover_letter_url: string | null
          additional_docs: Json | null
          years_experience: number | null
          certifications: string | null
          notes_internal: string | null
          submitted_at: string | null
          updated_at: string
          created_at: string
        }
        Insert: {
          id?: string
          job_posting_id: string
          applicant_id: string
          source?: string | null
          status?: 'Draft' | 'Submitted' | 'Under Review' | 'Phone Screen' | 'Interview' | 'Reference Check' | 'Offered' | 'Hired' | 'Rejected' | 'Withdrawn'
          resume_url?: string | null
          cover_letter_url?: string | null
          additional_docs?: Json | null
          years_experience?: number | null
          certifications?: string | null
          notes_internal?: string | null
          submitted_at?: string | null
          updated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          job_posting_id?: string
          applicant_id?: string
          source?: string | null
          status?: 'Draft' | 'Submitted' | 'Under Review' | 'Phone Screen' | 'Interview' | 'Reference Check' | 'Offered' | 'Hired' | 'Rejected' | 'Withdrawn'
          resume_url?: string | null
          cover_letter_url?: string | null
          additional_docs?: Json | null
          years_experience?: number | null
          certifications?: string | null
          notes_internal?: string | null
          submitted_at?: string | null
          updated_at?: string
          created_at?: string
        }
      }
      interviews: {
        Row: {
          id: string
          application_id: string
          stage: 'Phone Screen' | 'Panel Interview' | 'Demo Lesson' | 'Final Interview'
          scheduled_at: string
          location: string | null
          created_by: string | null
          status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No-Show'
          join_link: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          application_id: string
          stage: 'Phone Screen' | 'Panel Interview' | 'Demo Lesson' | 'Final Interview'
          scheduled_at: string
          location?: string | null
          created_by?: string | null
          status?: 'Scheduled' | 'Completed' | 'Cancelled' | 'No-Show'
          join_link?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          application_id?: string
          stage?: 'Phone Screen' | 'Panel Interview' | 'Demo Lesson' | 'Final Interview'
          scheduled_at?: string
          location?: string | null
          created_by?: string | null
          status?: 'Scheduled' | 'Completed' | 'Cancelled' | 'No-Show'
          join_link?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      interview_feedback: {
        Row: {
          id: string
          interview_id: string
          reviewer_id: string
          rating_overall: number | null
          ratings_json: Json | null
          comments: string | null
          recommendation: 'Strong Hire' | 'Hire' | 'Maybe' | 'No Hire' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          interview_id: string
          reviewer_id: string
          rating_overall?: number | null
          ratings_json?: Json | null
          comments?: string | null
          recommendation?: 'Strong Hire' | 'Hire' | 'Maybe' | 'No Hire' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          interview_id?: string
          reviewer_id?: string
          rating_overall?: number | null
          ratings_json?: Json | null
          comments?: string | null
          recommendation?: 'Strong Hire' | 'Hire' | 'Maybe' | 'No Hire' | null
          created_at?: string
          updated_at?: string
        }
      }
      offers: {
        Row: {
          id: string
          application_id: string
          status: 'Draft' | 'Sent' | 'Accepted' | 'Declined'
          salary: number | null
          start_date: string | null
          offer_letter_url: string | null
          sent_at: string | null
          responded_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          application_id: string
          status?: 'Draft' | 'Sent' | 'Accepted' | 'Declined'
          salary?: number | null
          start_date?: string | null
          offer_letter_url?: string | null
          sent_at?: string | null
          responded_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          application_id?: string
          status?: 'Draft' | 'Sent' | 'Accepted' | 'Declined'
          salary?: number | null
          start_date?: string | null
          offer_letter_url?: string | null
          sent_at?: string | null
          responded_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      hires: {
        Row: {
          id: string
          application_id: string
          employee_internal_id: string | null
          school_site: 'Harvest' | 'Wakanda' | 'Sankofa'
          position_title: string
          start_date: string | null
          onboarding_status: 'Not Started' | 'In Progress' | 'Completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          application_id: string
          employee_internal_id?: string | null
          school_site: 'Harvest' | 'Wakanda' | 'Sankofa'
          position_title: string
          start_date?: string | null
          onboarding_status?: 'Not Started' | 'In Progress' | 'Completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          application_id?: string
          employee_internal_id?: string | null
          school_site?: 'Harvest' | 'Wakanda' | 'Sankofa'
          position_title?: string
          start_date?: string | null
          onboarding_status?: 'Not Started' | 'In Progress' | 'Completed'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

