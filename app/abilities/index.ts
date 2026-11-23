import { AbilityBuilder, Ability } from '@casl/ability';
import type { AbilityClass } from '@casl/ability';
import type { User } from '~/types/user/user';

export type Actions =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'manage'
  | 'view'
  | string;

export type Subjects =
  | 'User'
  | 'Project'
  | 'Department'
  | 'Location'
  | 'Service'
  | 'Remark'
  | 'Dashboard'
  | 'Profile'
  | 'all'
  | string;

export type AppAbility = Ability<[Actions, Subjects]>;

export const createAbility = (user: User | null): AppAbility => {
  const { can, build } = new AbilityBuilder<AppAbility>(
    Ability as AbilityClass<AppAbility>
  );

  if (!user || user.status !== 'Active') {
    return build();
  }

  const permissions = user.permissions || [];

  if (permissions.some((permission) => permission.action === 'manage' && permission.subject === 'all')) {
    can('manage', 'all');
    return build();
  }

  for (const permission of permissions) {
    can(permission.action, permission.subject);
  }

  return build();
};
