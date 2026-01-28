export const ROLES = {
  CUSTOMER: 'customer',
  VENDOR: 'vendor',
  ADMIN: 'admin',
} as const;

export const TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh',
} as const;

export const QUEUES = {
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  PASSWORD_RESET: 'password.reset',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
