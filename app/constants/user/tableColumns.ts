import type { TableColumn } from '~/types/ui/table'

export const USER_TABLE_COLUMNS: TableColumn[] = [
  { key: 'user', label: 'User', align: 'left' },
  { key: 'email', label: 'Email', align: 'left' },
  { key: 'department', label: 'Department', align: 'left' },
  { key: 'status', label: 'Status', align: 'left' },
  { key: 'joined', label: 'Joined', align: 'left' },
  { key: 'actions', label: 'Actions', align: 'right' },
]
