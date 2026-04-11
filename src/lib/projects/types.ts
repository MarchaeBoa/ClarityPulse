export interface Project {
  id: string;
  name: string;
  domain: string;
  public_token: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  script_verified_at: string | null;
}

export interface CreateProjectInput {
  name: string;
  domain: string;
}

export interface UpdateProjectInput {
  name?: string;
  domain?: string;
}
