export type Challenge = {
  id: string
  title: string
  description: string
  emoji?: string
  color?: string
  participantCount: number
}

export type Battle = {
  id: string
  topic: string
  songAId: string
  songBId: string
  votesA: number
  votesB: number
}

export type Fortune = {
  id: string
  date: string
  keyword: string
  battery: number
  luckyNumber: number
  encourage: string
  songId?: string
}
