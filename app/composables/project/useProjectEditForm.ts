import { reactive, ref, computed } from 'vue'
import { useProjects } from './useProjects'
import { useErrorHandler } from '../error/useErrorHandler'
import { getRequiredFields } from '~/constants/project/requiredFields'
import type { Project } from '~/types/project/project'

export const useProjectEditForm = (projectId: string) => {
  const { updateProject, fetchProject } = useProjects()

  const form = reactive({
    name: '',
    implementingUnit: '',
    location: '',
    appropriation: 0,
    year: new Date().getFullYear().toString(),
    startDate: '',
    endDate: '',
    services: '',
    remarks: '',
    code: '',
  })

  const loading = ref(false)
  const error = ref<string | null>(null)

  const requiredFields = computed(() => getRequiredFields(form))

  const requiredFieldsCount = computed(() => requiredFields.value.length)

  const remainingRequiredFields = computed(() => {
    return requiredFields.value.filter(field => !field.value()).length
  })

  const loadProject = async () => {
    if (!projectId) return

    loading.value = true
    error.value = null

    try {
      const project = await useErrorHandler<Project | null>(async () => {
        return await fetchProject(projectId)
      }, {
        defaultMessage: 'Failed to load project',
        onError: (err: Error) => {
          error.value = err.message
        }
      })

      if (project) {
        form.name = project.name || ''
        form.implementingUnit = project.implementingUnit || ''
        form.location = project.location || ''
        form.appropriation = project.appropriation ?? 0
        form.year = project.year ? project.year.toString() : new Date().getFullYear().toString()
        form.services = project.services || ''
        form.remarks = project.remarks || ''
        form.code = project.code || ''

        if (project.startDate) {
          const startDate = typeof project.startDate === 'string' 
            ? new Date(project.startDate) 
            : project.startDate
          if (!isNaN(startDate.getTime())) {
            form.startDate = startDate.toISOString().split('T')[0] || ''
          }
        }

        if (project.endDate) {
          const endDate = typeof project.endDate === 'string' 
            ? new Date(project.endDate) 
            : project.endDate
          if (!isNaN(endDate.getTime())) {
            form.endDate = endDate.toISOString().split('T')[0] || ''
          }
        }
      }
    } catch {
    } finally {
      loading.value = false
    }
  }

  const handleSubmit = async () => {
    error.value = null
    loading.value = true

    await useErrorHandler(async () => {
      const projectData: Partial<Project> = {
        name: form.name.trim() || undefined,
        implementingUnit: form.implementingUnit ? form.implementingUnit.trim() : undefined,
        location: form.location ? form.location.trim() : undefined,
        appropriation: form.appropriation,
        year: Number(form.year),
        services: form.services ? form.services.trim() : undefined,
        remarks: form.remarks ? form.remarks.trim() : undefined,
        code: form.code ? form.code.trim() : undefined,
        startDate: form.startDate ? new Date(form.startDate) : undefined,
        endDate: form.endDate ? new Date(form.endDate) : undefined,
      }

      await updateProject(projectId, projectData)
      await navigateTo(`/admin/projects/${projectId}`)
    }, {
      defaultMessage: 'Failed to update project',
      onError: (err: Error) => {
        error.value = err.message
        loading.value = false
      }
    })

    loading.value = false
  }

  return {
    form,
    loading,
    error,
    requiredFieldsCount,
    remainingRequiredFields,
    loadProject,
    handleSubmit,
  }
}

