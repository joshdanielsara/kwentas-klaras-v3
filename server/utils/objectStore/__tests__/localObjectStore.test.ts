import { describe, it, after } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {
  LocalObjectStore,
  resolveLocalObjectPath,
} from '../localObjectStore'

describe('localObjectStore', () => {
  let tempRoot = ''

  after(async () => {
    if (tempRoot) {
      await rm(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects keys that escape the archive root', () => {
    assert.throws(
      () => resolveLocalObjectPath('/tmp/archive', '../outside.txt'),
      /escapes archive root/
    )
  })

  it('writes files under the configured root', async () => {
    tempRoot = await mkdtemp(path.join(os.tmpdir(), 'kk-integrity-'))
    const store = new LocalObjectStore({ rootPath: tempRoot })
    await store.putObject({
      key: 'integrity-evidence/batch-1/manifest.json',
      body: '{"ok":true}',
      contentType: 'application/json',
    })

    const written = await readFile(
      path.join(tempRoot, 'integrity-evidence/batch-1/manifest.json'),
      'utf8'
    )
    assert.equal(written, '{"ok":true}')
  })
})
