export interface Account {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  is_email_verified: boolean;
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
  email?: string;
  role?: string;
  is_email_verified?: boolean;
}