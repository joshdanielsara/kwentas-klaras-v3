<template>
    <div class="h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex overflow-hidden">
      <AdminSidebar />
      
      <main class="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title="Users" subtitle="Manage and monitor all users" />
        
        <div class="flex-1 overflow-y-auto p-8">
          <div class="mb-6 flex items-center justify-between">
            <div class="flex-1 max-w-md">
              <SearchInput
                v-model="searchQuery"
                placeholder="Search users by name or email..."
              />
            </div>
            <Button @click="openAddModal" class="ml-4">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add User
            </Button>
          </div>
  
          <Table
            :columns="USER_TABLE_COLUMNS"
            :data="filteredUsers"
            key-field="id"
            empty-message="No users found"
            empty-description="Try adjusting your search criteria."
          >
            <template #cell-user="{ row }">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span class="text-indigo-600 font-semibold text-sm">{{ row.firstName.charAt(0).toUpperCase() }}</span>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ row.firstName }} {{ row.lastName }}</div>
                  <div class="text-sm text-gray-500">{{ row.username }}</div>
                </div>
              </div>
            </template>

            <template #cell-email="{ row }">
              <div class="text-sm text-gray-900">{{ row.email }}</div>
            </template>

            <template #cell-department="{ row }">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                {{ row.department }}
              </span>
            </template>

            <template #cell-status="{ row }">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="row.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                {{ row.status }}
              </span>
            </template>

            <template #cell-joined="{ row }">
              <div class="text-sm text-gray-500">{{ row.joined }}</div>
            </template>

            <template #cell-actions="{ row }">
              <div class="flex items-center justify-end space-x-2">
                <button class="text-indigo-600 hover:text-indigo-900 transition cursor-pointer">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button @click="openEditModal(row)" class="text-gray-600 hover:text-gray-900 transition cursor-pointer">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button class="text-red-600 hover:text-red-900 transition cursor-pointer">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </template>
          </Table>
  
          <div v-if="filteredUsers.length > 0" class="mt-6 flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Showing <span class="font-medium">{{ filteredUsers.length }}</span> of <span class="font-medium">{{ users.length }}</span> users
            </div>
            <div class="flex items-center space-x-2">
              <button class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                Previous
              </button>
              <button class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                Next
              </button>
            </div>
          </div>
        </div>
        
        <AdminFooter />
      </main>
  
      <AdminAddOrCreateUser
        :is-open="isModalOpen"
        :editing-user="editingUser"
        @close="closeModal"
        @save="handleSaveUser"
      />
  
      <Toast
        v-if="saveError"
        :message="saveError"
        variant="error"
        @dismiss="clearSaveError"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { USER_TABLE_COLUMNS } from '~/constants/user/tableColumns'
  import { useUsers } from '~/composables/user/useUsers'
  
  const {
    users,
    filteredUsers,
    searchQuery,
    isModalOpen,
    editingUser,
    saveError,
    openAddModal,
    openEditModal,
    closeModal,
    handleSaveUser,
    fetchUsers,
    clearSaveError,
  } = useUsers()
  
  onMounted(async () => {
    await fetchUsers()
  })
  </script>
  