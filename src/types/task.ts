export type AiTaskStatus = 'queued' | 'running' | 'done' | 'error'

export type AiTask = {
  id: string
  type: 'generate' | 'album' | 'remix' | 'fortune' | 'radio' | 'dj'
  status: AiTaskStatus
  stage?: string
  progress: number
  queueAhead?: number
  songId?: string
  albumId?: string
  error?: string
  createdAt: string
  updatedAt: string
}
