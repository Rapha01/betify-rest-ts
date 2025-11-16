export interface Account {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  is_email_verified: boolean;
  avatarUrl: string;
  created_at: number;
}

export interface CreateAccountDto {
  username: string;
  email: string;
  password: string;
}

export interface UpdateAccountDto {
  id: string;
  username?: string;
  password?: string;
}