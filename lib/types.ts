export type Job = {
  id: string
  title: string
  company: string
  location: string
  job_type: string
  category: string | null
  salary_min: number | null
  salary_max: number | null
  description: string
  requirements: string | null
  employer_id: string | null
  status: 'open' | 'closed'
  country: string | null
  region: string | null
  city: string | null
  address: string | null
  pay_currency: 'KRW' | 'USD'
  hourly_min: number | null
  hourly_max: number | null
  created_at: string
}

export type ApplicationStatus = 'Submitted' | 'Under Review' | 'Approved' | 'Rejected'
export type Role = 'seeker' | 'employer'

export type Application = {
  id: string
  job_id: string
  user_id: string
  full_name: string
  email: string
  phone: string | null
  cover_letter: string | null
  status: ApplicationStatus
  created_at: string
  jobs?: Job | null
}

export type Profile = {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  location: string | null
  headline: string | null
  bio: string | null
  skills: string | null
  experience_years: number | null
  education: string | null
  current_company: string | null
  role: Role
  company_name: string | null
  website: string | null
  company_description: string | null
  avatar_url: string | null
  resume_url: string | null
  country: string | null
  region: string | null
  city: string | null
  address: string | null
  languages: string | null
  desired_hourly_rate: number | null
  desired_currency: 'KRW' | 'USD'
  portfolio_url: string | null
  gender: 'male' | 'female' | 'other' | 'prefer_not' | null
  created_at: string
  updated_at: string
}

export type Conversation = {
  id: string
  application_id: string
  seeker_id: string
  employer_id: string
  created_at: string
}

export type Message = {
  id: string
  conversation_id: string
  sender_id: string
  kind: 'text' | 'call'
  body: string
  read_at: string | null
  created_at: string
}
