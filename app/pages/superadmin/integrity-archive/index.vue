<template>
  <div class="h-screen bg-brand-bg flex overflow-hidden">
    <SuperadminSidebar />
    <main class="flex-1 flex flex-col overflow-hidden min-w-0">
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-brand-bg">
        <div class="space-y-6 max-w-3xl">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Integrity archive</h1>
            <p class="text-sm text-gray-500">
              Keep a second copy of OpenTimestamps seal evidence outside the main app database.
              On Vercel prefer <span class="font-medium text-gray-700">MongoDB (second cluster)</span>
              or <span class="font-medium text-gray-700">Vercel Blob</span>. Local disk is for on-prem hosts only.
              Offline auditor zips are on each project’s Integrity tab (Download COA pack).
            </p>
          </div>

          <div v-if="loading" class="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <div class="h-5 w-48 rounded bg-gray-200 animate-pulse"></div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="h-24 rounded-xl bg-gray-200 animate-pulse"></div>
              <div class="h-24 rounded-xl bg-gray-200 animate-pulse"></div>
              <div class="h-24 rounded-xl bg-gray-200 animate-pulse"></div>
              <div class="h-24 rounded-xl bg-gray-200 animate-pulse"></div>
            </div>
          </div>

          <template v-else>
            <div class="space-y-3">
              <h2 class="text-sm font-semibold text-gray-900">Storage provider</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  v-for="option in providers"
                  :key="option.value"
                  type="button"
                  class="text-left rounded-xl border p-4 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="
                    draft.provider === option.value
                      ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  "
                  @click="selectProvider(option.value)"
                >
                  <div class="flex items-start justify-between gap-2">
                    <p class="text-sm font-semibold text-gray-900">{{ option.label }}</p>
                    <span
                      v-if="option.recommended"
                      class="shrink-0 text-[11px] font-medium uppercase tracking-wide text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.5"
                    >
                      Recommended
                    </span>
                  </div>
                  <p class="mt-1.5 text-xs text-gray-500 leading-relaxed">{{ option.help }}</p>
                </button>
              </div>
            </div>

            <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
              <template v-if="draft.provider === 'mongo'">
                <div>
                  <label for="archive-mongo-uri" class="block text-sm font-semibold text-gray-900">
                    Mongo archive URI (optional override)
                  </label>
                  <p class="mt-1 text-xs text-gray-500">
                    Defaults to env
                    <code class="text-gray-700">INTEGRITY_ARCHIVE_MONGODB_URI</code>
                    <span v-if="archive.mongoUriEnvConfigured"> (set)</span>.
                    Leave blank to keep using env / saved URI.
                  </p>
                  <input
                    id="archive-mongo-uri"
                    v-model="draft.mongoUri"
                    type="password"
                    autocomplete="new-password"
                    :placeholder="mongoUriPlaceholder"
                    class="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label for="archive-prefix-mongo" class="block text-sm font-semibold text-gray-900">
                    Key prefix
                  </label>
                  <input
                    id="archive-prefix-mongo"
                    v-model="draft.keyPrefix"
                    type="text"
                    placeholder="integrity-evidence/"
                    autocomplete="off"
                    class="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </template>

              <template v-else-if="draft.provider === 'vercel_blob'">
                <div>
                  <label for="archive-blob-token" class="block text-sm font-semibold text-gray-900">
                    Vercel Blob token (optional override)
                  </label>
                  <p class="mt-1 text-xs text-gray-500">
                    Defaults to
                    <code class="text-gray-700">BLOB_READ_WRITE_TOKEN</code>
                    or
                    <code class="text-gray-700">INTEGRITY_ARCHIVE_VERCEL_BLOB_TOKEN</code>
                    <span v-if="archive.vercelBlobTokenEnvConfigured"> (env set)</span>.
                  </p>
                  <input
                    id="archive-blob-token"
                    v-model="draft.vercelBlobToken"
                    type="password"
                    autocomplete="new-password"
                    :placeholder="vercelBlobPlaceholder"
                    class="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label for="archive-prefix-blob" class="block text-sm font-semibold text-gray-900">
                    Key prefix
                  </label>
                  <input
                    id="archive-prefix-blob"
                    v-model="draft.keyPrefix"
                    type="text"
                    placeholder="integrity-evidence/"
                    autocomplete="off"
                    class="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </template>

              <template v-else-if="draft.provider === 'local'">
                <div>
                  <label for="archive-local-root" class="block text-sm font-semibold text-gray-900">
                    Directory path on this server
                  </label>
                  <p class="mt-1 text-xs text-gray-500">
                    Absolute path or relative to the app process (default
                    <code class="text-gray-700">{{ localRootDefault }}</code>).
                    Not durable on Vercel serverless.
                  </p>
                  <input
                    id="archive-local-root"
                    v-model="draft.localRootPath"
                    type="text"
                    autocomplete="off"
                    :placeholder="localRootDefault"
                    class="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label for="archive-prefix-local" class="block text-sm font-semibold text-gray-900">
                    Key prefix (subfolder)
                  </label>
                  <input
                    id="archive-prefix-local"
                    v-model="draft.keyPrefix"
                    type="text"
                    placeholder="integrity-evidence/"
                    autocomplete="off"
                    class="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </template>

              <template v-else-if="isCloudProvider">
                <div>
                  <label for="archive-bucket" class="block text-sm font-semibold text-gray-900">
                    Bucket name
                  </label>
                  <input
                    id="archive-bucket"
                    v-model="draft.bucket"
                    type="text"
                    autocomplete="off"
                    class="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label for="archive-endpoint" class="block text-sm font-semibold text-gray-900">
                    Endpoint URL
                    <span v-if="draft.provider === 'r2'" class="font-normal text-red-600">(required for R2)</span>
                    <span v-else class="font-normal text-gray-500">(optional)</span>
                  </label>
                  <input
                    id="archive-endpoint"
                    v-model="draft.endpoint"
                    type="url"
                    placeholder="https://&lt;accountid&gt;.r2.cloudflarestorage.com"
                    autocomplete="off"
                    class="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label for="archive-region" class="block text-sm font-semibold text-gray-900">
                      Region
                    </label>
                    <input
                      id="archive-region"
                      v-model="draft.region"
                      type="text"
                      placeholder="auto or us-east-1"
                      autocomplete="off"
                      class="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label for="archive-prefix" class="block text-sm font-semibold text-gray-900">
                      Key prefix
                    </label>
                    <input
                      id="archive-prefix"
                      v-model="draft.keyPrefix"
                      type="text"
                      placeholder="integrity-evidence/"
                      autocomplete="off"
                      class="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label for="archive-access-key" class="block text-sm font-semibold text-gray-900">
                    Access key ID
                  </label>
                  <input
                    id="archive-access-key"
                    v-model="draft.accessKeyId"
                    type="text"
                    autocomplete="off"
                    class="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label for="archive-secret" class="block text-sm font-semibold text-gray-900">
                    Secret access key
                  </label>
                  <input
                    id="archive-secret"
                    v-model="draft.secretAccessKey"
                    type="password"
                    autocomplete="new-password"
                    :placeholder="secretPlaceholder"
                    class="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p class="mt-1.5 text-xs text-gray-500">
                    Leave blank to keep the existing secret. GCS: use interoperability HMAC keys.
                  </p>
                </div>

                <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    v-model="draft.forcePathStyle"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    :disabled="draft.provider === 'r2'"
                  />
                  Force path-style URLs
                  <span v-if="draft.provider === 'r2'" class="text-xs text-gray-500">(always on for R2)</span>
                </label>
              </template>

              <p v-else class="text-sm text-gray-600">
                Archive is off. Seal evidence stays only in the main app MongoDB until you pick a provider.
              </p>

              <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>
              <p v-if="successMessage" class="text-sm text-emerald-700">{{ successMessage }}</p>

              <button
                type="button"
                class="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                :disabled="saving"
                @click="onSave"
              >
                {{ saving ? 'Saving…' : 'Save archive settings' }}
              </button>
            </div>
          </template>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import SuperadminSidebar from '~/components/superadmin/Sidebar.vue'
import {
  INTEGRITY_ARCHIVE_SECRET_MASK,
  INTEGRITY_ARCHIVE_SETTINGS_DEFAULT,
  type IntegrityArchiveSettings,
} from '~/constants/audit/integrityArchiveSettings'
import {
  INTEGRITY_ARCHIVE_LOCAL_ROOT_DEFAULT,
  INTEGRITY_ARCHIVE_PROVIDER,
  isIntegrityArchiveCloudProvider,
  type IntegrityArchiveProvider,
} from '~/constants/audit/integrityArchiveProviders'
import { useIntegrityArchiveSettings } from '~/composables/superadmin/useIntegrityArchiveSettings'

definePageMeta({
  layout: false,
  middleware: 'superadmin',
})

const {
  archive,
  providers,
  loading,
  saving,
  errorMessage,
  successMessage,
  fetchIntegrityArchiveSettings,
  saveIntegrityArchiveSettings,
} = useIntegrityArchiveSettings()

const draft = ref<IntegrityArchiveSettings>({ ...INTEGRITY_ARCHIVE_SETTINGS_DEFAULT })
const localRootDefault = INTEGRITY_ARCHIVE_LOCAL_ROOT_DEFAULT

const isCloudProvider = computed(() => isIntegrityArchiveCloudProvider(draft.value.provider))

const secretPlaceholder = computed(() =>
  archive.value.secretConfigured
    ? 'Saved secret on file — enter a new value only to replace it'
    : 'Enter secret access key'
)

const mongoUriPlaceholder = computed(() =>
  archive.value.mongoUriConfigured
    ? 'Saved URI on file — enter a new value only to replace it'
    : archive.value.mongoUriEnvConfigured
      ? 'Using INTEGRITY_ARCHIVE_MONGODB_URI from env — optional override'
      : 'mongodb+srv://…/integrity_archive'
)

const vercelBlobPlaceholder = computed(() =>
  archive.value.vercelBlobTokenConfigured
    ? 'Saved token on file — enter a new value only to replace it'
    : archive.value.vercelBlobTokenEnvConfigured
      ? 'Using Blob token from env — optional override'
      : 'vercel_blob_rw_…'
)

const syncDraftFromArchive = () => {
  draft.value = {
    provider: archive.value.provider,
    localRootPath: archive.value.localRootPath || INTEGRITY_ARCHIVE_LOCAL_ROOT_DEFAULT,
    mongoUri: '',
    vercelBlobToken: '',
    bucket: archive.value.bucket,
    accessKeyId: archive.value.accessKeyId,
    secretAccessKey: '',
    endpoint: archive.value.endpoint,
    region: archive.value.region,
    keyPrefix: archive.value.keyPrefix,
    forcePathStyle: archive.value.forcePathStyle,
  }
}

const selectProvider = (provider: IntegrityArchiveProvider) => {
  draft.value.provider = provider
  if (provider === INTEGRITY_ARCHIVE_PROVIDER.R2) {
    draft.value.forcePathStyle = true
  }
  if (
    provider === INTEGRITY_ARCHIVE_PROVIDER.LOCAL &&
    !draft.value.localRootPath.trim()
  ) {
    draft.value.localRootPath = INTEGRITY_ARCHIVE_LOCAL_ROOT_DEFAULT
  }
}

onMounted(async () => {
  await fetchIntegrityArchiveSettings()
  syncDraftFromArchive()
})

watch(
  () => draft.value.provider,
  (provider) => {
    if (provider === INTEGRITY_ARCHIVE_PROVIDER.R2) {
      draft.value.forcePathStyle = true
    }
  }
)

const onSave = async () => {
  const payload: IntegrityArchiveSettings = {
    ...draft.value,
    secretAccessKey:
      draft.value.secretAccessKey.trim() ||
      (archive.value.secretConfigured ? INTEGRITY_ARCHIVE_SECRET_MASK : ''),
    mongoUri:
      draft.value.mongoUri.trim() ||
      (archive.value.mongoUriConfigured ? INTEGRITY_ARCHIVE_SECRET_MASK : ''),
    vercelBlobToken:
      draft.value.vercelBlobToken.trim() ||
      (archive.value.vercelBlobTokenConfigured ? INTEGRITY_ARCHIVE_SECRET_MASK : ''),
  }
  await saveIntegrityArchiveSettings(payload)
  syncDraftFromArchive()
}
</script>
