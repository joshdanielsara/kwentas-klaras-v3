import { MongoClient, type Db } from 'mongodb'
import { INTEGRITY_ARCHIVE_MONGO_COLLECTION } from '../../../app/constants/audit/integrityArchiveProviders'
import type { IObjectStore, ObjectStorePutInput } from './IObjectStore'

export interface MongoObjectStoreConfig {
  uri: string
  collectionName?: string
}

type SealEvidenceDoc = {
  key: string
  contentType: string
  body: string
  encoding: 'utf8' | 'base64'
  createdAt?: Date
  updatedAt: Date
}

/**
 * Upserts seal evidence documents into a separate Mongo cluster.
 * Filter/upsert key is the object path (e.g. integrity-evidence/{batchId}/manifest.json).
 */
export class MongoObjectStore implements IObjectStore {
  private uri: string
  private collectionName: string

  constructor(config: MongoObjectStoreConfig) {
    this.uri = config.uri
    this.collectionName = config.collectionName || INTEGRITY_ARCHIVE_MONGO_COLLECTION
  }

  async putObject(input: ObjectStorePutInput): Promise<void> {
    const client = new MongoClient(this.uri)
    try {
      await client.connect()
      const db = this.resolveDb(client)
      const body =
        typeof input.body === 'string' ? input.body : input.body.toString('base64')
      const encoding: SealEvidenceDoc['encoding'] =
        typeof input.body === 'string' ? 'utf8' : 'base64'

      await db.collection<SealEvidenceDoc>(this.collectionName).updateOne(
        { key: input.key },
        {
          $set: {
            key: input.key,
            contentType: input.contentType,
            body,
            encoding,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        { upsert: true }
      )
    } finally {
      await client.close()
    }
  }

  private resolveDb(client: MongoClient): Db {
    return client.db()
  }
}
