type FieldChecker = () => boolean

interface RequiredField {
  value: FieldChecker
}

export const getRequiredFields = (form: any, role: string): RequiredField[] => {
  const fields: RequiredField[] = [
    { value: () => !!form.firstName?.trim() },
    { value: () => !!form.lastName?.trim() },
    { value: () => !!form.username?.trim() },
    { value: () => !!form.email?.trim() },
  ]
  
  if (role === 'staffs') {
    fields.push({ value: () => !!form.department?.trim() })
  }
  
  return fields
}

