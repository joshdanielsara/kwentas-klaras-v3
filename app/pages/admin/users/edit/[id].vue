<template>
  <div class="h-screen bg-brand-bg flex overflow-hidden">
    <AdminSidebar />
    
    <main class="flex-1 flex flex-col overflow-hidden">
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-brand-bg">
        <div class="max-w-6xl mx-auto">
          <div class="mb-6">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h1 class="text-2xl font-extrabold text-brand-blue mb-2">Edit User</h1>
                <p class="text-sm text-brand-green">Update the user details below</p>
                <div class="mt-2 text-xs text-gray-500">
                  <span class="font-medium">{{ requiredFieldsCount }}</span> required fields
                  <span v-if="remainingRequiredFields > 0" class="ml-2 text-orange-600 font-medium">
                    • {{ remainingRequiredFields }} left to complete
                  </span>
                  <span v-else class="ml-2 text-green-600 font-medium">
                    • All fields completed
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                @click="navigateTo('/admin/users')"
                class="text-brand-blue hover:text-brand-green"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Users</span>
              </Button>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-300 p-6 lg:p-8">
            <form class="space-y-8">
              <div class="space-y-6">
                <h2 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  User Information
                </h2>

                <div class="mb-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    v-model="form.role"
                    class="block w-full md:w-80 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                  >
                    <option v-for="role in roleOptions" :key="role.slug" :value="role.slug">
                      {{ role.name }}
                    </option>
                  </select>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
                      First Name <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="firstName"
                      v-model="form.firstName"
                      type="text"
                      required
                      class="block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                      placeholder="Enter first name"
                    />
                  </div>

                  <div>
                    <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
                      Last Name <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="lastName"
                      v-model="form.lastName"
                      type="text"
                      required
                      class="block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                      placeholder="Enter last name"
                    />
                  </div>

                  <div>
                    <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
                      Username <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="username"
                      v-model="form.username"
                      type="text"
                      required
                      class="block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                      placeholder="Enter username"
                    />
                  </div>

                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                      Email <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      required
                      class="block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                      placeholder="Enter email address"
                    />
                  </div>

                  <SelectInput
                    v-if="requiresDepartment"
                    id="department"
                    v-model="form.department"
                    :options="departments"
                    placeholder="Select department"
                    label="Department"
                    required
                  />

                  <SelectInput
                    id="status"
                    v-model="form.status"
                    :options="statusOptions"
                    placeholder="Select status"
                    label="Status"
                    required
                  />
                </div>
              </div>

              <div v-if="error" class="mt-4">
                <ErrorMessage :message="error" />
              </div>

              <div class="flex items-center justify-end space-x-4 pt-4">
                <Button
                  variant="secondary"
                  size="md"
                  type="button"
                  @click="navigateTo('/admin/users')"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  type="button"
                  @click="handleUpdateClick"
                  :loading="loading"
                  :disabled="loading || !isFormValid"
                >
                  <template #loading>{{ MODAL_MESSAGES.UPDATE_USER.loadingText }}</template>
                  Update User
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>

    <ConfirmModal
      :is-open="showConfirmationModal"
      :title="MODAL_MESSAGES.UPDATE_USER.title"
      :message="MODAL_MESSAGES.UPDATE_USER.message"
      :confirm-text="MODAL_MESSAGES.UPDATE_USER.confirmText"
      :cancel-text="MODAL_MESSAGES.UPDATE_USER.cancelText"
      :loading="false"
      :user-details="{
        name: `${form.firstName} ${form.lastName}`,
        role: roleOptions.find((role) => role.slug === form.role)?.name || form.role,
        email: form.email
      }"
      @confirm="onConfirmUpdate"
      @cancel="closeConfirmModal"
    />

    <LoadingModal
      :show="showLoadingModal"
      title="Updating User Account"
      message="Please wait while we update the user account..."
      :duration="2000"
    />

    <SuccessModal
      :show="showSuccessModal"
      title="User Updated Successfully"
      :message="`${form.firstName} ${form.lastName} has been updated successfully.`"
      button-text="Close"
      :auto-close-seconds="3"
      count-down-message="Closing in"
      @close="handleSuccessClose"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin'
})

import Button from '~/components/ui/Button.vue'
import ErrorMessage from '~/components/ui/ErrorMessage.vue'
import SelectInput from '~/components/ui/SelectInput.vue'
import ConfirmModal from '~/components/ui/ConfirmModal.vue'
import SuccessModal from '~/components/ui/SuccessModal.vue'
import LoadingModal from '~/components/ui/LoadingModal.vue'
import { MODAL_MESSAGES } from '~/constants/ui/modalMessages'
import { useFormModals } from '~/composables/ui/useFormModals'
import { useUsers } from '~/composables/user/useUsers'
import { useUserEditForm } from '~/composables/user/useUserEditForm'
import { USER_STATUS_OPTIONS } from '~/constants/user/userStatus'
import { useRoleOptions } from '~/composables/user/useRoleOptions'
import { useDepartments } from '~/composables/department/useDepartments'
import { roleRequiresDepartment } from '~/utils/user/roleRequiresDepartment'

const route = useRoute()
const router = useRouter()
const userId = route.params.id as string

const { users, fetchUsers } = useUsers()
const { roles: roleOptions, fetchRoleOptions, ensureRoleOption } = useRoleOptions()
const { departments: departmentRecords, fetchDepartments } = useDepartments()
const {
  showConfirmationModal,
  showLoadingModal,
  showSuccessModal,
  openConfirmModal,
  closeConfirmModal,
  startSubmission,
  closeSuccessModal,
} = useFormModals()

const editingUser = computed(() => {
  return users.value.find(u => u.id === userId) || null
})

const { form, loading, error, requiredFieldsCount, remainingRequiredFields, isFormValid, handleSubmit } = useUserEditForm(editingUser)
const requiresDepartment = computed(() => roleRequiresDepartment(form.role))

const departments = computed(() =>
  departmentRecords.value.map((dept) => ({ id: dept.id, name: dept.name, value: dept.name }))
)

const statusOptions = computed(() => USER_STATUS_OPTIONS)

onMounted(async () => {
  await Promise.all([fetchUsers(), fetchRoleOptions(), fetchDepartments()])
  if (!editingUser.value) {
    router.push('/admin/users')
    return
  }
  ensureRoleOption(editingUser.value.role)
})

watch(editingUser, (user) => {
  if (user?.role) {
    ensureRoleOption(user.role)
  }
})

const handleUpdateClick = () => {
  if (isFormValid.value) {
    openConfirmModal()
  }
}

const onConfirmUpdate = async () => {
  await startSubmission(handleSubmit)
}

const handleSuccessClose = () => {
  closeSuccessModal()
  router.push('/admin/users')
}
</script>

