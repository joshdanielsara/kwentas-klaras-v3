import { UserRepository } from '../../repositories/user/UserRepository'
import { ProjectRepository } from '../../repositories/project/ProjectRepository'
import { ObligationRepository } from '../../repositories/obligation/ObligationRepository'
import { DisbursementRepository } from '../../repositories/disbursement/DisbursementRepository'
import { ProjectActivityRepository } from '../../repositories/project/ProjectActivityRepository'
import { ComputationService } from '../computation/ComputationService'
import { ProjectActivitySerializer } from '../../serializers/ProjectActivitySerializer'
import type { PrismaClient } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import type { DashboardStats, UtilizationRateData } from '../../types/dashboard/dashboard'

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

    const activeProjects = projects

    const budgetsMap = await this.computationService.calculateTotalAddedBudgetsMap()
    const totalBudget = projects.reduce((sum, project) => {
      const addedBudget = budgetsMap.get(project.id) || 0
      return sum + (project.appropriation || 0) + addedBudget
    }, 0)

    const totalApprovedDisbursements = disbursements
      .filter(d => d.status === 'approved')
      .reduce((sum, d) => sum + (d.amount || 0), 0)

    const totalObligations = obligations.reduce((sum, o) => sum + (o.amount || 0), 0)

    const projectsWithData = projects.filter(p => p.id && p.appropriation)
    const approvedDisbursementsMap = new Map<string, number>()
    disbursements
      .filter(d => d.status === 'approved')
      .forEach(d => {
        const current = approvedDisbursementsMap.get(d.projectId) || 0
        approvedDisbursementsMap.set(d.projectId, current + d.amount)
      })
    
    const utilizationRatesMap = await this.computationService.calculateUtilizationRatesMap(
      projectsWithData.map(p => ({ id: p.id!, appropriation: p.appropriation })),
      budgetsMap,
      approvedDisbursementsMap
    )
    
    let totalUtilization = 0
    projectsWithData.forEach(project => {
      const rate = utilizationRatesMap.get(project.id!) || 0
      totalUtilization += rate
    })
    const utilizationRate = projectsWithData.length > 0 ? totalUtilization / projectsWithData.length : 0

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
    const projectsWithData = projects.filter(p => p.id && p.appropriation)
    
    const [budgetsMap, approvedDisbursementsMap] = await Promise.all([
      this.computationService.calculateTotalAddedBudgetsMap(),
      this.computationService.calculateApprovedDisbursementsMap()
    ])
    
    const utilizationRatesMap = await this.computationService.calculateUtilizationRatesMap(
      projectsWithData.map(p => ({ id: p.id!, appropriation: p.appropriation })),
      budgetsMap,
      approvedDisbursementsMap
    )
    
    const utilizationRates = Array.from(utilizationRatesMap.values())

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
