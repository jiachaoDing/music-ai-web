export type Comment = {
  id: string
  songId: string
  userId: string | null
  userName: string
  text: string
  anon: boolean
  createdAt: string
}
