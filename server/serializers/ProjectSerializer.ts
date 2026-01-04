import type { Project } from '@prisma/client';

export class ProjectSerializer {
          static formatProject(project: Project, totalAddedBudget?: number) {
            return {
              id: project.id,
              name: project.name,
              implementingUnit: project.implementingUnit,
              location: (project as any).location,
              appropriation: project.appropriation,
              totalAddedBudget: totalAddedBudget ?? 0,
              startDate: project.startDate,
              endDate: project.endDate,
              year: project.year,
              services: project.services,
              remarks: (project as any).remarks,
              code: (project as any).code,
              createdAt: project.createdAt,
              updatedAt: project.updatedAt,
            };
          }

  static list(projects: Project[], budgetsMap?: Map<string, number>) {
    return projects.map(project => {
      const totalAddedBudget = budgetsMap?.get(project.id) ?? 0;
      return this.formatProject(project, totalAddedBudget);
    });
  }

  static detail(project: Project | null, totalAddedBudget?: number) {
    return project ? this.formatProject(project, totalAddedBudget) : null;
  }
}
