import { put } from '@vercel/blob'
import type { IObjectStore, ObjectStorePutInput } from './IObjectStore'

export interface VercelBlobObjectStoreConfig {
  token: string
}

/** Writes seal evidence objects to Vercel Blob. */
export class VercelBlobObjectStore implements IObjectStore {
  private token: string

  constructor(config: VercelBlobObjectStoreConfig) {
    this.token = config.token
  }

  async putObject(input: ObjectStorePutInput): Promise<void> {
    const body =
      typeof input.body === 'string' ? Buffer.from(input.body, 'utf8') : input.body

    await put(input.key, body, {
      access: 'public',
      token: this.token,
      contentType: input.contentType,
      addRandomSuffix: false,
      allowOverwrite: true,
    })
  }
}
