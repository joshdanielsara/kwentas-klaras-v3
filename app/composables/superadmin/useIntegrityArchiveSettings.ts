import {
  INTEGRITY_ARCHIVE_SETTINGS_DEFAULT,
  type IntegrityArchiveSettings,
} from '~/constants/audit/integrityArchiveSettings'
import type { IntegrityArchiveProvider } from '~/constants/audit/integrityArchiveProviders'
import { integrityArchiveSaveSuccessMessage } from '~/constants/audit/integrityArchiveMessages'
import { useSuperadminAuth } from './useSuperadminAuth'

type PublicArchiveSettings = IntegrityArchiveSettings & {
  secretConfigured: boolean
  mongoUriConfigured: boolean
  vercelBlobTokenConfigured: boolean
  mongoUriEnvConfigured: boolean
  vercelBlobTokenEnvConfigured: boolean
}

type ProviderOption = {
  value: IntegrityArchiveProvider
  label: string
  help: string
  recommended?: boolean
}

export const useIntegrityArchiveSettings = () => {
  const { fetchCsrfHeaders } = useSuperadminAuth()
  const archive = ref<PublicArchiveSettings>({
    ...INTEGRITY_ARCHIVE_SETTINGS_DEFAULT,
    secretConfigured: false,
    mongoUriConfigured: false,
    vercelBlobTokenConfigured: false,
    mongoUriEnvConfigured: false,
    vercelBlobTokenEnvConfigured: false,
  })
  const providers = ref<ProviderOption[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const errorMessage = ref('')
  const successMessage = ref('')

  const fetchIntegrityArchiveSettings = async () => {
    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''
    try {
      const response = await $fetch<{
        success: boolean
        archive: PublicArchiveSettings
        providers: ProviderOption[]
      }>('/api/superadmin/settings/integrity-archive')
      archive.value = response.archive
      providers.value = response.providers
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string }
      errorMessage.value =
        err.data?.message || err.message || 'Failed to load integrity archive settings'
      console.error('[useIntegrityArchiveSettings] fetch failed', {
        error: errorMessage.value,
      })
    } finally {
      loading.value = false
    }
  }

  const saveIntegrityArchiveSettings = async (next: IntegrityArchiveSettings) => {
    saving.value = true
    errorMessage.value = ''
    successMessage.value = ''
    try {
      const headers = await fetchCsrfHeaders()
      const response = await $fetch<{
        success: boolean
        archive: PublicArchiveSettings
        providers: ProviderOption[]
      }>('/api/superadmin/settings/integrity-archive', {
        method: 'PUT',
        headers,
        body: { archive: next },
      })
      archive.value = response.archive
      providers.value = response.providers
      successMessage.value = integrityArchiveSaveSuccessMessage(response.archive.provider)
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string }
      errorMessage.value =
        err.data?.message || err.message || 'Failed to save integrity archive settings'
      console.error('[useIntegrityArchiveSettings] save failed', {
        error: errorMessage.value,
      })
    } finally {
      saving.value = false
    }
  }

  return {
    archive,
    providers,
    loading,
    saving,
    errorMessage,
    successMessage,
    fetchIntegrityArchiveSettings,
    saveIntegrityArchiveSettings,
  }
}
