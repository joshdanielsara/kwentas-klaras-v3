import { AbilityBuilder, Ability } from '@casl/ability';
import type { AbilityClass } from '@casl/ability';
import type { User } from '~/types/user/user';
import { UserRole } from '~/enums/UserRole';

export type Actions =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'manage'
  | 'view';

export type Subjects =
  | 'User'
  | 'Project'
  | 'Department'
  | 'Location'
  | 'Service'
  | 'Remark'
  | 'Dashboard'
  | 'Profile'
  | 'all';

export type AppAbility = Ability<[Actions, Subjects]>;

export const createAbility = (user: User | null): AppAbility => {
  const { can, build } = new AbilityBuilder<AppAbility>(
    Ability as AbilityClass<AppAbility>
  );

  if (!user || user.status !== 'Active') {
    return build();
  }

  switch (user.role) {
    case UserRole.ADMIN:
      can('manage', 'all');
      break;

    case UserRole.STAFFS:
      can('read', 'Dashboard');
      can('read', 'Project');
      can('read', 'Profile');
      can('update', 'Profile');
      break;
  }

  return build();
};

