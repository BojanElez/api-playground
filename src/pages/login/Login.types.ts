export interface IGoogleJwtPayload {
  email: string;
  name: string;
  picture: string;
  sub: string;
  iss: string;
  aud: string;
  iat: number;
  exp: number;
}

export interface IMockUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  users: IMockUser[];
}
