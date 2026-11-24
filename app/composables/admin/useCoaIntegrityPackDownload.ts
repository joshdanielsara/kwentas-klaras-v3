export const useCoaIntegrityPackDownload = () => {
  const downloading = ref(false)
  const errorMessage = ref('')

  const downloadCoaPack = async (projectId: string) => {
    downloading.value = true
    errorMessage.value = ''
    try {
      const response = await fetch(`/api/projects/${projectId}/integrity/coa-pack`, {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) {
        let message = 'Failed to download COA integrity pack'
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
      const filename = match?.[1] || `kwentas-klaras-coa-integrity-${projectId}.zip`

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
        error instanceof Error ? error.message : 'Failed to download COA integrity pack'
      console.error('[useCoaIntegrityPackDownload] download failed', {
        projectId,
        error: errorMessage.value,
      })
    } finally {
      downloading.value = false
    }
  }

  return {
    downloading,
    errorMessage,
    downloadCoaPack,
  }
}
