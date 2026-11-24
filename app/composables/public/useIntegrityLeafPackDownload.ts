export const useIntegrityLeafPackDownload = () => {
  const downloading = ref(false)
  const errorMessage = ref('')

  const downloadLeafPack = async (
    projectId: string,
    kind: string,
    leafId: string
  ) => {
    downloading.value = true
    errorMessage.value = ''
    try {
      const response = await fetch(
        `/api/public/projects/${projectId}/integrity/leaves/${kind}/${leafId}/pack`,
        { method: 'GET' }
      )
      if (!response.ok) {
        let message = 'Failed to download verify pack'
        try {
          const body = (await response.json()) as { message?: string; statusMessage?: string }
          message = body.message || body.statusMessage || message
        } catch {
          // ignore: non-JSON error body
        }
        throw new Error(message)
      }

      const blob = await response.blob()
      const disposition = response.headers.get('Content-Disposition') || ''
      const match = disposition.match(/filename="([^"]+)"/)
      const filename =
        match?.[1] || `kwentas-klaras-leaf-${kind}-${leafId.slice(0, 12)}.json`

      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = filename
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(url)
    } catch (error: unknown) {
      errorMessage.value =
        error instanceof Error ? error.message : 'Failed to download verify pack'
      console.error('[useIntegrityLeafPackDownload] download failed', {
        projectId,
        kind,
        leafId,
        error: errorMessage.value,
      })
    } finally {
      downloading.value = false
    }
  }

  return {
    downloading,
    errorMessage,
    downloadLeafPack,
  }
}
