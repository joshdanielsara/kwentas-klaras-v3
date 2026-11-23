<template>
  <div class="h-screen bg-brand-bg flex overflow-hidden">
    <SuperadminSidebar />
    <main class="flex-1 flex flex-col overflow-hidden min-w-0">
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-brand-bg">
        <SuperadminNamedCatalogManager :config="config" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import SuperadminSidebar from '~/components/superadmin/Sidebar.vue'
import SuperadminNamedCatalogManager from '~/components/superadmin/NamedCatalogManager.vue'
import { SUPERADMIN_CATALOG_RESOURCES } from '~/constants/superadmin/catalogResources'

definePageMeta({
  layout: false,
  middleware: 'superadmin',
})

const config = SUPERADMIN_CATALOG_RESOURCES.find((item) => item.resource === 'departments')!

if (!config) {
  throw new Error('Implementing units catalog config missing')
}
</script>
