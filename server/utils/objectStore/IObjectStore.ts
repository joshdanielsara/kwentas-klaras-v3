export interface ObjectStorePutInput {
  key: string
  body: Buffer | string
  contentType: string
}

/** Minimal object storage port — local disk and R2 / S3 / GCS (S3-compatible) implement this. */
export interface IObjectStore {
  putObject(input: ObjectStorePutInput): Promise<void>
}
