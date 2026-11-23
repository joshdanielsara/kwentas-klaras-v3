import { prisma } from '../../lib/prisma'
import type { AppSetting, PrismaClient } from '@prisma/client'

export class AppSettingRepository {
  private client: PrismaClient

  constructor(client?: PrismaClient) {
    this.client = client || prisma
  }

  async findByKey(key: string): Promise<AppSetting | null> {
    return this.client.appSetting.findUnique({ where: { key } })
  }

  async upsertByKey(key: string, value: string): Promise<AppSetting> {
    return this.client.appSetting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    })
  }
}
