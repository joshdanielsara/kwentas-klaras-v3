import type { User } from './user'

export interface UserWithPassword extends User {
  password?: string
}
