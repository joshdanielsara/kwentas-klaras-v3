export interface Project {
  id?: string
  name: string
  implementingUnit: string
  location?: string
  appropriation: number
  startDate: string | Date
  endDate: string | Date
  year: number
  services: string
  remarks?: string
  code?: string
}

