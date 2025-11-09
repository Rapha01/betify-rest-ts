export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
  is_email_verified: boolean;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  role?: string;
  is_email_verified?: boolean;
}
