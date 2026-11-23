import type { NamedCatalogResource } from '~/types/catalog/namedCatalog'

export interface SuperadminCatalogResourceConfig {
  resource: NamedCatalogResource
  title: string
  description: string
  addLabel: string
  namePlaceholder: string
  path: string
  apiBase: string
  listKey: 'locations' | 'services' | 'departments'
  itemKey: 'location' | 'service' | 'department'
}

export const SUPERADMIN_CATALOG_RESOURCES: SuperadminCatalogResourceConfig[] = [
  {
    resource: 'locations',
    title: 'Barangays',
    description: 'Manage barangay / location options used on projects',
    addLabel: 'Add Barangay',
    namePlaceholder: 'e.g. Barangay Poblacion',
    path: '/superadmin/barangays',
    apiBase: '/api/superadmin/locations',
    listKey: 'locations',
    itemKey: 'location',
  },
  {
    resource: 'services',
    title: 'Services',
    description: 'Manage service categories used on projects',
    addLabel: 'Add Service',
    namePlaceholder: 'e.g. Social',
    path: '/superadmin/services',
    apiBase: '/api/superadmin/services',
    listKey: 'services',
    itemKey: 'service',
  },
  {
    resource: 'departments',
    title: 'Implementing Units',
    description: 'Manage implementing units / departments used on projects and users',
    addLabel: 'Add Implementing Unit',
    namePlaceholder: "e.g. Mayor's Office",
    path: '/superadmin/implementing-units',
    apiBase: '/api/superadmin/departments',
    listKey: 'departments',
    itemKey: 'department',
  },
]
