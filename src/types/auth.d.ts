declare global {
  namespace Express {
    interface Request {
      account?: {
        id: string;
        username: string;
        email: string;
        role: string;
      };
    }
  }
}

export {};