export interface JWTPayload {
  user_id: number;
  username: string;
  email: string;
  exp: number;
}
