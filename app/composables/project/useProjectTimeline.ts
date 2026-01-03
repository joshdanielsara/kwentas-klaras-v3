import type { Project } from '~/types/project/project'
import type { ProjectActivity } from '~/types/project/projectActivity'
import type { TimelineItem } from '~/types/project/timelineItem'
import { TIMELINE_MILESTONE_CONFIGS } from '~/constants/project/timelineMilestones'

export const useProjectTimeline = (project: Ref<Project | null>, activities?: Ref<ProjectActivity[]>) => {

  const timelineProgress = computed(() => {
    if (!project.value?.startDate || !project.value?.endDate) return 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const startDate = new Date(project.value.startDate)
    const endDate = new Date(project.value.endDate)
    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(0, 0, 0, 0)

    const totalDuration = endDate.getTime() - startDate.getTime()
    const elapsed = today.getTime() - startDate.getTime()

    if (totalDuration <= 0) return 0
    if (elapsed < 0) return 0
    if (elapsed > totalDuration) return 100

    return Math.round((elapsed / totalDuration) * 100)
  })

  const timelineMilestones = computed<TimelineItem[]>(() => {
    if (!project.value?.startDate || !project.value?.endDate) return []
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const startDate = new Date(project.value.startDate)
    const endDate = new Date(project.value.endDate)
    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(0, 0, 0, 0)

    const milestones = TIMELINE_MILESTONE_CONFIGS.map(config => ({
      label: config.label,
      date: config.getDate(startDate, endDate, today),
      isPast: config.getIsPast(startDate, endDate, today),
      isCurrent: config.getIsCurrent(startDate, endDate, today),
      isLast: config.isLast,
      isActivity: false,
    }))

    const filtered = milestones.filter(m => m.isCurrent || m.label !== 'Today' || (today >= startDate && today <= endDate))
    
    const allItems: TimelineItem[] = [...filtered]

    if (activities?.value && activities.value.length > 0) {
      const activityItems: TimelineItem[] = activities.value.map(activity => {
        const activityDate = new Date(activity.createdAt)
        activityDate.setHours(0, 0, 0, 0)
        const isPast = activityDate < today
        const isCurrent = activityDate.getTime() === today.getTime()

        let label = activity.action || 'Activity'
        if (activity.action) {
          label = activity.action.charAt(0).toUpperCase() + activity.action.slice(1).replace(/_/g, ' ')
        }

        return {
          label,
          date: activityDate,
          isPast,
          isCurrent,
          isLast: false,
          isActivity: true,
          description: activity.description,
        }
      })

      allItems.push(...activityItems)
    }

    const sorted = allItems.sort((a, b) => a.date.getTime() - b.date.getTime())
    
    return sorted.map((item, index) => ({
      ...item,
      isLast: index === sorted.length - 1,
    }))
  })

  const daysRemaining = computed(() => {
    if (!project.value?.endDate) return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const endDate = new Date(project.value.endDate)
    endDate.setHours(0, 0, 0, 0)

    const diff = endDate.getTime() - today.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

    return days
  })

  return {
    timelineProgress,
    timelineMilestones,
    daysRemaining,
  }
}

