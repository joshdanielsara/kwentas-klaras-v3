import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { IObjectStore, ObjectStorePutInput } from './IObjectStore'

export interface LocalObjectStoreConfig {
  /** Absolute or process-relative root directory for evidence files. */
  rootPath: string
}

/**
 * Resolve object key under rootPath and reject path traversal.
 */
export const resolveLocalObjectPath = (rootPath: string, key: string): string => {
  const root = path.resolve(rootPath)
  const normalizedKey = key.replace(/^\/+/, '').replace(/\\/g, '/')
  const target = path.resolve(root, normalizedKey)
  const rootWithSep = root.endsWith(path.sep) ? root : `${root}${path.sep}`

  if (target !== root && !target.startsWith(rootWithSep)) {
    throw new Error('[localObjectStore] object key escapes archive root')
  }

  return target
}

/** Writes seal evidence files to a local directory on this host. */
export class LocalObjectStore implements IObjectStore {
  private rootPath: string

  constructor(config: LocalObjectStoreConfig) {
    this.rootPath = config.rootPath
  }

  async putObject(input: ObjectStorePutInput): Promise<void> {
    const target = resolveLocalObjectPath(this.rootPath, input.key)
    await mkdir(path.dirname(target), { recursive: true })
    const body =
      typeof input.body === 'string' ? Buffer.from(input.body, 'utf8') : input.body
    await writeFile(target, body)
  }
}
