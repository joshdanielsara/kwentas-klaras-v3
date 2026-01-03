import type { User } from '@prisma/client';

export class UserSerializer {
  static formatUser(user: User) {
    return {
      id: user.id,
      firebaseId: user.firebaseId,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status,
      joined: user.joined ? new Date(user.joined).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : undefined,
    };
  }

  static list(users: User[]) {
    return users.map(user => this.formatUser(user));
  }

  static detail(user: User | null) {
    return user ? this.formatUser(user) : null;
  }
}

