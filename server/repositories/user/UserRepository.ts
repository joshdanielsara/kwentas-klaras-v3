import { prisma } from '../../lib/prisma';
import type { Prisma, PrismaClient, User } from '@prisma/client';
import { IUserRepository } from '../../interfaces/repositories/IUserRepository';

export class UserRepository implements IUserRepository {
  private client: PrismaClient;

  constructor(client?: PrismaClient) {
    this.client = client || prisma;
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.client.user.create({ data });
  }

  async findAll(): Promise<User[]> {
    const users = await this.client.user.findMany();
    const activeUsers = users.filter(user => !user.deletedAt);
    const validUsers = activeUsers.filter((user): user is User => 
      user.firebaseId !== null &&
      user.firstName !== null &&
      user.lastName !== null &&
      user.username !== null &&
      user.email !== null &&
      user.department !== null
    );
    return validUsers.sort((a, b) => {
      const aTime = a.createdAt?.getTime() ?? 0;
      const bTime = b.createdAt?.getTime() ?? 0;
      return bTime - aTime;
    });
  }

  async findDeleted(): Promise<User[]> {
    const users = await this.client.user.findMany();
    const deletedUsers = users.filter(user => user.deletedAt !== null);
    return deletedUsers.sort((a, b) => {
      const aTime = a.deletedAt?.getTime() ?? 0;
      const bTime = b.deletedAt?.getTime() ?? 0;
      return bTime - aTime;
    });
  }

  async restoreById(id: string): Promise<User> {
    return this.client.user.update({
      where: { id },
      data: { deletedAt: null }
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.client.user.findUnique({ where: { id } });
    return user && !user.deletedAt ? user : null;
  }

  async updateById(id: string, update: Prisma.UserUpdateInput): Promise<User> {
    return this.client.user.update({ where: { id }, data: update });
  }

  async deleteById(id: string): Promise<User> {
    return this.client.user.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  async findByFirebaseId(firebaseId: string): Promise<User | null> {
    const user = await this.client.user.findUnique({ where: { firebaseId } });
    return user && !user.deletedAt ? user : null;
  }

  async findByFirebaseIdForAuth(firebaseId: string): Promise<User | null> {
    return this.client.user.findUnique({ 
      where: { firebaseId }
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.client.user.findUnique({ where: { email } });
    return user && !user.deletedAt ? user : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.client.user.findUnique({ where: { username } });
    return user && !user.deletedAt ? user : null;
  }

  async findAllIncludingNullFirebaseId(): Promise<User[]> {
    const users = await this.client.user.findMany();
    const activeUsers = users.filter(user => !user.deletedAt);
    return activeUsers.sort((a, b) => {
      const aTime = a.createdAt?.getTime() ?? 0;
      const bTime = b.createdAt?.getTime() ?? 0;
      return bTime - aTime;
    });
  }
}

