import { UserRepository } from '../../repositories/user/UserRepository'
import { ProjectRepository } from '../../repositories/project/ProjectRepository'
import { ObligationRepository } from '../../repositories/obligation/ObligationRepository'
import { DisbursementRepository } from '../../repositories/disbursement/DisbursementRepository'
import { ProjectActivityRepository } from '../../repositories/project/ProjectActivityRepository'
import { ComputationService } from '../computation/ComputationService'
import { ProjectActivitySerializer } from '../../serializers/ProjectActivitySerializer'
import type { PrismaClient } from '@prisma/client'
import { prisma } from '../../lib/prisma'

export interface DashboardStats {
  totalUsers: number
  activeProjects: number
  totalBudget: number
  totalApprovedDisbursements: number
  totalObligations: number
  utilizationRate: number
  recentActivities: Array<{
    id: string
    projectId: string
    action: string
    description: string
    createdAt: Date | string | null
  }>
}

export interface UtilizationRateData {
  label: string
  value: number
  color: string
}

export class DashboardService {
  private userRepo: UserRepository
  private projectRepo: ProjectRepository
  private obligationRepo: ObligationRepository
  private disbursementRepo: DisbursementRepository
  private activityRepo: ProjectActivityRepository
  private computationService: ComputationService
  private client: PrismaClient

  constructor(prismaClient?: PrismaClient) {
    this.client = prismaClient || prisma
    this.userRepo = new UserRepository(prismaClient)
    this.projectRepo = new ProjectRepository(prismaClient)
    this.obligationRepo = new ObligationRepository(prismaClient)
    this.disbursementRepo = new DisbursementRepository(prismaClient)
    this.activityRepo = new ProjectActivityRepository(prismaClient)
    this.computationService = new ComputationService(prismaClient)
  }

  async getStats(): Promise<DashboardStats> {
    const [users, projects, obligations, disbursements, activities] = await Promise.all([
      this.userRepo.findAll(),
      this.projectRepo.findAll(),
      this.obligationRepo.findAll(),
      this.disbursementRepo.findAll(),
      this.activityRepo.findRecent(10)
    ])

    const currentYear = new Date().getFullYear()
    const activeProjects = projects.filter(p => p.year && p.year >= currentYear)

    // Calculate total budget (appropriation + added budgets)
    const budgetsMap = await this.computationService.calculateTotalAddedBudgetsMap()
    const totalBudget = projects.reduce((sum, project) => {
      const addedBudget = budgetsMap.get(project.id) || 0
      return sum + (project.appropriation || 0) + addedBudget
    }, 0)

    // Calculate total approved disbursements
    const totalApprovedDisbursements = disbursements
      .filter(d => d.status === 'approved')
      .reduce((sum, d) => sum + (d.amount || 0), 0)

    // Calculate total obligations
    const totalObligations = obligations.reduce((sum, o) => sum + (o.amount || 0), 0)

    // Calculate average utilization rate
    let totalUtilization = 0
    let projectCount = 0
    for (const project of projects) {
      if (project.id && project.appropriation) {
        const utilizationRate = await this.computationService.calculateUtilizationRate(
          project.id,
          project.appropriation
        )
        totalUtilization += utilizationRate
        projectCount++
      }
    }
    const utilizationRate = projectCount > 0 ? totalUtilization / projectCount : 0

    // Get recent activities (filter out null createdAt and ensure proper typing)
    const recentActivities = activities
      .filter((activity): activity is typeof activity & { createdAt: Date } => activity.createdAt !== null)
      .map(activity => {
        const formatted = ProjectActivitySerializer.format(activity)
        return {
          id: formatted.id,
          projectId: formatted.projectId,
          action: formatted.action,
          description: formatted.description,
          createdAt: formatted.createdAt as Date
        }
      })

    return {
      totalUsers: users.length,
      activeProjects: activeProjects.length,
      totalBudget,
      totalApprovedDisbursements,
      totalObligations,
      utilizationRate: Number(utilizationRate.toFixed(2)),
      recentActivities,
    }
  }

  async getUtilizationRateData(): Promise<UtilizationRateData[]> {
    const projects = await this.projectRepo.findAll()
    const utilizationRates: number[] = []

    for (const project of projects) {
      if (project.id && project.appropriation) {
        const rate = await this.computationService.calculateUtilizationRate(
          project.id,
          project.appropriation
        )
        utilizationRates.push(rate)
      }
    }

    // Categorize projects by utilization rate
    const active = utilizationRates.filter(r => r >= 50 && r < 100).length
    const idle = utilizationRates.filter(r => r < 50).length
    const overUtilized = utilizationRates.filter(r => r >= 100).length

    const total = active + idle + overUtilized
    if (total === 0) {
      return [
        { label: 'Active', value: 0, color: '#2563EB' },
        { label: 'Idle', value: 0, color: '#22C98D' },
        { label: 'Over-Utilized', value: 0, color: '#F59E0B' }
      ]
    }

    const activePercent = Math.round((active / total) * 100)
    const idlePercent = Math.round((idle / total) * 100)
    const overUtilizedPercent = 100 - activePercent - idlePercent

    return [
      { label: 'Active (50-99%)', value: activePercent, color: '#2563EB' },
      { label: 'Idle (<50%)', value: idlePercent, color: '#22C98D' },
      { label: 'Over-Utilized (≥100%)', value: overUtilizedPercent, color: '#F59E0B' }
    ]
  }
}
