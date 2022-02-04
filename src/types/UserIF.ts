export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export type RoleType = Role.ADMIN | Role.USER;
export type GenderType = Gender.MALE | Gender.FEMALE | Gender.OTHER;

export interface UserIF {
  _id: any;
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  zip: number;
  gender?: GenderType;
  role: RoleType;
  verified_email: boolean;
}

export interface UserPayloadIF {
  _id: any;
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  zip: number;
  gender?: GenderType;
  role?: RoleType;
  verified_email: boolean;
}
