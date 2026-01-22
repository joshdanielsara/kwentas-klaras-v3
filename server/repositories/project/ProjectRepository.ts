import { prisma } from '../../lib/prisma';
import type { Prisma, PrismaClient, Project } from '@prisma/client';
import { IProjectRepository } from '../../interfaces/repositories/IProjectRepository';

export class ProjectRepository implements IProjectRepository {
  private client: PrismaClient;

  constructor(client?: PrismaClient) {
    this.client = client || prisma;
  }

  async create(data: Prisma.ProjectCreateInput): Promise<Project> {
    return this.client.project.create({ data });
  }

  async findAll(): Promise<Project[]> {
    const projects = await this.client.project.findMany();
    const activeProjects = projects.filter(project => !project.deletedAt);
    return activeProjects.sort((a, b) => {
      if (!a.createdAt && !b.createdAt) return a.name.localeCompare(b.name);
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }

  async findById(id: string): Promise<Project | null> {
    const project = await this.client.project.findUnique({ where: { id } });
    return project && !project.deletedAt ? project : null;
  }

  async findUnique(args: { where: { id: string } }): Promise<Project | null> {
    return this.client.project.findUnique(args);
  }

  async updateById(id: string, update: Prisma.ProjectUpdateInput): Promise<Project> {
    return this.client.project.update({ where: { id }, data: update });
  }

  async deleteById(id: string): Promise<Project> {
    return this.client.project.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  async findDeleted(): Promise<Project[]> {
    const projects = await this.client.project.findMany();
    const deletedProjects = projects.filter(project => project.deletedAt !== null);
    return deletedProjects.sort((a, b) => {
      const aTime = a.deletedAt?.getTime() ?? 0;
      const bTime = b.deletedAt?.getTime() ?? 0;
      return bTime - aTime;
    });
  }

  async restoreById(id: string): Promise<Project> {
    return this.client.project.update({
      where: { id },
      data: { deletedAt: null }
    });
  }
}
