export interface UserIF {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'user' | 'admin';
  verified_email: boolean;
}
