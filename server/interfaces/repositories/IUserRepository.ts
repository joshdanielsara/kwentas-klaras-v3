import type { Prisma, User } from '@prisma/client';

export interface IUserRepository {
  create(data: Prisma.UserCreateInput): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  updateById(id: string, update: Prisma.UserUpdateInput): Promise<User>;
  deleteById(id: string): Promise<User>;
  findByFirebaseId(firebaseId: string): Promise<User | null>;
  findAllIncludingNullFirebaseId(): Promise<User[]>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
}

