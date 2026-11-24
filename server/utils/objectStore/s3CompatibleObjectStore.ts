import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import type { IObjectStore, ObjectStorePutInput } from './IObjectStore'

export interface S3CompatibleObjectStoreConfig {
  bucket: string
  region: string
  accessKeyId: string
  secretAccessKey: string
  /** Required for Cloudflare R2 and optional custom S3 endpoints. */
  endpoint?: string
  forcePathStyle?: boolean
}

/** Works with Cloudflare R2, AWS S3, and GCS via S3 interoperability HMAC keys. */
export class S3CompatibleObjectStore implements IObjectStore {
  private client: S3Client
  private bucket: string

  constructor(config: S3CompatibleObjectStoreConfig) {
    this.bucket = config.bucket
    this.client = new S3Client({
      region: config.region,
      endpoint: config.endpoint || undefined,
      forcePathStyle: config.forcePathStyle === true,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    })
  }

  async putObject(input: ObjectStorePutInput): Promise<void> {
    const body =
      typeof input.body === 'string' ? Buffer.from(input.body, 'utf8') : input.body

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: input.key,
        Body: body,
        ContentType: input.contentType,
      })
    )
  }
}
