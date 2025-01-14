export type CookiePayload = {
  id: string;
  mobile?: string;
  email?: string;
};
export type AccessTokenPayload = {
  id: string;
  mobile?: string;
  email?: string;
};
export type EmailTokenPayload = {
  email: string;
}
export type PhoneTokenPayload = {
  phone: string;
}