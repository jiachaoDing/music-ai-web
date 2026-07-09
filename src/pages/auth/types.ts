export type AuthMode = 'login' | 'register'

export type AuthValues = {
  identifier?: string
  password?: string
  nickname?: string
  inviteCode?: string
}

export type LoginFormValues = {
  identifier: string
  password: string
}

export type RegisterFormValues = {
  nickname: string
  password: string
  inviteCode?: string
}
