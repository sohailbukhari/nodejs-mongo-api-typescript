import { RoleType } from './UserIF';

export interface ClientIF {
  role: RoleType;
  sub: string;
  iat: number;
  exp: number;
  iss: string;
  company: string;
  type?: 'forgot' | 'refresh';
  email?: string;
}
