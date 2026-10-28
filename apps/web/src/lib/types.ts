export type UserRole = 'CANDIDATE' | 'EMPLOYER' | 'ADMIN';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company?: { id: string; name: string } | null;
};

export type Company = {
  id: string;
  name: string;
  description?: string | null;
  website?: string | null;
  _count?: { jobs: number };
};

export type Job = {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  seniority: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  isRemote: boolean;
  status: string;
  createdAt: string;
  company: {
    id: string;
    name: string;
    description?: string | null;
    website?: string | null;
  };
  _count?: { applications: number };
};

export type Application = {
  id: string;
  status: string;
  coverLetter?: string | null;
  createdAt: string;
  job?: Job;
  candidate?: { id: string; name: string; email: string };
};

export type PaginatedJobs = {
  items: Job[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};
