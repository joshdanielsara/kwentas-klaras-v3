export interface User {
  id?: string
  firebaseId?: string
  firstName: string
  lastName: string
  username: string
  email: string
  department: string
  status: 'Active' | 'Inactive'
  joined?: string | Date
}

export interface UserWithPassword extends User {
  password?: string
}

