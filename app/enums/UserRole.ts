export const UserRole = {
  ADMIN: 'admin',
  STAFFS: 'staffs',
} as const;

export const UserRoleLabels = {
  [UserRole.ADMIN]: 'Admin',
  [UserRole.STAFFS]: 'Staff',
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

