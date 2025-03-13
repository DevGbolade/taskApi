import { Request } from 'express';

declare module 'express' {
  export interface Request {
    user?: { id: string, role: string };
  }
}


export interface IUser {
  id?: number;
  username: string;
  email: string;
  password: string;
  role?: "admin" | "user";
}