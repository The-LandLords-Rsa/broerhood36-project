export const OWNER_EMAILS = [
  'broer.hood.36@gmail.com'
] as const;

export const isOwnerEmail = (email: string | undefined): boolean =>
  OWNER_EMAILS.some((ownerEmail) => ownerEmail === (email || '').trim().toLowerCase());
