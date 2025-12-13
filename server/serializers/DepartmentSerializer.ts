import type { Department } from '@prisma/client';

export class DepartmentSerializer {
  static formatDepartment(department: Department) {
    return {
      id: department.id,
      name: department.name,
    };
  }

  static list(departments: Department[]) {
    return departments.map(department => this.formatDepartment(department));
  }

  static detail(department: Department | null) {
    return department ? this.formatDepartment(department) : null;
  }
}
